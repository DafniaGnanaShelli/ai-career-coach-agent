// Update the import path to the correct location of your inngest client
// Update the import path to the correct location of your inngest client
// import { inngest } from "../../inngest/client";
import { inngest } from "@/inngest/client"; // Update this path as needed based on your project structure
import axios from "axios";
import { NextResponse, userAgent } from "next/server"
import { run } from "node:test";

export async function POST(req: any) {
  const { userInput } = await req.json();
  const resultIds = await inngest.send({
    name: "AiCareerAgent",
    data: {
      userInput: userInput,
    },
  });
  const runId = resultIds?.ids[0];
  let runStatus;
  while (true) {
    runStatus = await getRuns(runId);

    const status = runStatus?.data[0]?.status;
    //console.log("Run status:", status);

    if (status === "Completed") {
      break;
    }

    await new Promise(r => setTimeout(r, 500));
  }
  return NextResponse.json(runStatus.data?.[0].output?.output[0]);

}
async function getRuns(runId: string) {
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