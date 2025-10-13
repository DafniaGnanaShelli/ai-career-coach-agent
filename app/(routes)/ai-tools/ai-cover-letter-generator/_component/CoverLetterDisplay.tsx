import CoverLetterGeneratorDialog from '@/app/(routes)/dashboard/_components/CoverLetterGeneratorDialog';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    FileText,
    Briefcase,
    Building2,
    Calendar,
    Copy,
    Download,
    Check
} from 'lucide-react';
import React, { useState } from 'react';

function CoverLetterDisplay({ coverLetterData }: any) {
    if (!coverLetterData) return <p>Loading...</p>;
    
    const [openDialog, setOpenDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textContent = `${coverLetterData.header}\n\n${coverLetterData.salutation}\n\n${coverLetterData.opening}\n\n${coverLetterData.body}\n\n${coverLetterData.closing}\n\n${coverLetterData.signature}`;
        navigator.clipboard.writeText(textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const textContent = `${coverLetterData.header}\n\n${coverLetterData.salutation}\n\n${coverLetterData.opening}\n\n${coverLetterData.body}\n\n${coverLetterData.closing}\n\n${coverLetterData.signature}`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${coverLetterData.jobTitle?.replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">
                    Your Cover Letter
                </h2>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDownload}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setOpenDialog(true)}
                    >
                        Generate New <Sparkles className="ml-2" />
                    </Button>
                </div>
            </div>

            {/* Job Details */}
            <div className="bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] rounded-lg shadow-md p-6 mb-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <div className="flex items-center">
                        <Briefcase className="mr-3 h-5 w-5" />
                        <div>
                            <p className="text-xs opacity-80">Position</p>
                            <p className="font-semibold">{coverLetterData.jobTitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Building2 className="mr-3 h-5 w-5" />
                        <div>
                            <p className="text-xs opacity-80">Company</p>
                            <p className="font-semibold">{coverLetterData.companyName}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-3 h-5 w-5" />
                        <div>
                            <p className="text-xs opacity-80">Generated</p>
                            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Letter Content */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 border border-gray-200">
                <div className="prose max-w-none space-y-6">
                    {/* Header Section */}
                    <div className="whitespace-pre-line text-gray-700">
                        {coverLetterData.header}
                    </div>

                    {/* Salutation */}
                    <div className="text-gray-800 font-medium">
                        {coverLetterData.salutation}
                    </div>

                    {/* Opening Paragraph */}
                    <div className="text-gray-700 leading-relaxed">
                        {coverLetterData.opening}
                    </div>

                    {/* Body Paragraphs */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {coverLetterData.body}
                    </div>

                    {/* Closing Paragraph */}
                    <div className="text-gray-700 leading-relaxed">
                        {coverLetterData.closing}
                    </div>

                    {/* Signature */}
                    <div className="whitespace-pre-line text-gray-700">
                        {coverLetterData.signature}
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            {coverLetterData.tips && coverLetterData.tips.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <FileText className="text-blue-500 mr-2" /> Tips for Your Application
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        {coverLetterData.tips.map((tip: string, index: number) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            <CoverLetterGeneratorDialog
                openDialog={openDialog}
                setOpenDialog={() => setOpenDialog(false)}
            />
        </div>
    );
}

export default CoverLetterDisplay;
