"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  Eye, 
  Droplets, 
  Wind,
  Thermometer,
  Gauge,
  MapPin,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { toast } from 'sonner'

interface WeatherData {
  location: string
  country: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
  feelsLike: number
  icon: string
  timestamp: Date
}

interface ForecastDay {
  date: string
  day: string
  high: number
  low: number
  condition: string
  icon: string
  precipitation: number
  humidity: number
  windSpeed: number
}

interface HourlyForecast {
  time: string
  temperature: number
  condition: string
  icon: string
  precipitation: number
}

// Mock weather data for demonstration
const mockWeatherData: WeatherData = {
  location: 'San Francisco',
  country: 'United States',
  temperature: 18,
  condition: 'Partly Cloudy',
  description: 'Partly cloudy with occasional sunshine',
  humidity: 65,
  windSpeed: 12,
  pressure: 1013,
  visibility: 10,
  uvIndex: 4,
  feelsLike: 20,
  icon: 'partly-cloudy',
  timestamp: new Date()
}

const mockForecast: ForecastDay[] = [
  { date: '2024-01-16', day: 'Today', high: 18, low: 12, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 10, humidity: 65, windSpeed: 12 },
  { date: '2024-01-17', day: 'Tomorrow', high: 22, low: 15, condition: 'Sunny', icon: 'sunny', precipitation: 0, humidity: 55, windSpeed: 8 },
  { date: '2024-01-18', day: 'Wednesday', high: 19, low: 13, condition: 'Rainy', icon: 'rainy', precipitation: 80, humidity: 75, windSpeed: 15 },
  { date: '2024-01-19', day: 'Thursday', high: 16, low: 10, condition: 'Cloudy', icon: 'cloudy', precipitation: 20, humidity: 70, windSpeed: 10 },
  { date: '2024-01-20', day: 'Friday', high: 20, low: 14, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 5, humidity: 60, windSpeed: 9 },
  { date: '2024-01-21', day: 'Saturday', high: 24, low: 17, condition: 'Sunny', icon: 'sunny', precipitation: 0, humidity: 50, windSpeed: 7 },
  { date: '2024-01-22', day: 'Sunday', high: 21, low: 16, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 15, humidity: 58, windSpeed: 11 }
]

