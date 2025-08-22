'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Eye, Edit, Download, Copy, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ResumeCardProps {
  resume: {
    id: string
    title: string
    template_id: string
    ats_score: number | null
    updated_at: string
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function ResumeCard({ resume, onEdit, onDelete, onDuplicate }: ResumeCardProps) {
  const getATSScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600'
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium truncate">
            {resume.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(resume.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(resume.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(resume.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(resume.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            Template {resume.template_id}
          </Badge>
          {resume.ats_score && (
            <Badge className={`text-xs ${getATSScoreColor(resume.ats_score)}`}>
              ATS: {resume.ats_score}%
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onEdit(resume.id)} 
          className="w-full"
        >
          Continue Editing
        </Button>
      </CardFooter>
    </Card>
  )
}