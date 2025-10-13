
import { HistoryTable } from "@/configs/schema";
import { inngest } from "./client";
import { createAgent, openai, gemini } from '@inngest/agent-kit';
import ImageKit from "imagekit";
// @ts-ignore
import pdfParse from "pdf-parse";
import { db } from "@/configs/db";
import { eventNames } from "process";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);



export const AiRoadmapGeneratorAgent = createAgent(
  {
    name: "AiRoadmapGeneratorAgent",
    description: 'Generate Details Tree Like Flow Roadmap',
    system: `Generate a React flow tree-structured learning roadmap for user input position/ skills the following format:
 vertical tree structure with meaningful x/y positions to form a flow

- Structure should be similar to roadmap.sh layout
- Steps should be ordered from fundamentals to advanced
- Include branching for different specializations (if applicable)
- Each node must have a title, short description, and learning resource link
- Use unique IDs for all nodes and edges
- make it more specious node position, 
- Response n JSON format
{
roadmapTitle:'',
description:<3-5 Lines>,
duration:'',
initialNodes : [
{
 id: '1',
 type: 'turbo',
 position: { x: 0, y: 0 },
 data: {
title: 'Step Title',
description: 'Short two-line explanation of what the step covers.',
link: 'Helpful link for learning this step',
 },
},
...
],
initialEdges : [
{
 id: 'e1-2',
 source: '1',
 target: '2',
},
...
];
}

`
    ,
    model: gemini({
      model: "gemini-flash-lite-latest",
      apiKey: process.env.GEMINI_API_KEY,
    }),
  }
)

export const AiRoadmapAgent = inngest.createFunction(

  { id: 'AiRoadmapAgent' },
  { event: 'AiRoadmapAgent' },
  async ({ event, step }) => {
    const { roadmapId, userInput, userEmail } = await event.data;

    const roadmapResult = await AiRoadmapGeneratorAgent.run(userInput);
    //@ts-ignore
    const rawContent = roadmapResult.output[0]?.content;
    const rawContentJson = rawContent.replace('```json', '').replace('```', '');
    const parseJson = JSON.parse(rawContentJson);
    const saveToDb = await step.run('SaveToDb', async () => {
      try {
        const result = await db.insert(HistoryTable).values({
          recordId: roadmapId,
          content: parseJson,
          aiAgentType: '/ai-tools/ai-roadmap-agent',
          createdAt: new Date().toISOString(),
          userEmail,
          metaData: userInput,
        }).execute(); // ✅ Add this if you're using Drizzle or Prisma
        console.log("DB Insert Success:", result);
        return parseJson;
      } catch (error) {
        console.error("DB Insert Error:", error);
        throw error; // Rethrow so Inngest marks the step as failed
      }
    });


  }


)





export const AiCareerChatAgent = createAgent({
  name: "AI Career Chat",
  description: "A chat agent to help users with career advice.",
  system: `You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers, including job search advice, interview preparation, resume improvement, skill development, career transitions, and industry trends. Always respond with clarity, encouragement, and actionable advice tailored to the user's needs. If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest relevant career-focused questions instead`,
  model: gemini({
    model: "gemini-flash-lite-latest",
    apiKey: process.env.GEMINI_API_KEY,
  }),
})

export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    const { userInput } = event.data;

    if (!userInput) {
      throw new Error("Missing userInput in event data");
    }

    const result = await AiCareerChatAgent.run(userInput);
    return result;
  },

);
var imagekit = new ImageKit({
  //@ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL
});



export const AiResumeAnalzyerAgent = createAgent({
  name: 'AiResumeAnalzyerAgent',
  description: 'Ai resume Analyzer',
  system: `You are an advanced AI Resume Analyzer Agent.

Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.



📤 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:



overall_score (0–100)



overall_feedback (short message e.g., "Excellent", "Needs improvement")



summary_comment (1–2 sentence evaluation summary)



Section scores for:



Contact Info



Experience



Education



Skills



Each section should include:



score (as percentage)



Optional comment about that section



Tips for improvement (3–5 tips)



What’s Good (1–3 strengths)



Needs Improvement (1–3 weaknesses)



🧠 Output JSON Schema:

json

Copy

Edit

{

  "overall_score": 85,

  "overall_feedback": "Excellent!",

  "summary_comment": "Your resume is strong, but there are areas to refine.",

  "sections": {

    "contact_info": {

      "score": 95,

      "comment": "Perfectly structured and complete."

    },

    "experience": {

      "score": 88,

      "comment": "Strong bullet points and impact."

    },

    "education": {

      "score": 70,

      "comment": "Consider adding relevant coursework."

    },

    "skills": {

      "score": 60,

      "comment": "Expand on specific skill proficiencies."

    }

  },

  "tips_for_improvement": [

    "Add more numbers and metrics to your experience section to show impact.",

    "Integrate more industry-specific keywords relevant to your target roles.",

    "Start bullet points with strong action verbs to make your achievements stand out."

  ],

  "whats_good": [

    "Clean and professional formatting.",

    "Clear and concise contact information.",

    "Relevant work experience."

  ],

  "needs_improvement": [

    "Skills section lacks detail.",

    "Some experience bullet points could be stronger.",

    "Missing a professional summary/objective."

  ]

}`,
  model: gemini({
    model: "gemini-flash-lite-latest",
    apiKey: process.env.GEMINI_API_KEY,
  })
})






