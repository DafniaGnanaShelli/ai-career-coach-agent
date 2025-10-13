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

function RoadmapGeneratorDialog({ openDialog, setOpenDialog }: any) {
    const [userInput, setUserInput] = useState<string>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const GenerateRoadmap = async () => {
        const roadmapId = uuidv4();

        setLoading(true);
        try {
            const result = await axios.post("/api/ai-roadmap-agent", {
                roadmapId: roadmapId,
                userInput: userInput
            },
                {
                    headers: { "Content-Type": "application/json" }
                });

            console.log("Roadmap Result:", result.data);

            setLoading(false);
            router.push('/ai-tools/ai-roadmap-agent/' + roadmapId);
            setOpenDialog(false); // ✅ close dialog after success
        } catch (error: any) {
            setLoading(false);
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Position/Skill to Generate Roadmap</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-2'>
                            <Input
                                placeholder='e.g Full Stack Developer'
                                onChange={(event) => setUserInput(event?.target.value)}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={GenerateRoadmap} disabled={loading || !userInput}>
                        {loading ? <Loader2Icon className='animate-spin' /> : <SparklesIcon />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RoadmapGeneratorDialog
