import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SparklesIcon } from 'lucide-react'
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

function CoverLetterGeneratorDialog({ openDialog, setOpenDialog }: any) {
    const [jobTitle, setJobTitle] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const GenerateCoverLetter = async () => {
        if (!jobTitle || !companyName || !jobDescription) {
            alert('Please fill in all fields');
            return;
        }

        const coverLetterId = uuidv4();
        setLoading(true);
        
        try {
            const result = await axios.post("/api/ai-cover-letter-agent", {
                coverLetterId: coverLetterId,
                jobTitle: jobTitle,
                companyName: companyName,
                jobDescription: jobDescription
            },
                {
                    headers: { "Content-Type": "application/json" }
                });

            console.log("Cover Letter Result:", result.data);
            setLoading(false);
            router.push('/ai-tools/ai-cover-letter-generator/' + coverLetterId);
            setOpenDialog(false);
        } catch (error: any) {
            setLoading(false);
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Generate Professional Cover Letter</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-2 space-y-4'>
                            <div>
                                <label className='text-sm font-medium mb-1 block'>Job Title</label>
                                <Input
                                    placeholder='e.g. Senior Software Engineer'
                                    value={jobTitle}
                                    onChange={(event) => setJobTitle(event?.target.value)}
                                />
                            </div>
                            <div>
                                <label className='text-sm font-medium mb-1 block'>Company Name</label>
                                <Input
                                    placeholder='e.g. Tech Corp Inc.'
                                    value={companyName}
                                    onChange={(event) => setCompanyName(event?.target.value)}
                                />
                            </div>
                            <div>
                                <label className='text-sm font-medium mb-1 block'>Job Description</label>
                                <Textarea
                                    placeholder='Paste the job description here...'
                                    value={jobDescription}
                                    onChange={(event :any) => setJobDescription(event?.target.value)}
                                    rows={6}
                                    className='resize-none'
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={GenerateCoverLetter} 
                        disabled={loading || !jobTitle || !companyName || !jobDescription}
                    >
                        {loading ? <Loader2Icon className='animate-spin' /> : <SparklesIcon />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CoverLetterGeneratorDialog
