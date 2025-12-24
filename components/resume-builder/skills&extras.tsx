'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, X, Lightbulb, Award, FolderGit2, Heart, Trophy, Languages } from 'lucide-react'

const skillsExtrasSchema = z.object({
  // Required Skills Section
  technical: z.array(z.string()).min(1, 'Add at least one technical skill'),
  soft: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  
  // Optional Languages Section
  languages: z.array(
    z.object({
      language: z.string(),
      proficiency: z.string(),
    })
  ).optional(),

  // Optional Certifications
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().optional(),
    })
  ).optional(),

  // Optional Projects
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      role: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      url: z.string().optional(),
      highlights: z.string().optional(),
    })
  ).optional(),

  // Optional Volunteer Experience
  volunteer: z.array(
    z.object({
      organization: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      isCurrentRole: z.boolean(),
      description: z.string(),
      achievements: z.string().optional(),
    })
  ).optional(),

  // Optional Awards & Achievements
  awards: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      description: z.string().optional(),
    })
  ).optional(),

  // Optional Interests & Hobbies
  interests: z.array(z.string()).optional(),
})

type SkillsExtrasData = z.infer<typeof skillsExtrasSchema>

interface SkillsExtrasFormProps {
  initialData?: Partial<SkillsExtrasData>
  onNext: (data: SkillsExtrasData) => void
  onPrevious: () => void
}

