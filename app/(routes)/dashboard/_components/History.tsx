"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { aiToolsList } from './AiToolsList';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function History() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    GetHistory();
  }, [])

  const GetHistory = async () => {
    setloading(true);
    const result = await axios.get('/api/history');
    console.log(result.data);
    setUserHistory(result.data);
    setloading(false);
  }

  const GetAgentName = (path: string) => {
    const agent = aiToolsList.find(item => item.path == path);
    return agent;
  }
  return (
    <div className='mt-5 p-5 border rounded-xl'>
      <h2 className='text-lg font-bold '>Previous History</h2>
      <p className='text-gray-400'>What Your previously work on , You can find it here.</p>
      {loading &&

        <div>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={index}>
              <Skeleton className="h-[50px] w-full mt-4 rounded-md" />
            </div>
          ))}
        </div>
      }

      {userHistory?.length == 0 && !loading ?
        <div className='flex  justify-center items-center flex-col mt-6'>
          <Image src='/idea.png' alt='No history' width={50} height={50} className='mx-auto mt-5' />
          <h2>You do not have any previous history</h2>
          <Button className='mt-5'>Explore Ai tools</Button>
        </div>
        :
        <div>
          {userHistory.map((history: any, index: number) => (
            <Link key={index} href={history?.aiAgentType + "/" + history?.recordId} className='flex justify-between items-center my-3 border p-3 rounded-lg'>
              <div className='flex gap-5'>

                <Image src={GetAgentName(history?.aiAgentType)?.icon || '/chatbot.png'} alt={'image'}
                  width={20} height={20} />

                <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>
              </div>
              <h2>{history?.createdAt}</h2>
            </Link>
          ))}
        </div>
      }
    </div>
  )
}

export default History
