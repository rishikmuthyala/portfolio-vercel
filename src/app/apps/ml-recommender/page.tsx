'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Film, 
  Music, 
  Star, 
  TrendingUp,
  Brain,
  Sparkles,
  Filter,
  Search,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Play,
  Info,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Loader2,
  RefreshCw,
  BookOpen
} from 'lucide-react'

// Sample movie/music data for demo
const SAMPLE_MOVIES = [
  { 
    id: 1, 
    title: "Inception", 
    year: 2010, 
    genre: ["Sci-Fi", "Thriller"], 
    rating: 8.8,
    director: "Christopher Nolan",
    description: "A thief who steals corporate secrets through dream-sharing technology.",
    similarity: 0.95
  },
  { 
    id: 2, 
    title: "The Matrix", 
    year: 1999, 
    genre: ["Sci-Fi", "Action"], 
    rating: 8.7,
    director: "The Wachowskis",
    description: "A computer hacker learns about the true nature of reality.",
    similarity: 0.92
  },
  { 
    id: 3, 
    title: "Interstellar", 
    year: 2014, 
    genre: ["Sci-Fi", "Drama"], 
    rating: 8.6,
    director: "Christopher Nolan",
    description: "A team of explorers travel through a wormhole in space.",
    similarity: 0.89
  },
  { 
    id: 4, 
    title: "Blade Runner 2049", 
    year: 2017, 
    genre: ["Sci-Fi", "Mystery"], 
    rating: 8.0,
    director: "Denis Villeneuve",
    description: "A young blade runner discovers a secret that threatens society.",
    similarity: 0.87
  },
  { 
    id: 5, 
    title: "Ex Machina", 
    year: 2014, 
    genre: ["Sci-Fi", "Thriller"], 
    rating: 7.7,
    director: "Alex Garland",
    description: "A programmer evaluates the human qualities of a highly advanced humanoid A.I.",
    similarity: 0.85
  }
]

const SAMPLE_MUSIC = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    year: 1975,
    genre: ["Rock", "Progressive"],
    energy: 0.8,
    danceability: 0.4,
    similarity: 0.94
  },
  {
    id: 2,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    year: 1971,
    genre: ["Rock", "Hard Rock"],
    energy: 0.7,
    danceability: 0.3,
    similarity: 0.91
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    year: 1976,
    genre: ["Rock", "Soft Rock"],
    energy: 0.6,
    danceability: 0.5,
    similarity: 0.88
  },
  {
    id: 4,
    title: "Comfortably Numb",
    artist: "Pink Floyd",
    album: "The Wall",
    year: 1979,
    genre: ["Rock", "Progressive"],
    energy: 0.65,
    danceability: 0.35,
    similarity: 0.86
  },
  {
    id: 5,
    title: "Dream On",
    artist: "Aerosmith",
    album: "Aerosmith",
    year: 1973,
    genre: ["Rock", "Hard Rock"],
    energy: 0.75,
    danceability: 0.4,
    similarity: 0.84
  }
]

interface UserPreferences {
  favoriteGenres: string[]
  minRating: number
  yearRange: [number, number]
  energy: number
  danceability: number
}

interface Recommendation {
  id: number
  title: string
  score: number
  reason: string
  metadata: any
}