export function SkillsExtrasForm({ initialData, onNext, onPrevious }: SkillsExtrasFormProps) {
  // Skill input states
  const [technicalInput, setTechnicalInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [toolsInput, setToolsInput] = useState('')
  const [interestsInput, setInterestsInput] = useState('')
  const [techInputs, setTechInputs] = useState<Record<number, string>>({})

  // Section visibility toggles
  const [showLanguages, setShowLanguages] = useState(!!initialData?.languages?.length)
  const [showCertifications, setShowCertifications] = useState(!!initialData?.certifications?.length)
  const [showProjects, setShowProjects] = useState(!!initialData?.projects?.length)
  const [showVolunteer, setShowVolunteer] = useState(!!initialData?.volunteer?.length)
  const [showAwards, setShowAwards] = useState(!!initialData?.awards?.length)
  const [showInterests, setShowInterests] = useState(!!initialData?.interests?.length)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SkillsExtrasData>({
    resolver: zodResolver(skillsExtrasSchema),
    defaultValues: initialData || {
      technical: [],
      soft: [],
      tools: [],
      languages: [],
      certifications: [],
      projects: [],
      volunteer: [],
      awards: [],
      interests: [],
    },
  })

  // Field arrays for optional sections
  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages',
  })

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: 'certifications',
  })

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects',
  })

  const { fields: volunteerFields, append: appendVolunteer, remove: removeVolunteer } = useFieldArray({
    control,
    name: 'volunteer',
  })

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'awards',
  })

  const technical = watch('technical') || []
  const soft = watch('soft') || []
  const tools = watch('tools') || []
  const interests = watch('interests') || []
  const watchedVolunteer = watch('volunteer')

  // Skill management functions
  const addSkill = (type: keyof SkillsExtrasData, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      const currentSkills = watch(type) as string[] || []
      setValue(type, [...currentSkills, value.trim()])
      setter('')
    }
  }

  const removeSkill = (type: keyof SkillsExtrasData, index: number) => {
    const currentSkills = watch(type) as string[] || []
    setValue(type, currentSkills.filter((_, i) => i !== index))
  }

  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: keyof SkillsExtrasData,
    value: string,
    setter: (val: string) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(type, value, setter)
    }
  }

  const addTechnology = (index: number) => {
    const input = techInputs[index]
    if (input?.trim()) {
      const currentTech = watch(`projects.${index}.technologies`) || []
      setValue(`projects.${index}.technologies`, [...currentTech, input.trim()])
      setTechInputs({ ...techInputs, [index]: '' })
    }
  }

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const currentTech = watch(`projects.${projectIndex}.technologies`) || []
    setValue(`projects.${projectIndex}.technologies`, currentTech.filter((_, i) => i !== techIndex))
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      {/* Required Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technical Skills */}
          <div className="space-y-3">
            <Label>Technical Skills *</Label>
            <div className="flex gap-2">
              <Input
                value={technicalInput}
                onChange={(e) => setTechnicalInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'technical', technicalInput, setTechnicalInput)}
                placeholder="e.g., React, Python, AWS"
              />
              <Button
                type="button"
                onClick={() => addSkill('technical', technicalInput, setTechnicalInput)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technical.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill('technical', index)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.technical && (
              <p className="text-sm text-red-600">{errors.technical.message}</p>
            )}
          </div>

          {/* Soft Skills */}
          <div className="space-y-3">
            <Label>Soft Skills (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={softInput}
                onChange={(e) => setSoftInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'soft', softInput, setSoftInput)}
                placeholder="e.g., Leadership, Communication, Problem Solving"
              />
              <Button
                type="button"
                onClick={() => addSkill('soft', softInput, setSoftInput)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {soft.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill('soft', index)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="space-y-3">
            <Label>Tools & Technologies (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'tools', toolsInput, setToolsInput)}
                placeholder="e.g., Git, Docker, Figma, Jira"
              />
              <Button
                type="button"
                onClick={() => addSkill('tools', toolsInput, setToolsInput)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeSkill('tools', index)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Languages Section */}
      {!showLanguages ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowLanguages(true)
            appendLanguage({ language: '', proficiency: '' })
          }}
          className="w-full border-dashed"
        >
          <Languages className="w-4 h-4 mr-2" />
          Add Languages
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Languages (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {languageFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Language {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input
                      {...register(`languages.${index}.language`)}
                      placeholder="English"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proficiency</Label>
                    <Input
                      {...register(`languages.${index}.proficiency`)}
                      placeholder="Native, Fluent, Intermediate, Basic"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendLanguage({ language: '', proficiency: '' })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Language
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optional Certifications Section */}
      {!showCertifications ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowCertifications(true)
            appendCert({ name: '', issuer: '', date: '', expiryDate: '', credentialId: '', url: '' })
          }}
          className="w-full border-dashed"
        >
          <Award className="w-4 h-4 mr-2" />
          Add Certifications
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {certFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Certification {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCert(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certification Name</Label>
                    <Input
                      {...register(`certifications.${index}.name`)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      {...register(`certifications.${index}.issuer`)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      {...register(`certifications.${index}.date`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date (Optional)</Label>
                    <Input
                      type="date"
                      {...register(`certifications.${index}.expiryDate`)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Credential ID (Optional)</Label>
                    <Input
                      {...register(`certifications.${index}.credentialId`)}
                      placeholder="ABC123XYZ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential URL</Label>
                    <Input
                      {...register(`certifications.${index}.url`)}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendCert({ name: '', issuer: '', date: '', expiryDate: '', credentialId: '', url: '' })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Certification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optional Projects Section */}
      {!showProjects ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowProjects(true)
            appendProject({ 
              name: '', 
              description: '', 
              role: '', 
              technologies: [], 
              startDate: '', 
              endDate: '', 
              url: '', 
              highlights: '' 
            })
          }}
          className="w-full border-dashed"
        >
          <FolderGit2 className="w-4 h-4 mr-2" />
          Add Projects
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5" />
              Projects (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectFields.map((field, index) => {
              const technologies = watch(`projects.${index}.technologies`) || []
              
              return (
                <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      {...register(`projects.${index}.name`)}
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`projects.${index}.description`)}
                      placeholder="Describe the project, its purpose, and your contributions..."
                      rows={9}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Your Role (Optional)</Label>
                      <Input
                        {...register(`projects.${index}.role`)}
                        placeholder="Lead Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Project URL (Optional)</Label>
                      <Input
                        {...register(`projects.${index}.url`)}
                        placeholder="https://github.com/username/project"
                        type="url"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies Used</Label>
                    <div className="flex gap-2">
                      <Input
                        value={techInputs[index] || ''}
                        onChange={(e) => setTechInputs({ ...techInputs, [index]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTechnology(index)
                          }
                        }}
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                      <Button
                        type="button"
                        onClick={() => addTechnology(index)}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="px-3 py-1">
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(index, techIndex)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date (Optional)</Label>
                      <Input
                        type="date"
                        {...register(`projects.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date (Optional)</Label>
                      <Input
                        type="date"
                        {...register(`projects.${index}.endDate`)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Key Achievements (Optional)</Label>
                    <Textarea
                      {...register(`projects.${index}.highlights`)}
                      placeholder="Key accomplishments, metrics, or notable features..."
                      rows={7}
                    />
                  </div>
                </div>
              )
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendProject({ 
                name: '', 
                description: '', 
                role: '', 
                technologies: [], 
                startDate: '', 
                endDate: '', 
                url: '', 
                highlights: '' 
              })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optional Volunteer Experience Section */}
      {!showVolunteer ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowVolunteer(true)
            appendVolunteer({ 
              organization: '', 
              role: '', 
              startDate: '', 
              endDate: '', 
              isCurrentRole: false,
              description: '', 
              achievements: '' 
            })
          }}
          className="w-full border-dashed"
        >
          <Heart className="w-4 h-4 mr-2" />
          Add Volunteer Experience
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Volunteer Experience (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {volunteerFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Volunteer Experience {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVolunteer(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input
                      {...register(`volunteer.${index}.organization`)}
                      placeholder="Code for Kenya"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      {...register(`volunteer.${index}.role`)}
                      placeholder="Volunteer Developer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      {...register(`volunteer.${index}.startDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      {...register(`volunteer.${index}.endDate`)}
                      disabled={watchedVolunteer?.[index]?.isCurrentRole}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-volunteer-${index}`}
                        checked={watchedVolunteer?.[index]?.isCurrentRole || false}
                        onCheckedChange={(checked) => {
                          setValue(`volunteer.${index}.isCurrentRole`, !!checked)
                          if (checked) {
                            setValue(`volunteer.${index}.endDate`, '')
                          }
                        }}
                      />
                      <Label htmlFor={`current-volunteer-${index}`} className="text-sm">
                        I currently volunteer here
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register(`volunteer.${index}.description`)}
                    placeholder="Describe your volunteer work and responsibilities..."
                    rows={7}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Achievements (Optional)</Label>
                  <Textarea
                    {...register(`volunteer.${index}.achievements`)}
                    placeholder="Key accomplishments and impact made..."
                    rows={7}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendVolunteer({ 
                organization: '', 
                role: '', 
                startDate: '', 
                endDate: '', 
                isCurrentRole: false,
                description: '', 
                achievements: '' 
              })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Volunteer Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optional Awards & Achievements Section */}
      {!showAwards ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowAwards(true)
            appendAward({ title: '', issuer: '', date: '', description: '' })
          }}
          className="w-full border-dashed"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Add Awards & Achievements
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Awards & Achievements (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {awardFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Award {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAward(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Award Title</Label>
                    <Input
                      {...register(`awards.${index}.title`)}
                      placeholder="Employee of the Year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      {...register(`awards.${index}.issuer`)}
                      placeholder="TechCorp Inc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Received</Label>
                  <Input
                    type="date"
                    {...register(`awards.${index}.date`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    {...register(`awards.${index}.description`)}
                    placeholder="Brief description of the award and why you received it..."
                    rows={7}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendAward({ title: '', issuer: '', date: '', description: '' })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Award
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optional Interests & Hobbies Section */}
      {!showInterests ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowInterests(true)}
          className="w-full border-dashed"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Add Interests & Hobbies
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interests & Hobbies (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Share hobbies and interests that add personality to your profile. Include activities that demonstrate creativity, continuous learning, leadership, or community involvement.
            </p>
            <div className="flex gap-2">
              <Input
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'interests', interestsInput, setInterestsInput)}
                placeholder="e.g., Open Source Contributing, Photography, Marathon Running"
              />
              <Button
                type="button"
                onClick={() => addSkill('interests', interestsInput, setInterestsInput)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeSkill('interests', index)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" className="px-8">
          Next Step
        </Button>
      </div>
    </form>
  )
}