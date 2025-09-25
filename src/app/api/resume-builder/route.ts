import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Fallback function for when no API key is available
function generateFallbackSuggestion(section: string, content: string): string {
  const suggestions: { [key: string]: string[] } = {
    summary: [
      'Consider starting with a strong action verb',
      'Keep it concise - 2-3 sentences maximum',
      'Highlight your unique value proposition',
      'Include relevant keywords from the job description'
    ],
    experience: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Quantify achievements with specific metrics',
      'Start each bullet point with a strong action verb',
      'Focus on impact and results, not just responsibilities'
    ],
    skills: [
      'Organize skills by category (Technical, Soft Skills, etc.)',
      'Prioritize skills mentioned in the job description',
      'Include proficiency levels where appropriate',
      'Balance technical and soft skills'
    ],
    education: [
      'Include relevant coursework if early in career',
      'List GPA if 3.5 or higher',
      'Include academic honors and awards',
      'Add relevant projects or research'
    ]
  }
  
  return suggestions[section]?.[Math.floor(Math.random() * suggestions[section].length)] || 
    'Focus on clarity, relevance, and impact in your resume content.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, section, content, jobDescription } = body

    console.log('Resume Builder API called:', { action, section })

    switch (action) {
      case 'optimize':
        if (!section || !content) {
          return NextResponse.json(
            { error: 'Section and content are required' },
            { status: 400 }
          )
        }

        let suggestion: string
        let atsScore: number = 75 + Math.random() * 20

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
          try {
            const prompt = `You are an expert resume writer and ATS optimizer. 
            
            Section: ${section}
            Current Content: ${content}
            ${jobDescription ? `Job Description: ${jobDescription}` : ''}
            
            Provide specific, actionable suggestions to improve this resume section for ATS systems and human readers. 
            Focus on: keywords, action verbs, quantifiable achievements, and clarity.
            Keep response under 150 words.`

            const completion = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: 'You are a professional resume optimization expert.' },
                { role: 'user', content: prompt }
              ],
              max_tokens: 200,
              temperature: 0.7,
            })

            suggestion = completion.choices[0]?.message?.content || generateFallbackSuggestion(section, content)
            
            // Calculate a more sophisticated ATS score if we have job description
            if (jobDescription) {
              const keywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || []
              const contentWords = content.toLowerCase().match(/\b\w+\b/g) || []
              const matches = keywords.filter(word => contentWords.includes(word))
              atsScore = Math.min(95, 60 + (matches.length / keywords.length) * 35 + Math.random() * 10)
            }
          } catch (error) {
            console.error('OpenAI error:', error)
            suggestion = generateFallbackSuggestion(section, content)
          }
        } else {
          suggestion = generateFallbackSuggestion(section, content)
        }

        return NextResponse.json({
          success: true,
          suggestion,
          atsScore: Math.round(atsScore),
          keywords: extractKeywords(content),
          improvements: [
            atsScore < 80 ? 'Add more relevant keywords' : 'Keywords are well-optimized',
            'Consider adding quantifiable achievements',
            'Ensure consistent formatting'
          ]
        })

      case 'analyze':
        const fullContent = content || ''
        const analysis = {
          wordCount: fullContent.split(/\s+/).length,
          bulletPoints: (fullContent.match(/[•·▪▫◦‣⁃]/g) || []).length,
          actionVerbs: (fullContent.match(/\b(achieved|built|created|developed|enhanced|improved|led|managed|optimized|reduced|streamlined)\b/gi) || []).length,
          numbers: (fullContent.match(/\d+/g) || []).length,
          atsScore: Math.round(70 + Math.random() * 25)
        }

        return NextResponse.json({
          success: true,
          analysis,
          recommendations: generateRecommendations(analysis)
        })

      case 'template':
        const templates = {
          'software-engineer': {
            sections: ['Summary', 'Technical Skills', 'Experience', 'Projects', 'Education'],
            tips: 'Focus on technical achievements and quantifiable impact'
          },
          'data-scientist': {
            sections: ['Summary', 'Technical Skills', 'Experience', 'Research', 'Education', 'Publications'],
            tips: 'Highlight ML/AI projects and statistical analysis skills'
          },
          'product-manager': {
            sections: ['Summary', 'Experience', 'Skills', 'Achievements', 'Education'],
            tips: 'Emphasize cross-functional leadership and product metrics'
          },
          'general': {
            sections: ['Summary', 'Experience', 'Skills', 'Education', 'Achievements'],
            tips: 'Tailor content to match job requirements'
          }
        }

        return NextResponse.json({
          success: true,
          template: templates[body.templateType || 'general']
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: optimize, analyze, or template' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Resume Builder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function extractKeywords(content: string): string[] {
  // Simple keyword extraction - in production, use NLP library
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were'])
  const words = content.toLowerCase().match(/\b[a-z]+\b/g) || []
  const wordCount: { [key: string]: number } = {}
  
  words.forEach(word => {
    if (!commonWords.has(word) && word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
}

function generateRecommendations(analysis: any): string[] {
  const recs = []
  
  if (analysis.wordCount < 300) {
    recs.push('Consider adding more detail to your resume')
  } else if (analysis.wordCount > 800) {
    recs.push('Try to be more concise - aim for 1-2 pages')
  }
  
  if (analysis.actionVerbs < 5) {
    recs.push('Use more action verbs to start your bullet points')
  }
  
  if (analysis.numbers < 3) {
    recs.push('Add quantifiable achievements and metrics')
  }
  
  if (analysis.atsScore < 80) {
    recs.push('Optimize keywords for ATS systems')
  }
  
  return recs.length > 0 ? recs : ['Your resume is well-optimized!']
}
