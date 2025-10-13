"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Calendar, Mail, User, FileText, Route as RouteIcon, Sparkles, MessageSquare, History, Settings } from 'lucide-react'

function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/history');
        setHistory(res.data || []);
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const byType = (path: string) => history.filter(h => h.aiAgentType === path).length;
    return {
      total,
      resume: byType('/ai-tools/ai-resume-analyzer'),
      roadmap: byType('/ai-tools/ai-roadmap-agent'),
      cover: byType('/ai-tools/ai-cover-letter-generator'),
      chat: byType('/ai-tools/ai-qa-chat'),
    }
  }, [history]);

  const recent = useMemo(() => history.slice(0, 5), [history]);

  const userName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userImage = user?.imageUrl || '';
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] rounded-xl p-6 text-white shadow-md'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            {userImage ? (
              <img src={userImage as string} alt={userName} className='h-16 w-16 rounded-full border-2 border-white object-cover' />
            ) : (
              <div className='h-16 w-16 rounded-full border-2 border-white bg-white/20 flex items-center justify-center'>
                <User className='h-8 w-8 text-white' />
              </div>
            )}
            <div>
              <h1 className='text-2xl md:text-3xl font-extrabold'>{userName}</h1>
              <div className='flex flex-wrap gap-4 mt-2 text-sm opacity-90'>
                <span className='inline-flex items-center gap-2'><Mail className='h-4 w-4' /> {userEmail}</span>
                {createdAt && (
                  <span className='inline-flex items-center gap-2'><Calendar className='h-4 w-4' /> Joined {createdAt}</span>
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant="outline" className='bg-white/10 text-white border-white/30 hover:bg-white/20'>
              <Settings className='h-4 w-4 mr-2' /> Settings
            </Button>
            <Button className='bg-white text-[#4568DC] hover:bg-white/90'>
              <Sparkles className='h-4 w-4 mr-2' /> Explore AI Tools
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white border rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Total Activity</p>
              <p className='text-3xl font-extrabold mt-1'>{stats.total}</p>
            </div>
            <History className='h-8 w-8 text-blue-600' />
          </div>
        </div>
        <div className='bg-white border rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Resume Analyses</p>
              <p className='text-3xl font-extrabold mt-1'>{stats.resume}</p>
            </div>
            <FileText className='h-8 w-8 text-emerald-600' />
          </div>
        </div>
        <div className='bg-white border rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Roadmaps</p>
              <p className='text-3xl font-extrabold mt-1'>{stats.roadmap}</p>
            </div>
            <RouteIcon className='h-8 w-8 text-purple-600' />
          </div>
        </div>
        <div className='bg-white border rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Cover Letters</p>
              <p className='text-3xl font-extrabold mt-1'>{stats.cover}</p>
            </div>
            <User className='h-8 w-8 text-pink-600' />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white border rounded-xl p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>Recent Activity</h2>
        </div>
        {loading ? (
          <p className='text-gray-500'>Loading...</p>
        ) : recent.length === 0 ? (
          <p className='text-gray-500'>No recent activity yet.</p>
        ) : (
          <div className='divide-y'>
            {recent.map((r: any, idx: number) => (
              <div key={`${r.recordId}-${r.aiAgentType}-${r.createdAt}-${idx}`} className='py-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center'>
                    {r.aiAgentType === '/ai-tools/ai-resume-analyzer' && <FileText className='h-5 w-5 text-emerald-600' />}
                    {r.aiAgentType === '/ai-tools/ai-roadmap-agent' && <RouteIcon className='h-5 w-5 text-purple-600' />}
                    {r.aiAgentType === '/ai-tools/ai-cover-letter-generator' && <User className='h-5 w-5 text-pink-600' />}
                    {r.aiAgentType === '/ai-tools/ai-qa-chat' && <MessageSquare className='h-5 w-5 text-blue-600' />}
                  </div>
                  <div>
                    <p className='font-medium'>
                      {r.aiAgentType?.replace('/ai-tools/', '').replaceAll('-', ' ')}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <a className='text-sm text-blue-600 hover:underline' href={`${r.aiAgentType}/${r.recordId}`}>
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
