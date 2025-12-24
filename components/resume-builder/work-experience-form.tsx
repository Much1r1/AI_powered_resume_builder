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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Briefcase, Wand2, GraduationCap } from 'lucide-react'
import { AITextImprover } from '@/components/ui/ai-text-improver'

const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      jobTitle: z.string().min(1, 'Job title is required'),
      company: z.string().min(1, 'Company is required'),
      location: z.string().min(1, 'Location is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      isCurrentJob: z.boolean(),
      description: z.string().min(50, 'Description should be at least 50 characters'),
    })
  ).min(1, 'At least one work experience is required'),
  education: z.object({
    campus: z.object({
      institution: z.string().min(1, 'Institution is required'),
      degree: z.string().min(1, 'Degree is required'),
      field: z.string().min(1, 'Field of study is required'),
      location: z.string().min(1, 'Location is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
      honors: z.string().optional(),
    }),
    highSchool: z.object({
      institution: z.string().optional(),
      location: z.string().optional(),
      graduationYear: z.string().optional(),
      gpa: z.string().optional(),
      honors: z.string().optional(),
    }).optional(),
  }),
})

type WorkExperienceData = z.infer<typeof workExperienceSchema>

interface WorkExperienceFormProps {
  initialData?: Partial<WorkExperienceData>
  onNext: (data: WorkExperienceData) => void
  onPrevious: () => void
}

