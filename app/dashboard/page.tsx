'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { ResumeCard } from '@/components/dashboard/resume-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, TrendingUp, Users, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [resumes, setResumes] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalResumes: 0,
    averageATSScore: 0,
    downloadsThisMonth: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const fetchResumes = async () => {
    if (!user) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (!error && data) {
      setResumes(data)
      setStats({
        totalResumes: data.length,
        averageATSScore: data.reduce((acc, resume) => acc + (resume.ats_score || 0), 0) / data.length || 0,
        downloadsThisMonth: 12, // Mock data
      })
    }
  }

  const createNewResume = () => {
    router.push('/builder')
  }

  const editResume = (resumeId: string) => {
    router.push(`/builder/${resumeId}`)
  }

  const deleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)

    if (!error) {
      setResumes(resumes.filter(resume => resume.id !== resumeId))
    }
  }

  const duplicateResume = async (resumeId: string) => {
    const supabase = createClient()
    const originalResume = resumes.find(r => r.id === resumeId)
    
    if (originalResume) {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user?.id,
          title: `${originalResume.title} (Copy)`,
          template_id: originalResume.template_id,
          personal_info: originalResume.personal_info,
          work_experience: originalResume.work_experience,
          education: originalResume.education,
          skills: originalResume.skills,
          projects: originalResume.projects,
        })
        .select()
        .single()

      if (!error && data) {
        setResumes([data, ...resumes])
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.user_metadata?.full_name}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your resumes and track your job application success
            </p>
          </div>
          
          <Button onClick={createNewResume} className="px-6 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Create New Resume
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResumes}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. ATS Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.averageATSScore)}%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.downloadsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
          </div>

          {resumes.length === 0 ? (
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>No resumes yet</CardTitle>
                <CardDescription>
                  Create your first AI-powered resume to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={createNewResume} className="mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={editResume}
                  onDelete={deleteResume}
                  onDuplicate={duplicateResume}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}