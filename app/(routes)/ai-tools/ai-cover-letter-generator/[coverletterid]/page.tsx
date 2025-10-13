"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CoverLetterDisplay from '../_component/CoverLetterDisplay'

function AiCoverLetterGenerator() {
  const { coverletterid } = useParams();
  const [coverLetterData, setCoverLetterData] = useState();
  
  useEffect(() => {
    coverletterid && GetCoverLetterRecord();
  }, [coverletterid])

  const GetCoverLetterRecord = async () => {
    try {
      const result = await axios.get('/api/history?recordId=' + coverletterid);
      console.log("GetCoverLetter Result:", result.data);
      setCoverLetterData(result.data?.content);
    } catch (error) {
      console.error("Error fetching cover letter:", error);
    }
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <CoverLetterDisplay coverLetterData={coverLetterData} />
    </div>
  )
}

export default AiCoverLetterGenerator
