'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Share, Wand2, Target } from 'lucide-react'
import { generatePDF } from '@/lib/pdf-generator'

interface ResumeData {
  personalInfo: any
  workExperience: any
  education: any
  skills: any
  template: string
}

interface ResumePreviewProps {
  data: ResumeData
  atsScore?: number
  onImprove: () => void
  onTailor: () => void
}

export function ResumePreview({ data, atsScore, onImprove, onTailor }: ResumePreviewProps) {
  const handleDownloadPDF = async () => {
    await generatePDF('resume-preview', `${data.personalInfo?.fullName || 'Resume'}.pdf`)
  }

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <div className="flex items-center gap-3">
          {atsScore && (
            <Badge className={`px-3 py-1 ${getATSScoreColor(atsScore)}`}>
              ATS Score: {atsScore}%
            </Badge>
          )}
          
          <Button variant="outline" onClick={onImprove}>
            <Wand2 className="w-4 h-4 mr-2" />
            AI Improve
          </Button>
          
          <Button variant="outline" onClick={onTailor}>
            <Target className="w-4 h-4 mr-2" />
            Tailor to Job
          </Button>
          
          <Button onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div id="resume-preview" className="max-w-4xl mx-auto bg-white">
            <ModernResumeTemplate data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ModernResumeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, workExperience, education, skills } = data

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo?.website || personalInfo?.linkedin) && (
          <div className="flex items-center justify-center gap-4 mt-2 text-blue-600">
            {personalInfo?.website && (
              <a href={personalInfo.website} className="hover:underline">
                {personalInfo.website}
              </a>
            )}
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} className="hover:underline">
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience?.experiences?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {workExperience.experiences.map((exp: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <p>{exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}</p>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700">
                    {exp.description.split('\n').map((line: string, lineIndex: number) => (
                      <p key={lineIndex} className="mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.degrees?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.degrees.map((degree: any, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{degree.degree}</h3>
                  <p className="text-blue-600">{degree.school}</p>
                  {degree.location && <p className="text-gray-600">{degree.location}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p>{degree.graduationDate}</p>
                  {degree.gpa && <p>GPA: {degree.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills?.skillCategories?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.skillCategories.map((category: any, index: number) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-gray-700">{category.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}