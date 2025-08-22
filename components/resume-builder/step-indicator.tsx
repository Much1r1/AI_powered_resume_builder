'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  completed: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string
  onStepClick: (stepId: string) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStep
        const isCompleted = step.completed
        const isClickable = isCompleted || isCurrent

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                isCurrent && "border-blue-600 bg-blue-600 text-white",
                isCompleted && !isCurrent && "border-green-600 bg-green-600 text-white",
                !isCurrent && !isCompleted && "border-gray-300 text-gray-400",
                isClickable && "hover:scale-105 cursor-pointer",
                !isClickable && "cursor-not-allowed"
              )}
            >
              {isCompleted && !isCurrent ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </button>
            
            <div className="ml-3 mr-4">
              <p className={cn(
                "text-sm font-medium",
                isCurrent && "text-blue-600",
                isCompleted && "text-green-600",
                !isCurrent && !isCompleted && "text-gray-400"
              )}>
                {step.title}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-2",
                isCompleted && "bg-green-600",
                !isCompleted && "bg-gray-300"
              )} />
            )}
          </div>
        )
      })}
    </nav>
  )
}