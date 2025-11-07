
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
    system: `


    Generate a React Flow–compatible learning roadmap for the given user role or skill set.
The roadmap must visually resemble the layout of roadmap.sh
, following a vertical tree structure with meaningful x and y coordinates to ensure a clean flow from foundational to advanced concepts.

🧩 Output Requirements
1. Structure

Use a vertical hierarchical layout with proper spacing between nodes.

Follow a progressive order:

Fundamentals → Intermediate → Advanced

Include branching paths for different specialization areas (e.g., frontend vs backend).

Ensure nodes are spaciously positioned to maintain visual clarity and readability.

2. Node Specifications

Each node must:

Have a unique ID

Use type "turbo"

There must be atleast 50px vertical spacing between nodes

Contain a position object with numeric { x, y } coordinates

Include a data object with:

title: short, clear topic name

description: concise learning summary

link: one high-quality learning resource (official docs, tutorials, or guides)

3. Edge Specifications

Each edge must:

Have a unique ID (e.g., "e1-2")

Define source and target node IDs to represent the roadmap flow

4. Output Format

Response must be valid JSON

No markdown, comments, or null values

Must include top-level keys:

"roadmapTitle"

"description"

"duration"

"initialNodes"

"initialEdges"

📘 Example Output
{
  "roadmapTitle": "Full Stack Web Development Roadmap",
  "description": "A comprehensive learning path to become a Full Stack Developer, covering both frontend and backend technologies. This roadmap starts from the basics and progresses to advanced topics with branching for different specializations.",
  "duration": "12-18 months",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "Internet Basics",
        "description": "Understand how the web works, covering HTTP/HTTPS, DNS, domain names, hosting, and browsers.",
        "link": "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work"
      }
    },
    {
      "id": "2",
      "type": "turbo",
      "position": { "x": 0, "y": 120 },
      "data": {
        "title": "HTML & CSS",
        "description": "Learn HTML5 semantic elements, CSS3, Flexbox, Grid, and responsive web design principles.",
        "link": "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
      }
    },
    {
      "id": "3",
      "type": "turbo",
      "position": { "x": 0, "y": 240 },
      "data": {
        "title": "JavaScript Fundamentals",
        "description": "Master core JavaScript concepts: ES6+, DOM manipulation, asynchronous programming, and algorithms.",
        "link": "https://javascript.info/"
      }
    },
    {
      "id": "4",
      "type": "turbo",
      "position": { "x": -250, "y": 380 },
      "data": {
        "title": "Frontend Frameworks",
        "description": "Choose React, Angular, or Vue. Learn component architecture, routing, and state management.",
        "link": "https://react.dev/learn"
      }
    },
    {
      "id": "5",
      "type": "turbo",
      "position": { "x": -250, "y": 520 },
      "data": {
        "title": "Advanced Frontend",
        "description": "Learn TypeScript, advanced state management (Redux/Zustand), testing (Jest), and performance optimization.",
        "link": "https://www.typescriptlang.org/docs/"
      }
    },
    {
      "id": "6",
      "type": "turbo",
      "position": { "x": 250, "y": 380 },
      "data": {
        "title": "Backend Programming",
        "description": "Choose Node.js, Python, or Java. Learn server-side programming, REST APIs, and middleware concepts.",
        "link": "https://nodejs.org/en/docs/guides/getting-started-guide"
      }
    },
    {
      "id": "7",
      "type": "turbo",
      "position": { "x": 250, "y": 520 },
      "data": {
        "title": "Databases",
        "description": "Understand relational (MySQL/PostgreSQL) and NoSQL (MongoDB) database systems with CRUD operations.",
        "link": "https://www.postgresqltutorial.com/"
      }
    },
    {
      "id": "8",
      "type": "turbo",
      "position": { "x": 0, "y": 660 },
      "data": {
        "title": "DevOps & Deployment",
        "description": "Learn Docker, CI/CD pipelines, and deploy applications using AWS, Azure, or GCP.",
        "link": "https://docs.docker.com/get-started/"
      }
    },
    {
      "id": "9",
      "type": "turbo",
      "position": { "x": 0, "y": 800 },
      "data": {
        "title": "System Design",
        "description": "Explore scalability concepts like microservices, load balancing, caching, and distributed systems.",
        "link": "https://github.com/donnemartin/system-design-primer"
      }
    }
  ],
  "initialEdges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e2-3", "source": "2", "target": "3" },
    { "id": "e3-4", "source": "3", "target": "4" },
    { "id": "e3-6", "source": "3", "target": "6" },
    { "id": "e4-5", "source": "4", "target": "5" },
    { "id": "e6-7", "source": "6", "target": "7" },
    { "id": "e5-8", "source": "5", "target": "8" },
    { "id": "e7-8", "source": "7", "target": "8" },
    { "id": "e8-9", "source": "8", "target": "9" }
  ]
}

🧠 Prompt Template (for API or Automation Use)
Generate a React Flow–compatible JSON learning roadmap for the given user role or skill set.

Requirements:
- Vertical tree layout, similar to roadmap.sh
- Order topics from fundamentals to advanced
- Include branching for specializations
- Each node must have: title, description, link
- Use unique IDs and meaningful x/y positions (spacious and visually clear)
- Return only valid JSON as per the defined format

User Role: {{userRole}}
Skills: {{skillInput}}


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

    // Clean and parse JSON
    function cleanJsonString(jsonString: string) {
      let cleaned = jsonString;
      // Remove any leading/trailing whitespace and newlines
      cleaned = cleaned.trim();
      // Remove any comments (both single and multi-line)
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove JSON code block markers if any
      cleaned = cleaned.replace(/^```(?:json)?|```$/g, '');
      // Remove control characters except for newlines and tabs
      cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, char =>
        char === '\n' || char === '\t' ? char : ''
      );
      // Handle escaped characters
      cleaned = cleaned.replace(/\\(["\\/bfnrt])/g, (_, char) => {
        switch (char) {
          case 'b': return '\\b';
          case 'f': return '\\f';
          case 'n': return '\\n';
          case 'r': return '\\r';
          case 't': return '\\t';
          default: return `\\${char}`;
        }
      });
      return cleaned.trim();
    };

    let cleanedJson = cleanJsonString(rawContent);
    let parseJson;

    // Try to extract JSON if the response includes markdown code blocks
    const jsonMatch = cleanedJson.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanedJson = jsonMatch[1].trim();
    }

    try {
      // First, try to parse as is
      parseJson = JSON.parse(cleanedJson);
    } catch (initialError) {
      console.log('Initial JSON parse failed, attempting to fix common issues...');

      try {
        // Try to fix common JSON issues
        // 1. Remove trailing commas
        let fixedJson = cleanedJson
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/([\{\[]\s*[\{\[]\s*)"([^"]+)"\s*(?=:)/g, '$1"$2"')
          .replace(/\n/g, ' ')
          .replace(/\r/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/([^\\])\\/g, '$1\\\\')
          .replace(/"([^"]*?)"(?=:)/g, (match) => `"${match.slice(1, -1).replace(/"/g, '\\"')}"`);

        // 2. Try to find the first { and last } if the string is not properly formatted
        const firstBrace = fixedJson.indexOf('{');
        const lastBrace = fixedJson.lastIndexOf('}');

        if (firstBrace >= 0 && lastBrace > firstBrace) {
          fixedJson = fixedJson.substring(firstBrace, lastBrace + 1);
        }

        parseJson = JSON.parse(fixedJson);
      } catch (finalError) {
        console.error('Failed to parse JSON after cleanup:', {
          original: cleanedJson,
          error: finalError
        });

        // Try to extract any valid JSON part using a more permissive approach
        try {
          const jsonStart = Math.max(0, cleanedJson.indexOf('{'));
          const jsonEnd = Math.min(cleanedJson.length, cleanedJson.lastIndexOf('}') + 1);
          const possibleJson = cleanedJson.substring(jsonStart, jsonEnd);

          parseJson = JSON.parse(possibleJson);
        } catch (lastResortError) {
          console.error('Final JSON parse attempt failed');
          // If all else fails, create a minimal valid response
          parseJson = {
            roadmapTitle: "Career Roadmap",
            description: "Generated roadmap with parsing issues",
            initialNodes: [{
              id: 'error-node',
              type: 'error',
              position: { x: 0, y: 0 },
              data: {
                title: 'Error Processing Roadmap',
                description: 'There was an issue processing the roadmap data.',
                bgColor: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderColor: '#dc2626',
              }
            }],
            initialEdges: []
          };

          console.error('Using fallback roadmap due to parsing error:', lastResortError);
        }
      }
    }
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