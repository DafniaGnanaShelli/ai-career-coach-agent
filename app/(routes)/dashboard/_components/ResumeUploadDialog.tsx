
import React, { useState } from 'react'
import { File, Loader2Icon, Sparkles } from 'lucide-react'
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useRouter } from 'next/navigation';
function ResumeUploadDialog({ openResumeUpload, setOpenResumeUpload }: any) {


  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  }



  const onUploadAndAnalyze = async () => {
    setLoading(true);
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("recordId", recordId);
    formData.append("resumeFile", file);

    try {
      const result = await axios.post("/api/ai-resume-agent", formData);
      console.log("Analysis Result:", result.data);
      setLoading(false);
      router.push('/ai-tools/ai-resume-analyzer/' + recordId);
      setOpenResumeUpload(false);
    } catch (error: any) {
      console.error("=== Upload Error ===");
      console.error("Status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Full error:", error);
      setLoading(false);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  }



  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeUpload}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume Pdf File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <label htmlFor='resumeUpload' className='flex items-center flex-col justify-center p-7 border border-dashed rounded-xl hover:bg-slate-100 cursor-pointer'>
                <File className='h-10 w-10' />
                {file ?
                  <h2 className='mt-3 text-blue-600'>{file.name}</h2>
                  :
                  <h2 className='mt-3'>Click here to upload your resume</h2>}

              </label>
              <input type="file" id='resumeUpload' accept="application/pdf" className='hidden' onChange={onFileChange} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"outline"}>Cancel</Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className='animate-spin' /> : <Sparkles />}Upload & Analyze</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ResumeUploadDialog
