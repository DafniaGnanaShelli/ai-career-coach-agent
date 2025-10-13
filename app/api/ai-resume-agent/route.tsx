import { NextResponse, NextRequest } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting Resume Upload ===");

    // 🧾 Parse form data
    const formData = await request.formData();
    const resumeFile: any = formData.get("resumeFile");
    const recordId = formData.get("recordId");

    console.log("Received request - recordId:", recordId, "resumeFile:", resumeFile?.name);

    if (!resumeFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 📄 Load and extract text using LangChain PDF Loader
    console.log("Loading PDF...");
    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    console.log("PDF loaded successfully. Pages:", docs.length);

    // 🧬 Convert file to base64 string
    console.log("Converting to base64...");
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // 👤 Get current user
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "";
    console.log("User email:", userEmail);

    // 🧩 Make sure all fields are serializable
    const payload = {
      recordId: String(recordId || ""),
      base64ResumeFile: String(base64 || ""),
      pdfText: String(docs[0]?.pageContent || ""),
      aiAgentType: "/ai-tools/ai-resume-analyzer",
      userEmail: String(userEmail || "")
    };

    // ✅ Test JSON serialization
    try {
      JSON.stringify(payload);
      console.log("Payload is JSON-serializable ✅");
    } catch (e:any) {
      console.error("Serialization failed ❌:", e);
      return NextResponse.json(
        { error: "Payload not serializable", details: e.message },
        { status: 500 }
      );
    }

    // 🚀 Send event to Inngest
    console.log("Sending event to Inngest...");
    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: payload,
    });

    const runId = resultIds?.ids?.[0];
    console.log("Inngest run ID:", runId);

    if (!runId) {
      return NextResponse.json({ error: "Failed to start Inngest run" }, { status: 500 });
    }

    // 🔁 Poll for completion
    let runStatus;
    while (true) {
      runStatus = await getRuns(runId);

      if (!runStatus) {
        console.error("Failed to fetch run status");
        return NextResponse.json({ error: "Failed to fetch run status" }, { status: 500 });
      }

      const status = runStatus?.data?.[0]?.status;
      console.log("Run status:", status);

      if (status === "Completed") break;

      await new Promise((r) => setTimeout(r, 500));
    }

    // 🧾 Extract and return final output safely
    const output = runStatus?.data?.[0]?.output?.output?.[0];
    console.log("Run completed. Output received:", output ? "YES" : "NO");

    // 🛡 Ensure serializable output
    return NextResponse.json(
      typeof output === "object" ? output : { output }
    );

  } catch (error: any) {
    console.error("=== ERROR in POST handler ===");
    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        details: error.stack || "",
      },
      { status: 500 }
    );
  }
}

// 🔍 Helper function to poll Inngest run status
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
