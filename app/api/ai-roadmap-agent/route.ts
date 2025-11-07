import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { roadmapId, userInput } = await req.json();
    const user = await currentUser();
    const resultIds = await inngest.send({
      name: "AiRoadmapAgent",
      data: {
        userInput: userInput,
        roadmapId: roadmapId,
        userEmail: user?.primaryEmailAddress?.emailAddress
      },
    });
    const runId = resultIds?.ids[0];
    let runStatus;
    //Use pooing
    while (true) {
      runStatus = await getRuns(runId);

      const status = runStatus?.data[0]?.status;
      //console.log("Run status:", status);

      if (status === "Completed") {
        break;
      }

      await new Promise(r => setTimeout(r, 500));
    }
    const finalOutput = JSON.parse(
      JSON.stringify(runStatus?.data?.[0]?.output?.output?.[0] || {})
    );
    console.log("Output to return:", runStatus?.data?.[0]?.output?.output?.[0]);
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
