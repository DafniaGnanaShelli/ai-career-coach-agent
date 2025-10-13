import React from 'react'
const  questionslist = [
    "How can I improve my resume to get more job interviews?",
    "What are the most in-demand skills for my industry?",
]
function EmptyState({selectedQuestion}:any) {
  return (
   <div>
    <h2 className='text-xl font-bold text-center'> Ask anything to AI career assistant</h2>
      {questionslist.map((question, index) => (
        <h2 key={index} className='p-4 text-center border rounded-lg my-3 cursor-pointer hover:border-primary' onClick={ ()=> selectedQuestion(question)}>
          {question}
        </h2>
      ))}
   </div>
  )
}

export default EmptyState
 