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
import { Plus, Trash2, Briefcase, Wand2 } from 'lucide-react'

const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      jobTitle: z.string().min(1, 'Job title is required'),
      company: z.string().min(1, 'Company is required'),
      location: z.string().min(1, 'Location is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      isCurrentJob: z.boolean().default(false),
      description: z.string().min(50, 'Description should be at least 50 characters'),
    })
  ).min(1, 'At least one work experience is required'),
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
    defaultValues: initialData?.experiences?.length 
      ? initialData 
      : {
          experiences: [{
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentJob: false,
            description: '',
          }]
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

  const improveDescription = async (index: number) => {
    const experience = watchedExperiences[index]
    if (!experience.description) return

    setImprovingIndex(index)
    
    // Simulate AI improvement (replace with actual API call)
    setTimeout(() => {
      const improvedText = `${experience.description}\n\n• Achieved measurable results through strategic initiatives\n• Collaborated with cross-functional teams to deliver high-impact solutions\n• Streamlined processes resulting in increased efficiency and cost savings`
      setValue(`experiences.${index}.description`, improvedText)
      setImprovingIndex(null)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
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
                  placeholder="San Francisco, CA"
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
                    onClick={() => improveDescription(index)}
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

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Experience
          </Button>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button type="submit" className="px-8">
              Next Step
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}