export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail } = await event?.data;
    //upload file to cloud storage

    const uploadFileUrl = await step.run("uploadImage", async () => {
      const imageKitFile = await imagekit.upload(
        {
          file: base64ResumeFile,
          fileName: `${Date.now()}.pdf`,
          isPublished: true
        }
      );
      console.log("✅ Uploaded resume URL:", imageKitFile.url);
      return imageKitFile.url;
    })
    const aiResumeReport = await AiResumeAnalzyerAgent.run(pdfText);
    //@ts-ignore
    const rawContent = aiResumeReport.output[0]?.content;
    const rawContentJson = rawContent.replace('```json', '').replace('```', '');
    const parseJson = JSON.parse(rawContentJson);
    // return parseJson; 
    //Save to database

    const saveToDb = await step.run('SaveToDb', async () => {
      const result = await db.insert(HistoryTable).values(
        {
          recordId: recordId,
          content: parseJson,
          aiAgentType: aiAgentType,
          createdAt: (new Date()).toString(),
          userEmail: userEmail,
          metaData: uploadFileUrl
        }
      )
      console.log(result);
      return parseJson;
    })

  });


export const AiCoverLetterGeneratorAgent = createAgent({
  name: 'AiCoverLetterGeneratorAgent',
  description: 'Generate professional cover letters tailored to job descriptions',
  system: `You are an expert cover letter writing assistant. Your task is to generate professional, compelling cover letters tailored to specific job positions and companies.

Given a job title, company name, and job description, create a personalized cover letter that:
- Highlights relevant skills and experiences
- Shows genuine interest in the company and position
- Uses professional but engaging language
- Follows proper cover letter structure
- Is concise (3-4 paragraphs max)

Return your response in the following JSON format:
{
  "jobTitle": "The job title provided",
  "companyName": "The company name provided",
  "header": "Your Name\\nYour Address\\nYour Phone\\nYour Email\\n\\nDate\\n\\nHiring Manager's Name (or 'Hiring Manager')\\nCompany Name\\nCompany Address",
  "salutation": "Dear Hiring Manager, (or specific name if known)",
  "opening": "A strong opening paragraph that mentions the position and expresses enthusiasm",
  "body": "2-3 paragraphs highlighting relevant skills, experiences, and why you're a great fit. Show knowledge of the company and explain how you can contribute to their goals.",
  "closing": "A closing paragraph expressing interest in an interview and thanking them for consideration",
  "signature": "Sincerely,\\n\\nYour Name",
  "tips": [
    "Customize the placeholders with your actual information",
    "Research the company and add specific details if possible",
    "Proofread carefully before sending",
    "Keep the tone professional but personable"
  ]
}

Make sure the cover letter is:
- Tailored to the specific job description
- Professional and error-free
- Compelling and shows enthusiasm
- Highlights transferable skills
- Shows research about the company (use information from job description)`,
  model: gemini({
    model: "gemini-flash-lite-latest",
    apiKey: process.env.GEMINI_API_KEY,
  })
})

export const AiCoverLetterAgent = inngest.createFunction(
  { id: "AiCoverLetterAgent" },
  { event: "AiCoverLetterAgent" },
  async ({ event, step }) => {
    const { coverLetterId, jobTitle, companyName, jobDescription, userEmail } = await event.data;

    const userInput = `Job Title: ${jobTitle}\nCompany: ${companyName}\n\nJob Description:\n${jobDescription}`;
    
    const coverLetterResult = await AiCoverLetterGeneratorAgent.run(userInput);
    //@ts-ignore
    const rawContent = coverLetterResult.output[0]?.content;
    const rawContentJson = rawContent.replace('```json', '').replace('```', '');
    const parseJson = JSON.parse(rawContentJson);
    
    const saveToDb = await step.run('SaveToDb', async () => {
      try {
        const result = await db.insert(HistoryTable).values({
          recordId: coverLetterId,
          content: parseJson,
          aiAgentType: '/ai-tools/ai-cover-letter-generator',
          createdAt: new Date().toISOString(),
          userEmail,
          metaData: JSON.stringify({ jobTitle, companyName }),
        }).execute();
        console.log("DB Insert Success:", result);
        return parseJson;
      } catch (error) {
        console.error("DB Insert Error:", error);
        throw error;
      }
    });

    return saveToDb;
  }
);