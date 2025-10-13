import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { coverLetterId, jobTitle, companyName, jobDescription } = await req.json();
        
        if (!coverLetterId || !jobTitle || !companyName || !jobDescription) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress || "";

        console.log("Generating cover letter for:", { jobTitle, companyName, userEmail });

        const resultIds = await inngest.send({
            name: "AiCoverLetterAgent",
            data: {
                coverLetterId: coverLetterId,
                jobTitle: jobTitle,
                companyName: companyName,
                jobDescription: jobDescription,
                userEmail: userEmail
            },
        });

        const runId = resultIds?.ids[0];
        
        if (!runId) {
            return NextResponse.json({ error: "Failed to start Inngest run" }, { status: 500 });
        }

        let runStatus;
        // Use polling
        while (true) {
            runStatus = await getRuns(runId);

            if (!runStatus) {
                console.error("Failed to fetch run status");
                return NextResponse.json({ error: "Failed to fetch run status" }, { status: 500 });
            }

            const status = runStatus?.data[0]?.status;
            console.log("Run status:", status);

            if (status === "Completed") {
                break;
            }

            await new Promise(r => setTimeout(r, 500));
        }

        const finalOutput = JSON.parse(
            JSON.stringify(runStatus?.data?.[0]?.output?.output?.[0] || {})
        );
        
        console.log("Cover letter generation completed");
        return NextResponse.json(finalOutput);
    }
    catch (error: any) {
        console.error("❌ Server Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error", stack: error?.stack },
            { status: 500 }
        );
    }
}

export async function getRuns(runId: string) {
    try {
        const result = await axios.get(
            `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
                },
            }
        );
        return result.data;
    } catch (err: any) {
        console.error("Error fetching run:", err.message);
        return null;
    }
}
