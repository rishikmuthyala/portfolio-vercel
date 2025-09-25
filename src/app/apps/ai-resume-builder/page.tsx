'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  FileText, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronRight,
  Target,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Loader2
} from 'lucide-react'

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    location: string
    graduationDate: string
    gpa: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    link: string
  }>
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  projects: []
}

export default function AIResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [activeTab, setActiveTab] = useState('personal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [atsScore, setAtsScore] = useState(0)
  const [targetRole, setTargetRole] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const generateAISuggestions = async (section: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/resume-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          data: resumeData,
          targetRole
        })
      })

      if (!response.ok) throw new Error('Failed to generate suggestions')
      
      const result = await response.json()
      setSuggestions(result.suggestions || [])
      toast.success('AI suggestions generated!')
    } catch (error) {
      // Fallback suggestions for demo
      const demoSuggestions = {
        summary: [
          "Highlight your years of experience and key technologies",
          "Mention your most impactful achievement with metrics",
          "Include your career objective aligned with the target role"
        ],
        experience: [
          "Start bullet points with strong action verbs",
          "Include quantifiable metrics (improved X by Y%)",
          "Focus on impact and results, not just responsibilities"
        ],
        skills: [
          "Add skills mentioned in the job description",
          "Group skills by category for better readability",
          "Include both technical and soft skills"
        ]
      }
      setSuggestions(demoSuggestions[section as keyof typeof demoSuggestions] || [])
      toast.info('Using demo suggestions (API key not configured)')
    } finally {
      setIsGenerating(false)
    }
  }

  const calculateATSScore = () => {
    let score = 0
    const maxScore = 100

    // Check personal info completeness (20 points)
    const personalFields = Object.values(resumeData.personalInfo).filter(v => v).length
    score += (personalFields / 8) * 20

    // Check experience (25 points)
    if (resumeData.experience.length > 0) score += 10
    if (resumeData.experience.some(exp => exp.achievements.length > 2)) score += 15

    // Check education (15 points)
    if (resumeData.education.length > 0) score += 15

    // Check skills (20 points)
    const totalSkills = resumeData.skills.technical.length + 
                       resumeData.skills.soft.length + 
                       resumeData.skills.languages.length
    score += Math.min(totalSkills * 2, 20)

    // Check projects (10 points)
    if (resumeData.projects.length > 0) score += 10

    // Check summary (10 points)
    if (resumeData.personalInfo.summary.length > 50) score += 10

    setAtsScore(Math.round(score))
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    }
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }))
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
  }

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    }
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const exportResume = (format: 'pdf' | 'json' | 'txt') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(resumeData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = 'resume.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      toast.success('Resume exported as JSON!')
    } else {
      toast.info(`${format.toUpperCase()} export coming soon!`)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-8"
        >
          {/* Centered Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
            <p className="text-muted-foreground">
              Create ATS-optimized resumes with AI-powered suggestions
            </p>
          </div>
          
          {/* Export Buttons - Centered */}
          <div className="flex justify-center gap-2 mb-4">
            <Button onClick={() => exportResume('pdf')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => exportResume('json')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>

          {/* ATS Score Card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">ATS Compatibility Score</CardTitle>
                <Badge variant={atsScore > 80 ? 'default' : atsScore > 60 ? 'secondary' : 'destructive'}>
                  {atsScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={atsScore} className="mb-2" />
              <div className="flex items-center gap-4 text-sm">
                <Input
                  placeholder="Target role (e.g., Software Engineer)"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={calculateATSScore} size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Calculate Score
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 w-full">
                      <TabsTrigger value="personal">
                        <User className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="experience">
                        <Briefcase className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="education">
                        <GraduationCap className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="skills">
                        <Award className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="projects">
                        <FileText className="w-4 h-4" />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                            }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value }
                            }))}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value }
                            }))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={resumeData.personalInfo.location}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, location: e.target.value }
                            }))}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Professional Summary</Label>
                        <Textarea
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, summary: e.target.value }
                          }))}
                          placeholder="Experienced software engineer with..."
                          rows={4}
                        />
                        <Button
                          onClick={() => generateAISuggestions('summary')}
                          className="mt-2"
                          variant="outline"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          Generate AI Summary
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Work Experience</h3>
                        <Button onClick={addExperience} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                      {resumeData.experience.map((exp, index) => (
                        <Card key={exp.id} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].company = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                            />
                            <Input
                              placeholder="Position"
                              value={exp.position}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].position = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                            />
                            <Input
                              placeholder="Start Date"
                              value={exp.startDate}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].startDate = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                            />
                            <Input
                              placeholder="End Date"
                              value={exp.endDate}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].endDate = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                            />
                          </div>
                          <Textarea
                            placeholder="Description and achievements..."
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience]
                              newExp[index].description = e.target.value
                              setResumeData(prev => ({ ...prev, experience: newExp }))
                            }}
                            className="mt-4"
                            rows={3}
                          />
                          <Button
                            onClick={() => {
                              const newExp = resumeData.experience.filter((_, i) => i !== index)
                              setResumeData(prev => ({ ...prev, experience: newExp }))
                            }}
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Education</h3>
                        <Button onClick={addEducation} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                      {resumeData.education.map((edu, index) => (
                        <Card key={edu.id} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].institution = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                            />
                            <Input
                              placeholder="Degree"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].degree = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                            />
                            <Input
                              placeholder="Field of Study"
                              value={edu.field}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].field = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                            />
                            <Input
                              placeholder="Graduation Date"
                              value={edu.graduationDate}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].graduationDate = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const newEdu = resumeData.education.filter((_, i) => i !== index)
                              setResumeData(prev => ({ ...prev, education: newEdu }))
                            }}
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Technical Skills</Label>
                          <Textarea
                            placeholder="Python, JavaScript, React, Node.js..."
                            value={resumeData.skills.technical.join(', ')}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, technical: e.target.value.split(', ').filter(s => s) }
                            }))}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Soft Skills</Label>
                          <Textarea
                            placeholder="Leadership, Communication, Problem-solving..."
                            value={resumeData.skills.soft.join(', ')}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, soft: e.target.value.split(', ').filter(s => s) }
                            }))}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Languages</Label>
                          <Textarea
                            placeholder="English (Native), Spanish (Fluent)..."
                            value={resumeData.skills.languages.join(', ')}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, languages: e.target.value.split(', ').filter(s => s) }
                            }))}
                            rows={2}
                          />
                        </div>
                        <Button
                          onClick={() => generateAISuggestions('skills')}
                          variant="outline"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          Suggest Skills for Target Role
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Projects</h3>
                        <Button onClick={addProject} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                      {resumeData.projects.map((project, index) => (
                        <Card key={project.id} className="p-4">
                          <div className="space-y-3">
                            <Input
                              placeholder="Project Name"
                              value={project.name}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].name = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                            />
                            <Textarea
                              placeholder="Project description..."
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].description = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              rows={2}
                            />
                            <Input
                              placeholder="Technologies (comma-separated)"
                              value={project.technologies.join(', ')}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].technologies = e.target.value.split(', ').filter(s => s)
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                            />
                            <Input
                              placeholder="Project Link"
                              value={project.link}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].link = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const newProjects = resumeData.projects.filter((_, i) => i !== index)
                              setResumeData(prev => ({ ...prev, projects: newProjects }))
                            }}
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* AI Suggestions Panel */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    Powered by GPT-4 for optimal results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex gap-2">
                          <ChevronRight className="w-4 h-4 text-primary mt-0.5" />
                          <p className="text-sm text-muted-foreground">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click "Generate AI Suggestions" in any section to get personalized recommendations
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Resume Templates */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>
                    Choose from professional templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Modern</Button>
                    <Button variant="outline" size="sm">Classic</Button>
                    <Button variant="outline" size="sm">Creative</Button>
                    <Button variant="outline" size="sm">Executive</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