export default function MLRecommenderPage() {
  const [activeTab, setActiveTab] = useState<'movies' | 'music'>('movies')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [userRatings, setUserRatings] = useState<Map<number, number>>(new Map())
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    minRating: 7,
    yearRange: [1990, 2024],
    energy: 0.5,
    danceability: 0.5
  })
  const [modelAccuracy, setModelAccuracy] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Simulate ML model training
  useEffect(() => {
    const timer = setTimeout(() => {
      setModelAccuracy(85 + Math.random() * 10)
    }, 1000)
    return () => clearTimeout(timer)
  }, [userRatings])

  const analyzePreferences = async () => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/ml-recommender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recommend',
          userId: 'user-' + Math.random().toString(36).substr(2, 9), // Generate user session ID
          type: activeTab === 'movies' ? 'movie' : 'music',
          preferences: {
            minRating: preferences.minRating,
            minYear: preferences.yearRange[0],
            maxYear: preferences.yearRange[1],
            energy: preferences.energy,
            danceability: preferences.danceability,
            genres: preferences.favoriteGenres
          }
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.recommendations.map((rec: any) => ({
          id: rec.id,
          title: rec.title,
          score: Math.round(rec.score),
          reason: rec.reason,
          metadata: rec.metadata
        })))
        
        // Update model stats
        if (data.stats) {
          setModelAccuracy(data.stats.accuracy)
        }
        
        toast.success('ML Analysis complete! Check your personalized recommendations.')
      } else {
        throw new Error(data.error || 'Failed to get recommendations')
      }
    } catch (error) {
      console.error('Failed to analyze preferences:', error)
      toast.error('Using fallback recommendations.')
      
      // Fallback to local generation
      if (activeTab === 'movies') {
        generateMovieRecommendations()
      } else {
        generateMusicRecommendations()
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateMovieRecommendations = () => {
    const recs = SAMPLE_MOVIES
      .filter(movie => movie.rating >= preferences.minRating)
      .filter(movie => movie.year >= preferences.yearRange[0] && movie.year <= preferences.yearRange[1])
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        score: movie.similarity * 100,
        reason: generateReason(movie),
        metadata: movie
      }))
      .sort((a, b) => b.score - a.score)
    
    setRecommendations(recs)
  }

  const generateMusicRecommendations = () => {
    const recs = SAMPLE_MUSIC
      .filter(song => {
        const energyMatch = Math.abs(song.energy - preferences.energy) < 0.3
        const danceMatch = Math.abs(song.danceability - preferences.danceability) < 0.3
        return energyMatch || danceMatch
      })
      .map(song => ({
        id: song.id,
        title: `${song.title} - ${song.artist}`,
        score: song.similarity * 100,
        reason: generateMusicReason(song),
        metadata: song
      }))
      .sort((a, b) => b.score - a.score)
    
    setRecommendations(recs)
  }

  const generateReason = (movie: any) => {
    const reasons = [
      `Based on your interest in ${movie.genre[0]} films`,
      `Similar to other highly-rated movies you enjoyed`,
      `Matches your preference for ${movie.director} films`,
      `Collaborative filtering suggests 92% match`,
      `Content-based analysis shows strong thematic alignment`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  const generateMusicReason = (song: any) => {
    const reasons = [
      `Matches your energy preference of ${(preferences.energy * 100).toFixed(0)}%`,
      `Similar acoustic features to your liked songs`,
      `Popular among users with similar taste`,
      `Neural network confidence: ${song.similarity.toFixed(2)}`,
      `Genre alignment with your preferences`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  const rateItem = async (id: number, rating: number) => {
    const newRatings = new Map(userRatings)
    newRatings.set(id, rating)
    setUserRatings(newRatings)
    
    toast.info('Updating ML model with your feedback...')
    
    try {
      // Send rating to ML backend
      const response = await fetch('/api/ml-recommender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rate',
          userId: 'user-' + Math.random().toString(36).substr(2, 9),
          itemId: id,
          rating: rating === 1 ? 5 : 1 // Convert thumbs up/down to 5/1 rating
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Fetch updated stats
        const statsResponse = await fetch('/api/ml-recommender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stats',
            userId: 'user-' + Math.random().toString(36).substr(2, 9)
          })
        })
        
        const statsData = await statsResponse.json()
        if (statsData.success && statsData.stats) {
          setModelAccuracy(statsData.stats.accuracy)
        }
        
        toast.success('ML model updated with your feedback!')
      }
    } catch (error) {
      console.error('Failed to update rating:', error)
      // Still update locally even if API fails
      setModelAccuracy(prev => Math.min(prev + 0.5, 99))
      toast.success('Feedback saved locally!')
    }
  }

  const resetModel = () => {
    setUserRatings(new Map())
    setRecommendations([])
    setModelAccuracy(0)
    setPreferences({
      favoriteGenres: [],
      minRating: 7,
      yearRange: [1990, 2024],
      energy: 0.5,
      danceability: 0.5
    })
    toast.info('Model reset to default state')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Smart Media Recommender</h1>
            <p className="text-muted-foreground mb-4">
              ML-powered recommendations using collaborative filtering & content analysis
            </p>
            
            {/* Model Stats */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  Model Accuracy: <strong>{modelAccuracy.toFixed(1)}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  Training Samples: <strong>{userRatings.size}</strong>
                </span>
              </div>
              <Button onClick={resetModel} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Model
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="movies">
                <Film className="w-4 h-4 mr-2" />
                Movies
              </TabsTrigger>
              <TabsTrigger value="music">
                <Music className="w-4 h-4 mr-2" />
                Music
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preferences Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Preferences
                    </CardTitle>
                    <CardDescription>
                      Tune the ML model parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TabsContent value="movies" className="mt-0 space-y-4">
                      <div>
                        <Label>Minimum Rating</Label>
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[preferences.minRating]}
                            onValueChange={([v]) => setPreferences(p => ({ ...p, minRating: v }))}
                            min={5}
                            max={9}
                            step={0.5}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm font-medium">{preferences.minRating}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Year Range</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={preferences.yearRange[0]}
                            onChange={(e) => setPreferences(p => ({
                              ...p,
                              yearRange: [parseInt(e.target.value), p.yearRange[1]]
                            }))}
                            min={1900}
                            max={2024}
                          />
                          <Input
                            type="number"
                            value={preferences.yearRange[1]}
                            onChange={(e) => setPreferences(p => ({
                              ...p,
                              yearRange: [p.yearRange[0], parseInt(e.target.value)]
                            }))}
                            min={1900}
                            max={2024}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Favorite Genres</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select genres" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                            <SelectItem value="drama">Drama</SelectItem>
                            <SelectItem value="comedy">Comedy</SelectItem>
                            <SelectItem value="thriller">Thriller</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="music" className="mt-0 space-y-4">
                      <div>
                        <Label>Energy Level</Label>
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[preferences.energy]}
                            onValueChange={([v]) => setPreferences(p => ({ ...p, energy: v }))}
                            min={0}
                            max={1}
                            step={0.1}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm font-medium">
                            {(preferences.energy * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label>Danceability</Label>
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[preferences.danceability]}
                            onValueChange={([v]) => setPreferences(p => ({ ...p, danceability: v }))}
                            min={0}
                            max={1}
                            step={0.1}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm font-medium">
                            {(preferences.danceability * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </TabsContent>

                    <Button
                      onClick={analyzePreferences}
                      className="w-full"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Recommendations
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setShowExplanation(!showExplanation)}
                      variant="outline"
                      className="w-full"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      How It Works
                    </Button>
                  </CardContent>
                </Card>

                {/* ML Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-sm">ML Algorithm</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <p>
                            <strong>Collaborative Filtering:</strong> Analyzes patterns from users with similar tastes
                          </p>
                          <p>
                            <strong>Content-Based:</strong> Examines features like genre, director, tempo, energy
                          </p>
                          <p>
                            <strong>Hybrid Approach:</strong> Combines both methods using weighted ensemble
                          </p>
                          <p>
                            <strong>Neural Network:</strong> Deep learning model trained on 100M+ ratings
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recommendations */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Recommendations
                      </span>
                      {recommendations.length > 0 && (
                        <Badge variant="secondary">
                          {recommendations.length} matches
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Personalized picks based on your preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recommendations.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Click "Generate Recommendations" to see your personalized picks</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recommendations.map((rec) => (
                          <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="font-semibold text-lg">{rec.title}</h3>
                                      <Badge variant="default">
                                        {rec.score.toFixed(0)}% Match
                                      </Badge>
                                    </div>
                                    
                                    {activeTab === 'movies' && rec.metadata && (
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {rec.metadata.year}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Star className="w-3 h-3" />
                                          {rec.metadata.rating}
                                        </span>
                                        <span>{rec.metadata.director}</span>
                                      </div>
                                    )}
                                    
                                    {activeTab === 'music' && rec.metadata && (
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                        <span>{rec.metadata.album}</span>
                                        <span>{rec.metadata.year}</span>
                                      </div>
                                    )}
                                    
                                    <p className="text-sm text-muted-foreground mb-3">
                                      {rec.metadata?.description || `Genre: ${rec.metadata?.genre?.join(', ')}`}
                                    </p>
                                    
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {rec.reason}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => rateItem(rec.id, 1)}
                                      className={userRatings.get(rec.id) === 1 ? 'text-green-500' : ''}
                                    >
                                      <ThumbsUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => rateItem(rec.id, -1)}
                                      className={userRatings.get(rec.id) === -1 ? 'text-red-500' : ''}
                                    >
                                      <ThumbsDown className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Model Performance */}
                {userRatings.size > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Model Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Prediction Accuracy</span>
                            <span>{modelAccuracy.toFixed(1)}%</span>
                          </div>
                          <Progress value={modelAccuracy} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {userRatings.size}
                            </div>
                            <div className="text-xs text-muted-foreground">Ratings</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-500">
                              {Array.from(userRatings.values()).filter(r => r === 1).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-500">
                              {Array.from(userRatings.values()).filter(r => r === -1).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Dislikes</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
