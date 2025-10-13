import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    Star,
    ArrowUp,
    UserCircle,
    Briefcase,
    GraduationCap,
    Lightbulb,
    Check,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react';
import React, { useState } from 'react';

function Report({ aiReport }: any) {
    if (!aiReport) return <p>Loading...</p>;
    const [openResumeUpload, setOpenResumeUpload] = useState(false);

    const formattedReport = {
        overall_score: aiReport?.overall_score || 0,
        summary_comment: aiReport?.summary_comment || '',
        sections: aiReport?.sections || {},
        tips_for_improvement: aiReport?.tips_for_improvement || [],
        whats_good: aiReport?.whats_good || [],
        needs_improvement: aiReport?.needs_improvement || [],
    };

    const getScoreStyle = (score: number) => {
        if (score >= 85) return { text: 'text-green-600', border: 'border-green-200', bg: 'bg-green-500' };
        if (score >= 70) return { text: 'text-yellow-500', border: 'border-yellow-200', bg: 'bg-yellow-500' };
        return { text: 'text-red-500', border: 'border-red-200', bg: 'bg-red-500' };
    };

    const sectionTitles: any = {
        contact_info: 'Contact Info',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
    };

    const sectionIcons: any = {
        contact_info: <UserCircle className="text-gray-500 mr-2" />,
        experience: <Briefcase className="text-gray-500 mr-2" />,
        education: <GraduationCap className="text-gray-500 mr-2" />,
        skills: <Lightbulb className="text-gray-500 mr-2" />,
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">AI Analysis Results</h2>
                <Button
                    type="button"
                    onClick={() => {
                        setOpenResumeUpload(true);
                    }}
                >
                    Re-analyze <Sparkles className="ml-2" />
                </Button>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] rounded-lg shadow-md p-6 mb-6 border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Star className="text-yellow-400 mr-2" /> Overall Score
                </h3>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-6xl font-extrabold text-white">
                        {formattedReport.overall_score}
                        <span className="text-2xl">/100</span>
                    </span>
                    <div className="flex items-center">
                        <ArrowUp className="text-green-400 text-lg mr-2" />
                        <span className="text-white text-lg font-bold">{aiReport.overall_feedback}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-white h-2.5 rounded-full"
                        style={{ width: `${formattedReport.overall_score}%` }}
                    ></div>
                </div>
                <p className="text-gray-200 text-sm">{formattedReport.summary_comment}</p>
            </div>

            {/* Section Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {Object.entries(formattedReport.sections).map(([key, section]: any) => {
                    const style = getScoreStyle(section.score);
                    return (
                        <div
                            key={key}
                            className={`bg-white rounded-lg shadow-md p-5 ${style.border} relative overflow-hidden group`}
                        >
                            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                {sectionIcons[key]} {sectionTitles[key]}
                            </h4>
                            <span className={`text-4xl font-bold ${style.text}`}>{section.score}%</span>
                            <p className="text-sm text-gray-600 mt-2">{section.comment}</p>
                            <div
                                className={`absolute inset-x-0 bottom-0 h-1 ${style.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            ></div>
                        </div>
                    );
                })}
            </div>

            {/* Tips for Improvement */}
            {formattedReport.tips_for_improvement.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <Lightbulb className="text-orange-400 mr-2" /> Tips for Improvement
                    </h3>
                    <ol className="list-none space-y-4">
                        {formattedReport.tips_for_improvement.map((tip: string, index: number) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                    <Check className="w-4 h-4" />
                                </span>
                                <div>
                                    <p className="text-gray-600 text-sm">{tip}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* What's Good & Needs Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                        <ThumbsUp className="text-green-500 mr-2" /> What&apos;s Good
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        {formattedReport.whats_good.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                        <ThumbsDown className="text-red-500 mr-2" /> Needs Improvement
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        {formattedReport.needs_improvement.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <ResumeUploadDialog
                openResumeUpload={openResumeUpload}
                setOpenResumeUpload={() => {
                    setOpenResumeUpload(false);
                }}
            />
        </div>
    );
}

export default Report;
