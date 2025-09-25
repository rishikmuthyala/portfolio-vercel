import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/blog/BlogPost'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return [
    { slug: 'building-scalable-nextjs-apps-2024' },
    { slug: 'cybersecurity-ai-implementation-guide' },
  ]
}

// Blog post data with realistic content
const getBlogPost = async (slug: string) => {
  const posts = {
    'building-scalable-nextjs-apps-2024': {
      title: 'Building Scalable Next.js Applications in 2024',
      excerpt: 'A deep dive into modern Next.js architecture patterns, performance optimizations, and best practices for building production-ready applications that scale.',
      publishedAt: '2024-09-20',
      readTime: 12,
      tags: ['Next.js', 'React', 'Architecture', 'Performance'],
      author: 'Rishik Muthyala',
      content: `
# Building Scalable Next.js Applications in 2024

As web applications grow in complexity and user base, building scalable Next.js applications becomes crucial for long-term success. In this comprehensive guide, we'll explore the architecture patterns, optimization techniques, and best practices that I've learned from building production applications serving thousands of users.

## The Foundation: Project Structure

A well-organized project structure is the backbone of any scalable application. Here's the architecture I recommend for large Next.js projects:

\`\`\`
src/
├── app/                 # App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── store/              # State management
├── types/              # TypeScript definitions
└── utils/              # Helper functions
\`\`\`

## Performance Optimization Strategies

### 1. Code Splitting and Lazy Loading

Implement strategic code splitting to reduce initial bundle size:

\`\`\`typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Disable SSR for client-only components
})
\`\`\`

### 2. Image Optimization

Leverage Next.js Image component with proper sizing:

\`\`\`typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Description"
      width={800}
      height={600}
      priority // For above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
\`\`\`

### 3. Database Query Optimization

Use efficient data fetching patterns:

\`\`\`typescript
// Good: Fetch only needed data
async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      // Don't select unnecessary fields
    }
  })
}
\`\`\`

## State Management at Scale

For complex applications, implement a robust state management solution:

\`\`\`typescript
// Using Zustand for lightweight state management
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  setUser: (user: User) => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    user: null,
    theme: 'light',
    setUser: (user) => set({ user }),
    toggleTheme: () => set((state) => ({ 
      theme: state.theme === 'light' ? 'dark' : 'light' 
    }))
  }))
)
\`\`\`

## Caching Strategies

Implement multi-layer caching for optimal performance:

### 1. Next.js Built-in Caching

\`\`\`typescript
// Static generation with revalidation
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const revalidate = 3600 // Revalidate every hour
\`\`\`

### 2. Redis for Session and Data Caching

\`\`\`typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`)
  if (cached) return JSON.parse(cached)
  
  const user = await fetchUser(id)
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user))
  return user
}
\`\`\`

## Error Handling and Monitoring

Implement comprehensive error handling:

\`\`\`typescript
// Global error boundary
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
\`\`\`

## Testing Strategy

Implement a comprehensive testing strategy:

\`\`\`typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react'
import { UserProfile } from './UserProfile'

test('renders user profile correctly', () => {
  const user = { name: 'John Doe', email: 'john@example.com' }
  render(<UserProfile user={user} />)
  
  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('john@example.com')).toBeInTheDocument()
})
\`\`\`

## Deployment and CI/CD

Set up automated deployment with proper environment management:

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
\`\`\`

## Monitoring and Analytics

Implement proper monitoring for production applications:

\`\`\`typescript
// Custom analytics hook
export function useAnalytics() {
  const trackEvent = (event: string, properties?: object) => {
    if (typeof window !== 'undefined') {
      // Send to analytics service
      gtag('event', event, properties)
    }
  }

  return { trackEvent }
}
\`\`\`

## Conclusion

Building scalable Next.js applications requires careful planning, proper architecture, and continuous optimization. The patterns and practices outlined in this guide have helped me build applications that handle significant traffic while maintaining excellent performance.

Key takeaways:
- Start with a solid project structure
- Implement performance optimizations early
- Use appropriate caching strategies
- Monitor and measure everything
- Test thoroughly at all levels

Remember, scalability is not just about handling more users—it's about building maintainable, performant applications that can evolve with your business needs.
      `
    },
    'cybersecurity-ai-implementation-guide': {
      title: 'Cybersecurity and AI Implementation: A Developer\'s Guide',
      excerpt: 'Exploring how AI is revolutionizing cybersecurity practices, from threat detection to automated response systems, and how developers can implement these solutions.',
      publishedAt: '2024-09-15',
      readTime: 15,
      tags: ['Cybersecurity', 'AI', 'Machine Learning', 'Security'],
      author: 'Rishik Muthyala',
      content: `
# Cybersecurity and AI Implementation: A Developer's Guide

The intersection of artificial intelligence and cybersecurity represents one of the most critical technological frontiers of our time. As cyber threats become increasingly sophisticated, AI-powered security solutions are becoming essential for protecting modern applications and infrastructure.

## The Current Threat Landscape

Cybersecurity threats have evolved dramatically in recent years. Traditional signature-based detection systems are no longer sufficient against:

- **Advanced Persistent Threats (APTs)** - Long-term, stealthy attacks
- **Zero-day exploits** - Previously unknown vulnerabilities  
- **AI-powered attacks** - Threats that use machine learning to evade detection
- **Social engineering at scale** - Automated phishing and manipulation

## How AI Transforms Cybersecurity

### 1. Threat Detection and Analysis

AI excels at pattern recognition, making it ideal for identifying anomalies:

\`\`\`python
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, normal_traffic_data):
        """Train on normal network traffic patterns"""
        scaled_data = self.scaler.fit_transform(normal_traffic_data)
        self.model.fit(scaled_data)
        self.is_trained = True
    
    def detect_anomaly(self, traffic_sample):
        """Detect if traffic sample is anomalous"""
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        scaled_sample = self.scaler.transform([traffic_sample])
        prediction = self.model.predict(scaled_sample)
        return prediction[0] == -1  # -1 indicates anomaly
\`\`\`

### 2. Automated Incident Response

AI can automate initial response to security incidents:

\`\`\`typescript
interface SecurityEvent {
  id: string
  type: 'malware' | 'intrusion' | 'data_breach' | 'ddos'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  sourceIp: string
  affectedSystems: string[]
}

class AutomatedResponseSystem {
  private responsePlaybooks: Map<string, ResponseAction[]>
  
  constructor() {
    this.responsePlaybooks = new Map([
      ['malware_critical', [
        { action: 'isolate_system', priority: 1 },
        { action: 'notify_security_team', priority: 2 },
        { action: 'backup_affected_data', priority: 3 }
      ]],
      ['intrusion_high', [
        { action: 'block_source_ip', priority: 1 },
        { action: 'enable_enhanced_monitoring', priority: 2 },
        { action: 'generate_incident_report', priority: 3 }
      ]]
    ])
  }
  
  async handleSecurityEvent(event: SecurityEvent) {
    const playbookKey = \`\${event.type}_\${event.severity}\`
    const actions = this.responsePlaybooks.get(playbookKey)
    
    if (actions) {
      for (const action of actions.sort((a, b) => a.priority - b.priority)) {
        await this.executeAction(action, event)
      }
    }
  }
  
  private async executeAction(action: ResponseAction, event: SecurityEvent) {
    switch (action.action) {
      case 'isolate_system':
        await this.isolateAffectedSystems(event.affectedSystems)
        break
      case 'block_source_ip':
        await this.blockIpAddress(event.sourceIp)
        break
      // Additional actions...
    }
  }
}
\`\`\`

## Implementing AI-Powered Security Features

### 1. Real-time Threat Monitoring

Build a monitoring system that uses machine learning for threat detection:

\`\`\`javascript
// Real-time log analysis with TensorFlow.js
import * as tf from '@tensorflow/tfjs-node'

class LogAnalyzer {
  constructor() {
    this.model = null
    this.loadModel()
  }
  
  async loadModel() {
    // Load pre-trained model for log analysis
    this.model = await tf.loadLayersModel('file://./models/log-analyzer/model.json')
  }
  
  async analyzeLogs(logEntries) {
    if (!this.model) await this.loadModel()
    
    const processedLogs = this.preprocessLogs(logEntries)
    const predictions = this.model.predict(processedLogs)
    
    return predictions.dataSync().map((score, index) => ({
      logEntry: logEntries[index],
      threatScore: score,
      isThreat: score > 0.7
    }))
  }
  
  preprocessLogs(logs) {
    // Convert logs to numerical features
    return tf.tensor2d(logs.map(log => [
      log.responseTime,
      log.statusCode,
      log.requestSize,
      this.extractFeatures(log.userAgent),
      // Additional features...
    ]))
  }
}
\`\`\`

### 2. Behavioral Analysis for User Authentication

Implement continuous authentication based on user behavior:

\`\`\`python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

class BehavioralAuthenticator:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.user_profiles = {}
    
    def create_user_profile(self, user_id, behavior_data):
        """Create behavioral profile for a user"""
        features = self.extract_behavioral_features(behavior_data)
        self.user_profiles[user_id] = {
            'typing_speed': np.mean(features['typing_intervals']),
            'mouse_movement_pattern': features['mouse_velocity_variance'],
            'login_times': features['typical_login_hours'],
            'device_fingerprint': features['device_characteristics']
        }
    
    def authenticate_user(self, user_id, current_behavior):
        """Verify user identity based on current behavior"""
        if user_id not in self.user_profiles:
            return False, 0.0
        
        profile = self.user_profiles[user_id]
        current_features = self.extract_behavioral_features([current_behavior])
        
        # Calculate similarity score
        similarity_score = self.calculate_similarity(profile, current_features)
        
        # Threshold for authentication (adjustable based on security requirements)
        is_authentic = similarity_score > 0.85
        
        return is_authentic, similarity_score
    
    def extract_behavioral_features(self, behavior_data):
        # Extract relevant behavioral patterns
        return {
            'typing_intervals': [b.get('typing_speed', 0) for b in behavior_data],
            'mouse_velocity_variance': np.var([b.get('mouse_speed', 0) for b in behavior_data]),
            'typical_login_hours': [b.get('login_hour', 0) for b in behavior_data],
            'device_characteristics': behavior_data[0].get('device_info', {})
        }
\`\`\`

## Security Considerations for AI Systems

### 1. Adversarial Attacks

AI systems themselves can be targets of attacks:

\`\`\`typescript
// Implement input validation for AI endpoints
export class AISecurityMiddleware {
  static validateInput(input: any, schema: any): boolean {
    // Validate input against expected schema
    if (!this.schemaValidator(input, schema)) {
      throw new Error('Invalid input format')
    }
    
    // Check for adversarial patterns
    if (this.detectAdversarialInput(input)) {
      throw new Error('Potentially malicious input detected')
    }
    
    return true
  }
  
  private static detectAdversarialInput(input: any): boolean {
    // Implement checks for common adversarial patterns
    const suspiciousPatterns = [
      /[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/g, // Control characters
      /(?:javascript|vbscript|onload|onerror):/gi, // Script injection
      /(?:union|select|insert|update|delete|drop)\\s/gi // SQL injection
    ]
    
    const inputString = JSON.stringify(input)
    return suspiciousPatterns.some(pattern => pattern.test(inputString))
  }
}
\`\`\`

### 2. Data Privacy and Compliance

Ensure AI security systems comply with privacy regulations:

\`\`\`typescript
interface PrivacyConfig {
  dataRetentionDays: number
  anonymizationEnabled: boolean
  consentRequired: boolean
  auditLogging: boolean
}

class PrivacyCompliantSecuritySystem {
  constructor(private config: PrivacyConfig) {}
  
  async processSecurityData(data: SecurityData, userConsent?: boolean) {
    // Check consent requirements
    if (this.config.consentRequired && !userConsent) {
      throw new Error('User consent required for security data processing')
    }
    
    // Anonymize sensitive data
    const processedData = this.config.anonymizationEnabled 
      ? this.anonymizeData(data)
      : data
    
    // Set data retention
    await this.scheduleDataDeletion(processedData.id, this.config.dataRetentionDays)
    
    // Log for audit trail
    if (this.config.auditLogging) {
      await this.logSecurityDataProcessing(processedData.id, 'processed')
    }
    
    return processedData
  }
  
  private anonymizeData(data: SecurityData): SecurityData {
    return {
      ...data,
      userIp: this.hashSensitiveData(data.userIp),
      userId: this.hashSensitiveData(data.userId),
      // Remove or hash other PII
    }
  }
}
\`\`\`

## Practical Implementation Steps

### 1. Start Small with Proof of Concepts

Begin with focused use cases:

1. **Log Analysis**: Implement anomaly detection for application logs
2. **Authentication Enhancement**: Add behavioral analysis to login processes  
3. **API Security**: Deploy rate limiting with ML-based pattern detection

### 2. Build Monitoring and Alerting

\`\`\`typescript
// Security monitoring dashboard
export class SecurityMonitoringService {
  private metrics: SecurityMetrics = {
    threatsDetected: 0,
    falsePositives: 0,
    responseTime: 0,
    systemHealth: 'healthy'
  }
  
  async getSecurityDashboard(): Promise<SecurityDashboard> {
    const recentThreats = await this.getRecentThreats(24) // Last 24 hours
    const systemStatus = await this.checkSystemHealth()
    
    return {
      metrics: this.metrics,
      recentThreats,
      systemStatus,
      recommendations: this.generateRecommendations()
    }
  }
  
  private generateRecommendations(): string[] {
    const recommendations = []
    
    if (this.metrics.falsePositives > 10) {
      recommendations.push('Consider tuning ML model sensitivity')
    }
    
    if (this.metrics.responseTime > 1000) {
      recommendations.push('Optimize threat detection pipeline')
    }
    
    return recommendations
  }
}
\`\`\`

## Future Trends and Considerations

### 1. Quantum Computing Impact

Prepare for the quantum computing era:
- Implement quantum-resistant cryptography
- Plan for algorithm updates
- Monitor quantum computing developments

### 2. Edge AI Security

Deploy AI security at the edge:
- Reduce latency for real-time threats
- Minimize data transmission
- Implement federated learning approaches

## Conclusion

AI-powered cybersecurity represents a paradigm shift in how we protect digital assets. By implementing the patterns and practices outlined in this guide, developers can build more resilient, intelligent security systems.

Key implementation principles:
- Start with clear use cases and measurable goals
- Implement proper privacy and compliance measures
- Continuously monitor and improve AI models
- Maintain human oversight and intervention capabilities
- Plan for evolving threat landscapes

The future of cybersecurity lies in the intelligent combination of human expertise and AI capabilities. As developers, we have the opportunity—and responsibility—to build systems that can adapt and respond to emerging threats in real-time.

Remember: AI is a powerful tool, but it's not a silver bullet. The most effective security strategies combine AI capabilities with traditional security practices and human expertise.
      `
    }
  }

  return posts[slug as keyof typeof posts] || null
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return <BlogPost post={{ ...post, slug }} />
}
