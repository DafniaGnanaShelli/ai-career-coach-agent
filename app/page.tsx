"use client"
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Sparkles, TrendingUp, FileText, Route, MessageSquare, Target, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {


  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] bg-clip-text text-transparent">
                  ARIA AI
                </h1>
                <p className="text-xs text-gray-500">Career Coach Agent</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <Button className="bg-gradient-to-r from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] hover:opacity-90 transition-opacity">
                  Get Started
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
                <UserButton />
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2">
            <Award className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Career Intelligence</span>
          </div>
          
          <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Your Career Journey,
            <span className="bg-gradient-to-r from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] bg-clip-text text-transparent">
              {" "}Powered by AI
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-gray-600">
            Get personalized career advice, optimize your resume, generate compelling cover letters, and access AI-powered roadmaps to achieve your professional goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] hover:opacity-90 transition-opacity text-lg px-8">
                  Start Your Journey
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] hover:opacity-90 transition-opacity text-lg px-8">
                  Go to Dashboard
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/ai-tools">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore AI Tools
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-gray-600 pt-8">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>1000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>AI-Powered Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Career Growth</span>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Career Tools</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to accelerate your career growth and make smarter decisions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Resume Analyzer */}
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resume Analyzer</h3>
              <p className="text-gray-600 mb-4">
                Get instant AI-powered feedback on your resume with detailed scoring and improvement suggestions
              </p>
              <Link href="/ai-tools/ai-resume-analyzer" className="text-blue-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                Try it now
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Cover Letter Generator */}
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cover Letter Generator</h3>
              <p className="text-gray-600 mb-4">
                Create professional, tailored cover letters that stand out and get results
              </p>
              <Link href="/ai-tools/ai-cover-letter-generator" className="text-purple-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                Try it now
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Career Roadmap */}
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                <Route className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Roadmap</h3>
              <p className="text-gray-600 mb-4">
                Generate personalized learning roadmaps with step-by-step guidance for your career path
              </p>
              <Link href="/ai-tools/ai-roadmap-agent" className="text-indigo-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                Try it now
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Career Chat */}
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Chat</h3>
              <p className="text-gray-600 mb-4">
                Get instant answers to your career questions from our AI career coach
              </p>
              <Link href="/ai-tools/ai-qa-chat" className="text-pink-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                Try it now
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of professionals using ARIA AI to accelerate their career growth
          </p>
          {!user ? (
            <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
              <Button size="lg" className="bg-white text-[#4568DC] hover:bg-gray-100 text-lg px-8">
                Get Started for Free
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          ) : (
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-[#4568DC] hover:bg-gray-100 text-lg px-8">
                Go to Dashboard
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">ARIA AI Career Coach Agent</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 ARIA AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