const mockHourlyForecast: HourlyForecast[] = [
  { time: '12:00', temperature: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 10 },
  { time: '13:00', temperature: 19, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 5 },
  { time: '14:00', temperature: 20, condition: 'Sunny', icon: 'sunny', precipitation: 0 },
  { time: '15:00', temperature: 21, condition: 'Sunny', icon: 'sunny', precipitation: 0 },
  { time: '16:00', temperature: 20, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 5 },
  { time: '17:00', temperature: 19, condition: 'Cloudy', icon: 'cloudy', precipitation: 15 },
  { time: '18:00', temperature: 18, condition: 'Cloudy', icon: 'cloudy', precipitation: 20 },
  { time: '19:00', temperature: 17, condition: 'Rainy', icon: 'rainy', precipitation: 60 }
]

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData)
  const [forecast, setForecast] = useState<ForecastDay[]>(mockForecast)
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>(mockHourlyForecast)
  const [searchLocation, setSearchLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius')

  const getWeatherIcon = (condition: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-12 h-12'
    }
    
    const iconClass = sizeClasses[size]
    
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-500`} />
      case 'partly-cloudy':
        return <Cloud className={`${iconClass} text-gray-400`} />
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-500`} />
      case 'snowy':
        return <CloudSnow className={`${iconClass} text-blue-200`} />
      case 'stormy':
        return <Zap className={`${iconClass} text-purple-500`} />
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />
    }
  }

  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32)
    }
    return Math.round(temp)
  }

  const getTemperatureUnit = () => unit === 'celsius' ? '°C' : '°F'

  const searchWeather = async () => {
    if (!searchLocation.trim()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would fetch from a weather API
      const newWeatherData: WeatherData = {
        ...mockWeatherData,
        location: searchLocation,
        temperature: Math.round(Math.random() * 30 + 5),
        timestamp: new Date()
      }
      
      setWeatherData(newWeatherData)
      toast.success(`Weather updated for ${searchLocation}`)
      setSearchLocation('')
    } catch (error) {
      toast.error('Failed to fetch weather data')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshWeather = async () => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWeatherData(prev => ({
        ...prev,
        temperature: Math.round(Math.random() * 30 + 5),
        timestamp: new Date()
      }))
      toast.success('Weather data refreshed')
    } catch (error) {
      toast.error('Failed to refresh weather data')
    } finally {
      setIsLoading(false)
    }
  }

  const getUVIndexColor = (index: number) => {
    if (index <= 2) return 'text-green-500'
    if (index <= 5) return 'text-yellow-500'
    if (index <= 7) return 'text-orange-500'
    if (index <= 10) return 'text-red-500'
    return 'text-purple-500'
  }

  const getUVIndexLevel = (index: number) => {
    if (index <= 2) return 'Low'
    if (index <= 5) return 'Moderate'
    if (index <= 7) return 'High'
    if (index <= 10) return 'Very High'
    return 'Extreme'
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <Cloud className="w-4 h-4 mr-2" />
            Weather Dashboard
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Weather{' '}
            <span className="text-gradient">Forecast</span>
          </h1>
          <p className="text-muted-foreground">
            Beautiful weather dashboard with detailed forecasts and insights
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1 w-full sm:w-auto">
                  <Input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search for a city..."
                    onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
                    className="flex-1"
                  />
                  <Button onClick={searchWeather} disabled={isLoading}>
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={refreshWeather} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={unit === 'celsius' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUnit('celsius')}
                  >
                    °C
                  </Button>
                  <Button
                    variant={unit === 'fahrenheit' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUnit('fahrenheit')}
                  >
                    °F
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Weather Info */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">
                      {weatherData.location}, {weatherData.country}
                    </h2>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-6 mb-4">
                    {getWeatherIcon(weatherData.icon, 'lg')}
                    <div>
                      <div className="text-6xl font-bold">
                        {convertTemperature(weatherData.temperature)}{getTemperatureUnit()}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        Feels like {convertTemperature(weatherData.feelsLike)}{getTemperatureUnit()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xl font-medium">{weatherData.condition}</div>
                    <div className="text-muted-foreground">{weatherData.description}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Last updated: {weatherData.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Wind Speed</span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData.windSpeed} km/h</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Pressure</span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData.pressure} hPa</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Visibility</span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData.visibility} km</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">UV Index</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-2xl font-bold ${getUVIndexColor(weatherData.uvIndex)}`}>
                        {weatherData.uvIndex}
                      </div>
                      <Badge variant="outline" className={getUVIndexColor(weatherData.uvIndex)}>
                        {getUVIndexLevel(weatherData.uvIndex)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forecast Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass">
            <Tabs defaultValue="hourly" className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Weather Forecast</CardTitle>
                  <TabsList>
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="daily">7-Day</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>

              <CardContent>
                <TabsContent value="hourly" className="mt-0">
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                      {hourlyForecast.map((hour, index) => (
                        <div key={index} className="text-center p-4 bg-muted/30 rounded-lg min-w-[120px]">
                          <div className="text-sm font-medium mb-2">{hour.time}</div>
                          <div className="flex justify-center mb-2">
                            {getWeatherIcon(hour.icon, 'md')}
                          </div>
                          <div className="text-lg font-bold mb-1">
                            {convertTemperature(hour.temperature)}{getTemperatureUnit()}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {hour.condition}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-blue-500">
                            <Droplets className="w-3 h-3" />
                            {hour.precipitation}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="daily" className="mt-0">
                  <div className="space-y-3">
                    {forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-sm font-medium">{day.day}</div>
                          {getWeatherIcon(day.icon, 'md')}
                          <div>
                            <div className="font-medium">{day.condition}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Droplets className="w-3 h-3" />
                                {day.precipitation}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="w-3 h-3" />
                                {day.windSpeed} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-right">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span className="font-bold">
                              {convertTemperature(day.high)}{getTemperatureUnit()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-blue-500" />
                            <span className="text-muted-foreground">
                              {convertTemperature(day.low)}{getTemperatureUnit()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
