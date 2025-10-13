"use client"
import React, { useState } from 'react'
import CoverLetterGeneratorDialog from '../../dashboard/_components/CoverLetterGeneratorDialog'
import { Button } from '@/components/ui/button'
import { FileText, Sparkles } from 'lucide-react'

function CoverLetterGeneratorPage() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <div className='flex justify-center mb-4'>
          <FileText className='h-16 w-16 text-blue-600' />
        </div>
        <h1 className='text-4xl font-bold gradient-component-text mb-4'>
          AI Cover Letter Generator
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          Create professional, personalized cover letters tailored to your target job in seconds
        </p>
        <Button 
          size="lg"
          onClick={() => setOpenDialog(true)}
          className='px-8 py-6 text-lg'
        >
          <Sparkles className='mr-2' />
          Generate Cover Letter
        </Button>
      </div>

      <div className='grid md:grid-cols-3 gap-6 mt-12'>
        <div className='bg-white p-6 rounded-lg shadow-md border'>
          <h3 className='font-bold text-lg mb-2'>✨ AI-Powered</h3>
          <p className='text-gray-600'>
            Our AI analyzes job descriptions and creates tailored cover letters that highlight your relevant skills
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md border'>
          <h3 className='font-bold text-lg mb-2'>⚡ Fast & Easy</h3>
          <p className='text-gray-600'>
            Generate professional cover letters in seconds. Just provide the job details and let AI do the work
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md border'>
          <h3 className='font-bold text-lg mb-2'>📝 Customizable</h3>
          <p className='text-gray-600'>
            Get a solid foundation that you can easily customize with your personal information and experiences
          </p>
        </div>
      </div>

      <CoverLetterGeneratorDialog
        openDialog={openDialog}
        setOpenDialog={() => setOpenDialog(false)}
      />
    </div>
  )
}

export default CoverLetterGeneratorPage
