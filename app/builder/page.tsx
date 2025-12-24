'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { StepIndicator } from '@/components/resume-builder/step-indicator'
import { PersonalInfoForm } from '@/components/resume-builder/personal-info-form'
import { WorkExperienceForm } from '@/components/resume-builder/work-experience-form'
import { SkillsExtrasForm } from '@/components/resume-builder/skills&extras'
import { TemplateSelector } from '@/components/resume-builder/template-selector'
import { ResumePreview } from '@/components/resume-builder/resume-preview'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const steps = [
  { id: 'personal', title: 'Personal Info', completed: false },
  { id: 'experience', title: 'Experience & Education', completed: false },
  { id: 'skills', title: 'Skills & Extras', completed: false },
  { id: 'template', title: 'Template', completed: false },
  { id: 'preview', title: 'Preview', completed: false },
]

export default function ResumeBuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState('personal')
  const [formData, setFormData] = useState<any>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [resumeSteps, setResumeSteps] = useState(steps)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const updateStepCompletion = (stepId: string, completed: boolean) => {
    setResumeSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed } : step
      )
    )
  }

  const handlePersonalInfoNext = (data: any) => {
    setFormData((prev: any) => ({ ...prev, personalInfo: data }))
    updateStepCompletion('personal', true)
    setCurrentStep('experience')
  }

  const handleExperienceNext = (data: any) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      experiences: data.experiences,
      education: data.education 
    }))
    updateStepCompletion('experience', true)
    setCurrentStep('skills')
  }

  const handleSkillsNext = (data: any) => {
    setFormData((prev: any) => ({ ...prev, skills: data }))
    updateStepCompletion('skills', true)
    setCurrentStep('template')
  }

  const handleTemplateNext = () => {
    setFormData((prev: any) => ({ ...prev, template: selectedTemplate }))
    updateStepCompletion('template', true)
    setCurrentStep('preview')
  }

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId)
  }

  const handleSaveResume = async () => {
    if (!user) return

    const supabase = createClient()
    const { error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: `${formData.personalInfo?.fullName || 'My'} Resume`,
        template_id: selectedTemplate || 'modern',
        personal_info: formData.personalInfo,
        work_experience: formData.experiences,
        education: formData.education,
        skills: formData.skills,
      })

    if (!error) {
      router.push('/dashboard')
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
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Resume Builder</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <StepIndicator 
          steps={resumeSteps} 
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="mt-8">
          {currentStep === 'personal' && (
            <PersonalInfoForm
              initialData={formData.personalInfo}
              onNext={handlePersonalInfoNext}
            />
          )}

          {currentStep === 'experience' && (
            <WorkExperienceForm
              initialData={{
                experiences: formData.experiences,
                education: formData.education
              }}
              onNext={handleExperienceNext}
              onPrevious={() => setCurrentStep('personal')}
            />
          )}

          {currentStep === 'skills' && (
            <SkillsExtrasForm
              initialData={formData.skills}
              onNext={handleSkillsNext}
              onPrevious={() => setCurrentStep('experience')}
            />
          )}

          {currentStep === 'template' && (
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
              onNext={handleTemplateNext}
              onPrevious={() => setCurrentStep('skills')}
            />
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <ResumePreview
                data={formData}
                atsScore={85}
                onImprove={() => {}}
                onTailor={() => {}}
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('template')}
                >
                  Previous
                </Button>
                <Button onClick={handleSaveResume} className="px-8">
                  Save Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}