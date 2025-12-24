'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Wand2, 
  Target,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Heart,
  Trophy,
  Lightbulb,
  Github
} from 'lucide-react'

interface ResumePreviewProps {
  data: any
  atsScore?: number
  onImprove?: () => void
  onTailor?: () => void
}

export function ResumePreview({ data, atsScore = 85, onImprove, onTailor }: ResumePreviewProps) {
  const { personalInfo, experiences, education, skills } = data

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <div className="flex items-center gap-4">
          {atsScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ATS Score:</span>
              <span className={`text-lg font-bold ${atsScore >= 80 ? 'text-green-600' : atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {atsScore}%
              </span>
            </div>
          )}
          {onImprove && (
            <Button variant="outline" onClick={onImprove}>
              <Wand2 className="w-4 h-4 mr-2" />
              AI Improve
            </Button>
          )}
          {onTailor && (
            <Button variant="outline" onClick={onTailor}>
              <Target className="w-4 h-4 mr-2" />
              Tailor to Job
            </Button>
          )}
          <Button className="bg-black text-white hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <Card className="p-8 bg-white">
        {/* Personal Info Header */}
        {personalInfo && (
          <div className="border-b-2 border-gray-900 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {personalInfo.location}
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={personalInfo.website} className="text-blue-600 hover:underline">
                    {personalInfo.website}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <a href={personalInfo.github} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-md font-medium text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.location}</p>
                      <p>
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.isCurrentJob ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            
            {/* Campus/University */}
            {education.campus && education.campus.institution && (
              <div className="border-l-2 border-gray-300 pl-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{education.campus.degree}</h3>
                    <p className="text-md font-medium text-gray-700">{education.campus.institution}</p>
                    <p className="text-sm text-gray-600">{education.campus.field}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{education.campus.location}</p>
                    <p>
                      {new Date(education.campus.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {education.campus.endDate && ' - ' + new Date(education.campus.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {(education.campus.gpa || education.campus.honors) && (
                  <div className="text-sm text-gray-700">
                    {education.campus.gpa && <p>GPA: {education.campus.gpa}</p>}
                    {education.campus.honors && <p>{education.campus.honors}</p>}
                  </div>
                )}
              </div>
            )}

            {/* High School */}
            {education.highSchool && education.highSchool.institution && (
              <div className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{education.highSchool.institution}</h3>
                    <p className="text-sm text-gray-600">High School Diploma</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {education.highSchool.location && <p>{education.highSchool.location}</p>}
                    {education.highSchool.graduationYear && <p>Graduated {education.highSchool.graduationYear}</p>}
                  </div>
                </div>
                {(education.highSchool.gpa || education.highSchool.honors) && (
                  <div className="text-sm text-gray-700">
                    {education.highSchool.gpa && <p>GPA: {education.highSchool.gpa}</p>}
                    {education.highSchool.honors && <p>{education.highSchool.honors}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            </div>
            
            {skills.technical && skills.technical.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {skills.soft && skills.soft.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {skills.tools && skills.tools.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((tool: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {skills?.languages && skills.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.languages.map((lang: any, index: number) => (
                <div key={index} className="text-gray-700">
                  <span className="font-medium">{lang.language}</span>
                  {lang.proficiency && (
                    <span className="text-sm text-gray-600"> - {lang.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {skills?.certifications && skills.certifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
            </div>
            <div className="space-y-4">
              {skills.certifications.map((cert: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-md text-gray-700">{cert.issuer}</p>
                  <p className="text-sm text-gray-600">
                    Issued: {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </p>
                  {cert.credentialId && (
                    <p className="text-sm text-gray-600">Credential ID: {cert.credentialId}</p>
                  )}
                  {cert.url && (
                    <a href={cert.url} className="text-sm text-blue-600 hover:underline">
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {skills?.projects && skills.projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FolderGit2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="space-y-6">
              {skills.projects.map((project: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.role && <p className="text-sm text-gray-600">{project.role}</p>}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <p className="text-sm text-gray-600">
                        {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {project.endDate && ' - ' + new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {project.highlights && (
                    <p className="text-sm text-gray-600">{project.highlights}</p>
                  )}
                  {project.url && (
                    <a href={project.url} className="text-sm text-blue-600 hover:underline">
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Experience */}
        {skills?.volunteer && skills.volunteer.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Volunteer Experience</h2>
            </div>
            <div className="space-y-6">
              {skills.volunteer.map((vol: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vol.role}</h3>
                      <p className="text-md font-medium text-gray-700">{vol.organization}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(vol.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {vol.isCurrentRole ? 'Present' : new Date(vol.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-gray-700">{vol.description}</p>
                  {vol.achievements && (
                    <p className="text-sm text-gray-600 mt-2">{vol.achievements}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Achievements */}
        {skills?.awards && skills.awards.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Awards & Achievements</h2>
            </div>
            <div className="space-y-4">
              {skills.awards.map((award: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(award.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-md text-gray-700">{award.issuer}</p>
                  {award.description && (
                    <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests & Hobbies */}
        {skills?.interests && skills.interests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {skills.interests.map((interest: string, index: number) => (
                <span key={index} className="text-gray-700">
                  {interest}
                  {index < skills.interests.length - 1 && ' •'}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}