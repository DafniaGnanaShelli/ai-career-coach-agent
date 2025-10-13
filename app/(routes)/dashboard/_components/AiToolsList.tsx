import path from 'path'
import React from 'react'
import AiToolCard from './AiToolCard'
export const aiToolsList = [
  {
    name: 'AI Carrer Q&A chat',
    desc: 'Get answers to your career questions instantly',
    icon: '/chatbot.png',
    button: 'Ask Now',
    path: '/ai-tools/ai-qa-chat'
  },
  {
    name: 'Resume Analyzer',
    desc: 'Get feedback on your resume and improve it instantly',
    icon: '/resume.png',
    button: 'Analyze Now',
    path: '/ai-tools/ai-resume-analyzer'
  },
  {
    name: 'Career Roadmap Generator',
    desc: 'Get a personalized career roadmap based on your skills ',
    icon: '/roadmap.png',
    button: 'Lets Chat',
    path: '/ai-tools/ai-roadmap-agent'
  },
  {
    name: 'Cover letter Generator',
    desc: 'Get help with your cover letter and make it stand out ',
    icon: '/cover.png',
    button: 'Create Now',
    path: '/ai-tools/ai-cover-letter-generator'
  }
]
function AiToolsList() {
  return (
    <div className='mt-7 p-5 bg-white border rounded-xl'>
      <h2 className='text-lg font-bold '>Available Ai tools</h2>
      <p>Start building and Shape your career with our AI tools</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 mt-4'>
        {aiToolsList.map((tool: any, index: number) => (
          <AiToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  )
}

export default AiToolsList
