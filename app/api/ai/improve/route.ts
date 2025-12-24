import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, type, action, tone } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    let systemPrompt = ''
    let userPrompt = ''

    // Different prompts based on action type
    switch (action) {
      case 'improve':
        systemPrompt = `You are an expert resume writer and career coach. Your job is to improve resume content to be:
- Action-oriented with strong verbs
- Achievement-focused with quantifiable results
- Concise and impactful
- ATS-friendly (no fancy formatting)
- Professional and compelling

Return ONLY the improved text, nothing else. No explanations, no markdown, no quotes.`

        userPrompt = `Improve this ${type} for a professional resume:\n\n"${text}"\n\nImproved version:`
        break

      case 'tone':
        systemPrompt = `You are an expert resume writer. Rewrite the given text to match the specified tone while keeping the same core meaning and achievements. Return ONLY the rewritten text.`

        const toneDescriptions: Record<string, string> = {
          professional: 'formal, corporate, and polished',
          casual: 'approachable but still professional',
          technical: 'technical, detailed, and precise',
          executive: 'senior-level, strategic, and leadership-focused',
          creative: 'dynamic, innovative, and engaging',
        }

        userPrompt = `Rewrite this in a ${toneDescriptions[tone || 'professional']} tone:\n\n"${text}"\n\nRewritten:`
        break

      case 'bulletize':
        systemPrompt = `You are an expert resume writer. Convert the given paragraph into 3-5 powerful bullet points. Each bullet should:
          - Start with a strong action verb
          - Be concise (under 20 words)
          - Highlight achievements and impact
          - Include metrics when possible

         Return ONLY the bullet points, one per line, starting with "•". No additional text.`

        userPrompt = `Convert this into resume bullet points:\n\n"${text}"`
        break

      case 'quantify':
        systemPrompt = `You are an expert resume writer. Analyze this text and suggest specific metrics or numbers that could be added to make it more impactful. 

          Return your response in this exact format:
          SUGGESTIONS:
          - [First suggestion with specific metric]
          - [Second suggestion]
          - [Third suggestion]

          IMPROVED VERSION:
          [The text with placeholder metrics like [X%], [Y clients], [Z projects] where numbers should go]`

        userPrompt = `Suggest quantifiable metrics for this:\n\n"${text}"`
        break

      case 'grammar':
        systemPrompt = `You are a professional editor. Fix any grammar, spelling, or punctuation errors in the text. Keep the tone and style the same. Return ONLY the corrected text.`

        userPrompt = `Fix any errors in this text:\n\n"${text}"`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action type' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Faster and cheaper, perfect for this use case
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const improvedText = completion.choices[0]?.message?.content?.trim() || text

    return NextResponse.json({
      original: text,
      improved: improvedText,
      action,
      type,
    })

  } catch (error: any) {
    console.error('AI Improvement Error:', error)
    return NextResponse.json(
      { error: 'Failed to improve text', details: error.message },
      { status: 500 }
    )
  }
}