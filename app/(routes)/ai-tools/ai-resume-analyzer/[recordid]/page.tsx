"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Update the import path to the correct location of Report, for example:
import Report from '../_component/report'
function AiResumeAnalyzer() {
  const { recordid } = useParams();
  const [pdfUrl, setpdfUrl] = useState();
  const [aiReport, setAiReport] = useState();
  useEffect(() => {
    recordid && GetResumeAnalyzerRecord();
  }, [recordid])


  const GetResumeAnalyzerRecord = async () => {
    const result = await axios.get('/api/history?recordId=' + recordid);
    console.log("GetMessageList Result:", result.data);
    setpdfUrl(result.data?.metaData);
    setAiReport(result.data?.content);
  }
  return (

    <div className='grid lg:grid-cols-5 grid-cols-1 gap-3'>
      <div className='col-span-2'>
        <Report aiReport={aiReport} />
      </div>
      <div className='col-span-3'>
        <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text mb-6">Resume Preview</h2>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          width="100%"
          height={1200}
          className='min-w-full rounded-lg shadow-md'
          style={{ border: 'none' }}
          title="Resume Preview"
        />
      </div>
    </div>

  )
}

export default AiResumeAnalyzer
