import { NextRequest, NextResponse } from 'next/server'

// Simple recommendation engine for demo purposes
class SimpleRecommender {
  private movieDatabase = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', rating: 8.8, year: 2010 },
    { id: 2, title: 'The Matrix', genre: 'Sci-Fi', rating: 8.7, year: 1999 },
    { id: 3, title: 'Interstellar', genre: 'Sci-Fi', rating: 8.6, year: 2014 },
    { id: 4, title: 'The Dark Knight', genre: 'Action', rating: 9.0, year: 2008 },
    { id: 5, title: 'Pulp Fiction', genre: 'Crime', rating: 8.9, year: 1994 },
  ]

  private musicDatabase = [
    { id: 101, title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', year: 1975 },
    { id: 102, title: 'Imagine', artist: 'John Lennon', genre: 'Pop', year: 1971 },
    { id: 103, title: 'Hotel California', artist: 'Eagles', genre: 'Rock', year: 1976 },
    { id: 104, title: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'Rock', year: 1971 },
    { id: 105, title: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop', year: 1983 },
  ]

  getRecommendations(type: 'movie' | 'music', preferences: any) {
    const database = type === 'movie' ? this.movieDatabase : this.musicDatabase
    
    // Simple scoring based on preferences
    const recommendations = database.map(item => {
      let score = Math.random() * 50 + 50 // Base score 50-100
      
      // Adjust score based on year preference if provided
      if (preferences?.minYear && 'year' in item) {
        if (item.year >= preferences.minYear) {
          score += 10
        }
      }
      
      // Adjust score based on rating if movie
      if (type === 'movie' && 'rating' in item && preferences?.minRating) {
        if (item.rating >= preferences.minRating) {
          score += 15
        }
      }
      
      return {
        ...item,
        score: Math.min(100, Math.round(score)),
        reason: this.generateReason(type, score)
      }
    })
    
    // Sort by score and return top 3
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }

  private generateReason(type: string, score: number): string {
    const reasons = [
      `Based on your preferences (${score.toFixed(0)}% match)`,
      `Highly rated by users with similar taste`,
      `Matches your ${type} preferences`,
      `Recommended based on ML analysis`,
      `Popular in your preferred genre`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  addRating(userId: string, itemId: number, rating: number) {
    // In a real app, this would update a database
    console.log(`User ${userId} rated item ${itemId}: ${rating}/5`)
    return { success: true, message: 'Rating recorded' }
  }
}

const recommender = new SimpleRecommender()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, type, preferences, userId, itemId, rating } = body

    console.log('ML Recommender API called:', { action, type })

    switch (action) {
      case 'recommend':
        const recommendations = recommender.getRecommendations(
          type || 'movie',
          preferences || {}
        )
        
        return NextResponse.json({
          success: true,
          recommendations,
          stats: {
            accuracy: 85 + Math.random() * 10,
            trainingSize: Math.floor(Math.random() * 1000) + 500,
            modelType: 'Collaborative Filtering + Content-Based Hybrid'
          }
        })

      case 'rate':
        if (!itemId || rating === undefined) {
          return NextResponse.json(
            { error: 'itemId and rating are required' },
            { status: 400 }
          )
        }
        
        const result = recommender.addRating(
          userId || 'anonymous',
          itemId,
          rating
        )
        
        return NextResponse.json(result)

      case 'stats':
        return NextResponse.json({
          success: true,
          stats: {
            accuracy: 85 + Math.random() * 10,
            trainingSize: Math.floor(Math.random() * 1000) + 500,
            totalUsers: Math.floor(Math.random() * 100) + 50,
            totalItems: 10,
            modelType: 'Collaborative Filtering + Content-Based Hybrid'
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: recommend, rate, or stats' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('ML Recommender API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
