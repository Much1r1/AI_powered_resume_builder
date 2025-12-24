'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Eye } from 'lucide-react'
import { Description } from '@radix-ui/react-toast'

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech roles',
    preview: '/api/placeholder/300/400',
    features: ['ATS Optimized', 'Clean Layout', 'Modern Typography'],
    category: 'Professional'
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    description: 'Traditional format suitable for corporate positions',
    preview: '/api/placeholder/300/400',
    features: ['Traditional Layout', 'Professional', 'Corporate Style'],
    category: 'Traditional'
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Eye-catching design for creative professionals',
    preview: '/api/placeholder/300/400',
    features: ['Visual Appeal', 'Creative Layout', 'Color Accents'],
    category: 'Creative'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant design with focus on content',
    preview: '/api/placeholder/300/400',
    features: ['Minimal Design', 'Content Focus', 'Easy to Read'],
    category: 'Minimal'
  },
  {
    id: 'tech',
    name: 'Tech Stack',
    description: 'Developer-focused template with skills showcase',
    preview: '/api/placeholder/300/400',
    features: ['GitHub Integration', 'Skills Grid', 'Project Highlights'],
    category: 'Professional'
  },
  {
    id: 'executive',
    name: 'Senior Executive',
    description: 'Sophisticated layout for C-level positions',
    preview: '/api/placeholder/300/400',
    features: ['Two Column', 'Leadership Focus', 'Achievement Driven'],
    category: 'Traditional'
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Detailed format for research and academic positions',
    preview: '/api/placeholder/300/400',
    features: ['Publications Section', 'Research Focus', 'Citation Ready'],
    category: 'Traditional'
  },
  {
    id: 'startup',
    name: 'Startup Innovator',
    description: 'Dynamic design for fast-paced startup environments',
    preview: '/api/placeholder/300/400',
    features: ['Bold Headers', 'Impact Metrics', 'Startup Culture'],
    category: 'Professional'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Showcase',
    description: 'Visual-heavy template for designers and artists',
    preview: '/api/placeholder/300/400',
    features: ['Image Gallery', 'Visual Projects', 'Creative Expression'],
    category: 'Creative'
  },
  {
    id: 'bold',
    name: 'Bold Impact',
    description: 'Attention-grabbing design with strong visual hierarchy',
    preview: '/api/placeholder/300/400',
    features: ['Strong Typography', 'Color Blocking', 'Stand Out Design'],
    category: 'Creative'
  },
  {
    id: 'sidebar',
    name: 'Sidebar Professional',
    description: 'Two-column layout with sidebar for quick scanning',
    preview: '/api/placeholder/300/400',
    features: ['Two Column', 'Easy Scanning', 'Space Efficient'],
    category: 'Professional'
  },
  {
    id: 'timeline',
    name: 'Career Timeline',
    description: 'Chronological layout emphasizing career progression',
    preview: '/api/placeholder/300/400',
    features: ['Visual Timeline', 'Career Path', 'Progress Focused'],
    category: 'Professional'
  },
  {
    id: 'compact',
    name: 'Compact Efficient',
    description: 'Maximum information in minimal space',
    preview: '/api/placeholder/300/400',
    features: ['Space Saving', 'Dense Layout', 'More Content'],
    category: 'Minimal'
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    description: 'Refined typography for sophisticated professionals',
    preview: '/api/placeholder/300/400',
    features: ['Serif Fonts', 'Refined Look', 'Classic Elegance'],
    category: 'Traditional'
  },
  {
    id: 'gradient',
    name: 'Gradient Modern',
    description: 'Contemporary design with subtle color gradients',
    preview: '/api/placeholder/300/400',
    features: ['Gradient Accents', 'Modern Colors', 'Eye Catching'],
    category: 'Creative'
  },
  {
    id: 'infographic',
    name: 'Infographic Style',
    description: 'Visual resume with charts and graphs',
    preview: '/api/placeholder/300/400',
    features: ['Data Visualization', 'Charts & Graphs', 'Visual Stats'],
    category: 'Creative'
  },
  {
    id: 'simple',
    name: 'Simply Professional',
    description: 'No-frills design that lets your experience shine',
    preview: '/api/placeholder/300/400',
    features: ['No Distractions', 'Content First', 'Universal Appeal'],
    category: 'Minimal'
  },
  {
    id: 'magazine',
    name: 'Magazine Layout',
    description: 'Editorial-style format with visual hierarchy',
    preview: '/api/placeholder/300/400',
    features: ['Magazine Style', 'Visual Sections', 'Editorial Feel'],
    category: 'Creative'
  }
]

interface TemplateSelectorProps {
  selectedTemplate: string | null
  onTemplateSelect: (templateId: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function TemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  onNext, 
  onPrevious 
}: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a professional template that matches your style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-blue-600 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={`https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewTemplate(template.id)
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedTemplate}
          className="px-8"
        >
          Continue with Template
        </Button>
      </div>
    </div>
  )
}