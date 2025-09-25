import { Metadata } from 'next'
import { WeatherApp } from '@/components/apps/weather/WeatherApp'

export const metadata: Metadata = {
  title: 'Weather Dashboard',
  description: 'Beautiful weather app with forecasts, charts, and location-based weather data.',
}

export default function WeatherPage() {
  return <WeatherApp />
}