export function WorkExperienceForm({ initialData, onNext, onPrevious }: WorkExperienceFormProps) {
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WorkExperienceData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: initialData?.experiences?.length 
        ? initialData.experiences
        : [{
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentJob: false,
            description: '',
          }],
      education: initialData?.education || {
        campus: {
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          honors: '',
        },
        highSchool: {
          institution: '',
          location: '',
          graduationYear: '',
          gpa: '',
          honors: '',
        }
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  })

  const watchedExperiences = watch('experiences')

  const addExperience = () => {
    append({
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
    })
  }

  {fields.map((field, index) => (
    <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experience {index + 1}</h3>
        {fields.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
  
      {/* ... other fields ... */}
  
      {/* Description field with AI Improver */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`experiences.${index}.description`}>Description</Label>
          <AITextImprover
            text={watchedExperiences[index]?.description || ''}
            onTextChange={(newText) => setValue(`experiences.${index}.description` as any, newText)}
            type="description"
          />
        </div>
        <Textarea
          {...register(`experiences.${index}.description`)}
          placeholder="Describe your responsibilities and achievements..."
          rows={4}
          className={errors.experiences?.[index]?.description ? 'border-red-500' : ''}
        />
        {errors.experiences?.[index]?.description && (
          <p className="text-sm text-red-600">
            {errors.experiences[index]?.description?.message}
          </p>
        )}
      </div>
    </div>
  ))}
  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      {/* Work Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.jobTitle`}>Job Title</Label>
                  <Input
                    {...register(`experiences.${index}.jobTitle`)}
                    placeholder="Software Engineer"
                    className={errors.experiences?.[index]?.jobTitle ? 'border-red-500' : ''}
                  />
                  {errors.experiences?.[index]?.jobTitle && (
                    <p className="text-sm text-red-600">
                      {errors.experiences[index]?.jobTitle?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.company`}>Company</Label>
                  <Input
                    {...register(`experiences.${index}.company`)}
                    placeholder="Tech Corp"
                    className={errors.experiences?.[index]?.company ? 'border-red-500' : ''}
                  />
                  {errors.experiences?.[index]?.company && (
                    <p className="text-sm text-red-600">
                      {errors.experiences[index]?.company?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.location`}>Location</Label>
                <Input
                  {...register(`experiences.${index}.location`)}
                  placeholder="Nairobi, KE"
                  className={errors.experiences?.[index]?.location ? 'border-red-500' : ''}
                />
                {errors.experiences?.[index]?.location && (
                  <p className="text-sm text-red-600">
                    {errors.experiences[index]?.location?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.startDate`}>Start Date</Label>
                  <Input
                    type="date"
                    {...register(`experiences.${index}.startDate`)}
                    className={errors.experiences?.[index]?.startDate ? 'border-red-500' : ''}
                  />
                  {errors.experiences?.[index]?.startDate && (
                    <p className="text-sm text-red-600">
                      {errors.experiences[index]?.startDate?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.endDate`}>End Date</Label>
                  <Input
                    type="date"
                    {...register(`experiences.${index}.endDate`)}
                    disabled={watchedExperiences[index]?.isCurrentJob}
                    className={errors.experiences?.[index]?.endDate ? 'border-red-500' : ''}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${index}`}
                      checked={watchedExperiences[index]?.isCurrentJob || false}
                      onCheckedChange={(checked) => {
                        setValue(`experiences.${index}.isCurrentJob`, !!checked)
                        if (checked) {
                          setValue(`experiences.${index}.endDate`, '')
                        }
                      }}
                    />
                    <Label htmlFor={`current-${index}`} className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`experiences.${index}.description`}>Description</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    //onClick={() => improveDescription(index)}
                    disabled={improvingIndex === index}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {improvingIndex === index ? (
                      <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    AI Improve
                  </Button>
                </div>
                <Textarea
                  {...register(`experiences.${index}.description`)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={10}
                  className={errors.experiences?.[index]?.description ? 'border-red-500' : ''}
                />
                {errors.experiences?.[index]?.description && (
                  <p className="text-sm text-red-600">
                    {errors.experiences[index]?.description?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Experience
          </Button>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Campus/University Education */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium">College/University</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.campus.institution">Institution *</Label>
                <Input
                  {...register('education.campus.institution')}
                  placeholder="University/College"
                  className={errors.education?.campus?.institution ? 'border-red-500' : ''}
                />
                {errors.education?.campus?.institution && (
                  <p className="text-sm text-red-600">
                    {errors.education?.campus?.institution?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.campus.location">Location *</Label>
                <Input
                  {...register('education.campus.location')}
                  placeholder="Nairobi, KE"
                  className={errors.education?.campus?.location ? 'border-red-500' : ''}
                />
                {errors.education?.campus?.location && (
                  <p className="text-sm text-red-600">
                    {errors.education?.campus?.location?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.campus.degree">Degree *</Label>
                <Input
                  {...register('education.campus.degree')}
                  placeholder="Degree"
                  className={errors.education?.campus?.degree ? 'border-red-500' : ''}
                />
                {errors.education?.campus?.degree && (
                  <p className="text-sm text-red-600">
                    {errors.education?.campus?.degree?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.campus.field">Field of Study *</Label>
                <Input
                  {...register('education.campus.field')}
                  placeholder="E.g. Computer Science"
                  className={errors.education?.campus?.field ? 'border-red-500' : ''}
                />
                {errors.education?.campus?.field && (
                  <p className="text-sm text-red-600">
                    {errors.education?.campus?.field?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.campus.startDate">Start Date *</Label>
                <Input
                  type="date"
                  {...register('education.campus.startDate')}
                  className={errors.education?.campus?.startDate ? 'border-red-500' : ''}
                />
                {errors.education?.campus?.startDate && (
                  <p className="text-sm text-red-600">
                    {errors.education?.campus?.startDate?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.campus.endDate">End Date (or Expected)</Label>
                <Input
                  type="date"
                  {...register('education.campus.endDate')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.campus.gpa">GPA</Label>
                <Input
                  {...register('education.campus.gpa')}
                  placeholder="3.8/4.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.campus.honors">Honors/Awards (Optional)</Label>
                <Input
                  {...register('education.campus.honors')}
                  placeholder="Dean's List, Summa Cum Laude"
                />
              </div>
            </div>
          </div>

          {/* High School Education (Optional) */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
            <h3 className="text-lg font-medium">High School (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.highSchool.institution">School Name</Label>
                <Input
                  {...register('education.highSchool.institution')}
                  placeholder="...High School"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.highSchool.location">Location</Label>
                <Input
                  {...register('education.highSchool.location')}
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education.highSchool.graduationYear">Completion Year</Label>
                <Input
                  type="number"
                  {...register('education.highSchool.graduationYear')}
                  placeholder="2019"
                  min="1950"
                  max="2030"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education.highSchool.gpa">Grade</Label>
                <Input
                  {...register('education.highSchool.gpa')}
                  placeholder="B"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
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