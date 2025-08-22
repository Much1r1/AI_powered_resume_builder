import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateResumeContent(profileData: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Generate compelling resume content based on the provided profile information."
        },
        {
          role: "user",
          content: `Please help me create a professional resume based on this information: ${profileData}`
        }
      ],
      max_tokens: 2000,
    })
    
    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    return ''
  }
}

export async function improveResumeContent(content: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume optimizer. Improve the given resume content with stronger action verbs, quantified achievements, and better formatting."
        },
        {
          role: "user",
          content: `Please improve this resume content: ${content}`
        }
      ],
      max_tokens: 2000,
    })
    
    return completion.choices[0]?.message?.content || content
  } catch (error) {
    console.error('OpenAI API error:', error)
    return content
  }
}

export async function tailorResumeToJob(resumeContent: string, jobDescription: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a resume optimization expert. Tailor the resume content to match the job description while maintaining accuracy."
        },
        {
          role: "user",
          content: `Resume: ${resumeContent}\n\nJob Description: ${jobDescription}\n\nPlease tailor this resume to better match the job requirements.`
        }
      ],
      max_tokens: 2000,
    })
    
    return completion.choices[0]?.message?.content || resumeContent
  } catch (error) {
    console.error('OpenAI API error:', error)
    return resumeContent
  }
}

export async function generateCoverLetter(resumeContent: string, jobDescription: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional cover letter writer. Generate a compelling cover letter based on the resume and job description."
        },
        {
          role: "user",
          content: `Resume: ${resumeContent}\n\nJob Description: ${jobDescription}\n\nPlease write a professional cover letter.`
        }
      ],
      max_tokens: 1500,
    })
    
    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    return ''
  }
}

export async function calculateATSScore(resumeContent: string, jobDescription: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and provide a score from 0-100 with specific improvement suggestions. Return a JSON object with 'score' and 'suggestions' fields."
        },
        {
          role: "user",
          content: `Resume: ${resumeContent}\n\nJob Description: ${jobDescription}\n\nPlease analyze this resume and provide an ATS score with improvement suggestions.`
        }
      ],
      max_tokens: 1000,
    })
    
    const result = completion.choices[0]?.message?.content || '{"score": 50, "suggestions": ["Add more relevant keywords from the job description"]}'
    
    try {
      return JSON.parse(result)
    } catch {
      return { score: 50, suggestions: ["Unable to analyze - please try again"] }
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return { score: 50, suggestions: ["Unable to analyze - please try again"] }
  }
}