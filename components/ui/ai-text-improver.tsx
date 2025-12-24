'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Wand2, Loader2, Check, Copy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AITextImproverProps {
  text: string
  onTextChange: (newText: string) => void
  type?: 'description' | 'summary' | 'bullet' | 'general'
}

export function AITextImprover({ text, onTextChange, type = 'general' }: AITextImproverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [improvedText, setImprovedText] = useState('')
  const [error, setError] = useState('')

  const improveText = async (action: string, tone?: string) => {
    if (!text || text.trim().length === 0) {
      setError('Please enter some text first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, action, tone }),
      })

      if (!response.ok) {
        throw new Error('Failed to improve text')
      }

      const data = await response.json()
      setImprovedText(data.improved)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const applyImprovement = () => {
    onTextChange(improvedText)
    setImprovedText('')
    setIsOpen(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedText)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
          disabled={!text || text.trim().length === 0}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          AI Improve
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">AI Improvements</h3>
            {improvedText && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>

          {!improvedText ? (
            <Tabs defaultValue="improve" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="improve">Improve</TabsTrigger>
                <TabsTrigger value="tone">Tone</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
              </TabsList>

              <TabsContent value="improve" className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('improve')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '✨'}
                  Make it better
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('grammar')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '📝'}
                  Fix grammar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('quantify')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '📊'}
                  Add metrics
                </Button>
              </TabsContent>

              <TabsContent value="tone" className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('tone', 'professional')}
                  disabled={loading}
                >
                  Professional
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('tone', 'executive')}
                  disabled={loading}
                >
                  Executive
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('tone', 'technical')}
                  disabled={loading}
                >
                  Technical
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('tone', 'creative')}
                  disabled={loading}
                >
                  Creative
                </Button>
              </TabsContent>

              <TabsContent value="more" className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('bulletize')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '•'}
                  Convert to bullets
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => improveText('improve')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '🎯'}
                  Shorten
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {improvedText}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={applyImprovement}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImprovedText('')}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}