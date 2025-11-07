"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Calendar, Mail, User, FileText, Route as RouteIcon, Sparkles, MessageSquare, History, Settings, ChevronRight, Network } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic';

// Dynamically import NetworkGraph to avoid SSR issues with ReactFlow
const NetworkGraph = dynamic(() => import('@/components/NetworkGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="animate-pulse text-gray-500">Loading interactive graph...</div>
    </div>
  ),
});
type ActivityHistory = {
  recordId: string;
  aiAgentType: string;
  createdAt: string;
  // Add other properties as needed
};

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'purple' | 'pink';
  trend: 'up' | 'down';
  trendValue: string;
};

type ActivityTypeInfo = {
  icon: React.ReactNode;
  label: string;
  badge: string;
  bgColor: string;
  textColor: string;
};

function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<ActivityHistory[]>([]);
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

  const stats = useMemo<{ total: number; resume: number; roadmap: number; cover: number }>(() => {
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

  const recent = useMemo<ActivityHistory[]>(() => history.slice(0, 5), [history]);

  const userName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userImage = user?.imageUrl || '';
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';

  return (
    <div className='space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Network Graph Section */}
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Network className='h-6 w-6 text-blue-600' />
          <h2 className='text-2xl font-bold text-gray-900'>Your Career Journey</h2>
        </div>
        <p className='text-gray-600 mb-4'>
          Visualize your progress through different career development tools and resources.
        </p>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden' style={{ height: '600px' }}>
          <NetworkGraph className='h-full w-full' />
        </div>
      </div>
      {/* Header */}
      <Card className='border-0 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              {userImage ? (
                <img 
                  src={userImage as string} 
                  alt={userName} 
                  className='h-20 w-20 rounded-xl border-4 border-white/20 shadow-lg object-cover' 
                />
              ) : (
                <div className='h-20 w-20 rounded-xl bg-white/10 border-4 border-white/20 flex items-center justify-center shadow-lg'>
                  <User className='h-10 w-10 text-white' />
                </div>
              )}
              <div className='space-y-1'>
                <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>{userName}</h1>
                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90'>
                  <span className='inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full'>
                    <Mail className='h-3.5 w-3.5' />
                    <span className='font-medium'>{userEmail}</span>
                  </span>
                  {createdAt && (
                    <span className='inline-flex items-center gap-1.5 text-white/80'>
                      <Calendar className='h-3.5 w-3.5' />
                      <span>Member since {createdAt}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button variant="outline" className='bg-white/5 hover:bg-white/10 border-white/20 text-white backdrop-blur-sm'>
                <Settings className='h-4 w-4 mr-2' /> Account Settings
              </Button>
              <Button className='bg-white text-indigo-700 hover:bg-white/90 shadow-md hover:shadow-lg transition-all'>
                <Sparkles className='h-4 w-4 mr-2' /> Explore AI Tools
                <ChevronRight className='h-4 w-4 ml-1 -mr-1' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className='px-6 pb-6 pt-2'>
          <div className='h-1.5 w-full bg-white/10 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-white/80 rounded-full transition-all duration-500 ease-out' 
              style={{ width: `${Math.min(100, (stats.total / 10) * 100)}%` }}
            />
          </div>
          <p className='text-xs text-white/70 mt-2 text-right'>
            {stats.total} activities this month • {10 - stats.total} to next level
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <StatCard 
          title="Total Activity" 
          value={stats.total} 
          icon={<History className='h-5 w-5' />}
          color="blue"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Resume Analyses" 
          value={stats.resume} 
          icon={<FileText className='h-5 w-5' />}
          color="emerald"
          trend="up"
          trendValue="8%"
        />
        <StatCard 
          title="Roadmaps" 
          value={stats.roadmap} 
          icon={<RouteIcon className='h-5 w-5' />}
          color="purple"
          trend="up"
          trendValue="15%"
        />
        <StatCard 
          title="Cover Letters" 
          value={stats.cover} 
          icon={<User className='h-5 w-5' />}
          color="pink"
          trend="up"
          trendValue="5%"
        />
      </div>

      {/* Recent Activity */}
      <Card className='overflow-hidden'>
        <CardHeader className='border-b bg-gray-50/50'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg font-semibold'>Recent Activity</CardTitle>
              <CardDescription className='text-sm'>Your latest interactions with our AI tools</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className='text-sm text-indigo-600 hover:text-indigo-700'>
              View all activity
              <ChevronRight className='h-4 w-4 ml-1' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='p-6 text-center'>
              <div className='animate-pulse space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-center justify-between py-4 border-b last:border-b-0'>
                    <div className='flex items-center space-x-4'>
                      <div className='h-10 w-10 rounded-lg bg-gray-200'></div>
                      <div className='space-y-2'>
                        <div className='h-4 w-32 bg-gray-200 rounded'></div>
                        <div className='h-3 w-24 bg-gray-100 rounded'></div>
                      </div>
                    </div>
                    <div className='h-4 w-16 bg-gray-100 rounded'></div>
                  </div>
                ))}
              </div>
            </div>
          ) : recent.length === 0 ? (
            <div className='p-8 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4'>
                <History className='h-8 w-8 text-indigo-600' />
              </div>
              <h3 className='text-gray-900 font-medium'>No activity yet</h3>
              <p className='mt-1 text-sm text-gray-500'>Your recent activities will appear here</p>
              <Button className='mt-4' size="sm">
                <Sparkles className='h-4 w-4 mr-2' />
                Try an AI Tool
              </Button>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {recent.map((r, idx) => {
                const typeInfo = getTypeInfo(r.aiAgentType);
                return (
                  <div 
                    key={`${r.recordId}-${r.aiAgentType}-${r.createdAt}-${idx}`} 
                    className='group hover:bg-gray-50/50 transition-colors duration-150'
                  >
                    <div className='px-6 py-4 flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>{typeInfo.label}</p>
                          <p className='text-sm text-gray-500'>
                      {r.aiAgentType?.replace('/ai-tools/', '').replaceAll('-', ' ')}
                            </p>
                          <p className='text-xs text-gray-500'>
                            {new Date(r.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <span className='inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700'>
                          {typeInfo.badge}
                        </span>
                        <ChevronRight className='h-4 w-4 ml-2 text-gray-400 group-hover:translate-x-1 transition-transform duration-200' />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend, trendValue }: StatCardProps) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700' },
  };

  return (
    <Card className='overflow-hidden transition-all duration-200 hover:shadow-md'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-500'>{title}</p>
            <p className='mt-1 text-3xl font-bold text-gray-900'>{value}</p>
            <div className={`mt-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${colors[color].bg} ${colors[color].text}`}>
              {trend === 'up' ? (
                <svg className='-ml-0.5 h-3.5 w-3.5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
                  <path fillRule='evenodd' d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
                </svg>
              ) : (
                <svg className='-ml-0.5 h-3.5 w-3.5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
                  <path fillRule='evenodd' d='M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
              )}
              <span className='ml-1'>{trendValue}</span>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${colors[color].bg} ${colors[color].text}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get type info
const getTypeInfo = (type: string): ActivityTypeInfo => {
  switch(type) {
    case '/ai-tools/ai-resume-analyzer':
      return {
        icon: <FileText className='h-5 w-5' />,
        label: 'Resume Analysis Completed',
        badge: 'Resume',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
      };
    case '/ai-tools/ai-roadmap-agent':
      return {
        icon: <RouteIcon className='h-5 w-5' />,
        label: 'Career Roadmap Generated',
        badge: 'Roadmap',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      };
    case '/ai-tools/ai-cover-letter-generator':
      return {
        icon: <FileText className='h-5 w-5' />,
        label: 'Cover Letter Created',
        badge: 'Cover Letter',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-600'
      };
    case '/ai-tools/ai-qa-chat':
      return {
        icon: <MessageSquare className='h-5 w-5' />,
        label: 'Chat Conversation',
        badge: 'Chat',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      };
    default:
      return {
        icon: <Sparkles className='h-5 w-5' />,
        label: 'Activity',
        badge: 'Other',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600'
      };
  }
};

export default ProfilePage
