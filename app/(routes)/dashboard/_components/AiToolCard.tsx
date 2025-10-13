"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import ResumeUploadDialog from './ResumeUploadDialog'
import RoadmapGeneratorAgent from '../../ai-tools/ai-roadmap-agent/[roadmapid]/page'
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog'
import CoverLetterGeneratorDialog from './CoverLetterGeneratorDialog'

interface TOOL {
  name: string,
  desc: string,
  icon: string,
  button: string,
  path: string
}

type AiToolProps = {
  tool: TOOL
}
function AiToolCard({ tool }: AiToolProps) {
  const id = uuidv4();
  const { user } = useUser();
  const router = useRouter();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const [openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const onClickButoon = async () => {
    if (tool.name === 'Resume Analyzer') {
      setOpenResumeUpload(true);
      return;
    }
    if (tool.path == '/ai-tools/ai-roadmap-agent') {
      setOpenRoadmapDialog(true);
      return;
    }
    if (tool.path == '/ai-tools/ai-cover-letter-generator') {
      setOpenCoverLetterDialog(true);
      return;
    }
    // new record to history
    const result = await axios.post('/api/history', {
      recordId: id,
      content: [],
      aiAgentType: tool.path
    });
    console.log(result);
    router.push(tool.path + "/" + id);
  }


  return (
    <div className='p-3 border rounded-lg'>
      <Image src={tool.icon} alt={tool.name} width={40} height={50} />
      <h2 className='font-bold mt-2'>{tool.name}</h2>
      <p className='text-gray-400 '>{tool.desc}</p>


      {/* <Link href={`${tool.path}/${id}`}> */}
      <Button className='w-full mt-3'
        onClick={onClickButoon}>{tool.button}</Button>
      {/* </Link> */}


      <ResumeUploadDialog openResumeUpload={openResumeUpload}
        setOpenResumeUpload={setOpenResumeUpload} />
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => {
          setOpenRoadmapDialog(false)
        }}

      />
      <CoverLetterGeneratorDialog
        openDialog={openCoverLetterDialog}
        setOpenDialog={() => {
          setOpenCoverLetterDialog(false)
        }}
      />
    </div>

  )
}

export default AiToolCard
