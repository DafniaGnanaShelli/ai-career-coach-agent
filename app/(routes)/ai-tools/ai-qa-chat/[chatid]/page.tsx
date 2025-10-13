"use client"
import { v4 as uuidv4 } from "uuid";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import EmptyState from '../_component/EmptyState'
import { CLIENT_STATIC_FILES_RUNTIME_POLYFILLS } from 'next/dist/shared/lib/constants'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
type messages = {
  content: string,
  role: string,
  type: string
}

function AiChat() {
const [userInput, setUserInput] = useState<string>();
const [loading, setLoading] = useState(false);
const [messageList, setMessageList] = useState<messages[]>([]);
const messagesEndRef = React.useRef<HTMLDivElement>(null);
const {chatid} = useParams() as any;
const router = useRouter();
console.log("Chat ID:", chatid);


useEffect(() => {
  chatid && GetMessageList();
}, [chatid]);

const GetMessageList = async ()=>{
  const result =  await axios.get('/api/history?recordId='+chatid);
  console.log("GetMessageList Result:", result.data);
  setMessageList(result?.data?.content);
} 

    
const onSend = async () => {
  if (!userInput?.trim()) return;
  
  setLoading(true);

  const currentInput = userInput;
  setUserInput(''); // Clear input immediately
  
  setMessageList(prev => [...prev, {content: currentInput, 
    role: 'user',
     type: 'text'}]);
  
  setUserInput('');
   const result = await axios.post('/api/ai-career-chat-agent', {
    userInput: currentInput
  });
  console.log("Result from API:", result.data);
  setMessageList(prev=>[...prev,result.data])
  setLoading(false);
}
console.log("Message List:", messageList);




useEffect(() => {
  // Scroll to the bottom of the chat when a new message is added
  messageList.length > 0 && updateMessageList();
}, [messageList]);


const onNewChat = async()=>{
  const id = uuidv4();
    // new record to history
    const result = await axios.post('/api/history',{
      recordId : id,
      content : []
    });
    console.log(result);
    router.replace("/ai-tools/ai-qa-chat/"+id);
  }


const updateMessageList = async ()=>{
  const result = await axios.put('/api/history', {
    content : messageList,
    recordId : chatid
  }
  );
  console.log("Update Message List Result:", result.data);
}



  return (
    <div className='h-[75vh] overflow-auto px-10 md:px-20 lg:px-30 xl:px-40'>
      {/* Header Section - Fixed */}
        <div className='flex items-center justify-between gap-8'>
          <div>
            <h2 className='font-bold text-lg'>AI Career Q&A Chat</h2>
            <p className='text-sm text-gray-600'>Get answers to your career questions instantly and improve your job Prospects</p>
          </div>
          <Button onClick={onNewChat}>+ New Chat</Button>
        </div>

      {/* Messages Container - Scrollable */}
      <div className='flex flex-col h-[75vh]'>
        {messageList?.length<=0 &&
          <div className='mt-5'>
            {/* Empty state options */}
            <EmptyState selectedQuestion={(question:string) => setUserInput(question)}/>
          </div>
        }
        {/* Chat messages */}
        {messageList?.map((message, index) => (
          <div key={index}>
            <div className={`flex mb-2 mt-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg mt-2 gap-2 max-w-[80%] ${message.role === 'user' ? 'bg-gray-200 text-black' : 'bg-gray-50 text-black'}`}>
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
            <div>
              {loading&&messageList?.length==index+1&&<div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2 '>
                <LoaderCircle className='animate-spin'/>Thinking...
              </div>}
            </div>
          </div>
        ))}
     
      {/* Input Box - Fixed at Bottom */}

        <div className='flex justify-between items-center gap-6 absolute bottom-5 w-[57%]'>
          <Input
            className='flex-1'
            placeholder='Type your message here..'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend()}
          />
          <Button onClick={onSend} disabled={loading}>
            <Send/>
          </Button>
        </div>
        </div>
      </div>

  )
}

export default AiChat
