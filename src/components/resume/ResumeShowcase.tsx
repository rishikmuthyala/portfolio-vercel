"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin,
  Calendar,
  GraduationCap,
  Briefcase,
  Code,
  Star,
  ExternalLink
} from 'lucide-react'
import { SITE_CONFIG, TECH_STACK, EXPERIENCE, PROJECTS } from '@/lib/constants'

const personalInfo = {
  name: "Rishik Muthyala",
  title: "CS & Math Student | Software Engineering Intern",
  location: "Boston, MA",
  email: "rishikmuthyala5@gmail.com",
  phone: "(508) 244-2102",
  website: "https://rishikmuthyala.xyz",
  summary: "CS & Math Student at UMass Amherst. Software Engineering Intern with experience at MITRE, Treevah, SellServe, and Columbia."
}

// Using EXPERIENCE from constants instead of local experiences
const experiences = EXPERIENCE

// Helper function to get company logo
const getCompanyLogo = (company: string): string => {
  const logoMap: { [key: string]: string } = {
    'MITRE Corporation': '/mitre-logo.png',
    'Treevah': '/treevah-logo.png',
    'SellServe': '/sellserve-logo.png',
    'Columbia University': '/columbia-logo.png'
  }
  return logoMap[company] || '/globe.svg'
}

const education = [
  {
    institution: "University of Massachusetts Amherst",
    degree: "Honors Bachelor of Science in Computer Science & Mathematics",
    minor: "Minor in Business",
    duration: "Sep 2023 - May 2027",
    location: "Amherst, Massachusetts",
    gpa: "3.6/4.0",
    honors: ["Honors Program"],
    coursework: ["Data Structures", "Algorithms", "Machine Learning", "Database Systems", "Software Engineering", "Linear Algebra", "Calculus", "Statistics", "Business Analytics"]
  }
]


// Using PROJECTS from constants
const projects = PROJECTS.map(project => ({
  name: project.name,
  description: project.description,
  technologies: project.technologies,
  link: project.link || `https://github.com/rishikmuthyala/${project.name.toLowerCase().replace(/\s+/g, '-')}`,
  highlights: project.achievements
}))

const skills = {
  "Programming Languages": [
    { name: "Python", level: 95, years: 3 },
    { name: "JavaScript/TypeScript", level: 90, years: 2 },
    { name: "Java", level: 85, years: 2 },
    { name: "C++", level: 82, years: 2 },
    { name: "Swift", level: 80, years: 1 }
  ],
  "Frontend Development": [
    { name: "React/Next.js", level: 92, years: 2 },
    { name: "SwiftUI", level: 85, years: 1 },
    { name: "HTML/CSS", level: 88, years: 3 },
    { name: "React Native", level: 80, years: 1 }
  ],
  "Backend & Cloud": [
    { name: "Node.js/Express", level: 88, years: 2 },
    { name: "AWS/Azure/GCP", level: 82, years: 2 },
    { name: "PostgreSQL/MongoDB", level: 85, years: 2 },
    { name: "Docker", level: 80, years: 1 },
    { name: "REST APIs", level: 90, years: 2 }
  ],
  "AI/ML & Data": [
    { name: "TensorFlow/PyTorch", level: 85, years: 2 },
    { name: "XGBoost/LightGBM", level: 88, years: 1 },
    { name: "OpenAI APIs", level: 90, years: 1 },
    { name: "Pandas/NumPy", level: 85, years: 2 },
    { name: "Data Analysis", level: 82, years: 2 }
  ]
}

export function ResumeShowcase() {
  const [activeTab, setActiveTab] = useState("overview")

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Rishik_Muthyala_Resume.pdf'
    link.click()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Resume</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional experience, skills, and achievements in software engineering and technology.
          </p>
          <Button onClick={downloadResume} size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Resume
          </Button>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Custom Underline Tabs */}
          <div className="w-full border-b border-border/20">
            <div className="flex justify-center">
              <div className="flex space-x-8 lg:space-x-12">
                {[
                  { value: 'overview', label: 'Overview' },
                  { value: 'experience', label: 'Experience' },
                  { value: 'projects', label: 'Projects' },
                  { value: 'skills', label: 'Skills' },
                  { value: 'education', label: 'Education' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`relative py-4 px-2 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.value
                        ? 'text-red-500'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.value && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Personal Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Info Card */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="glass h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{personalInfo.name}</CardTitle>
                        <CardDescription className="text-lg text-primary font-medium">
                          {personalInfo.title}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer" title="GitHub Profile">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {personalInfo.summary}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {personalInfo.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {personalInfo.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {personalInfo.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        {personalInfo.website}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants}>
                <Card className="glass h-full">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">3.6</div>
                      <div className="text-sm text-muted-foreground">GPA at UMass</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">4+</div>
                      <div className="text-sm text-muted-foreground">Major Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">4</div>
                      <div className="text-sm text-muted-foreground">Internships</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">95%</div>
                      <div className="text-sm text-muted-foreground">AI Model Accuracy</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Tech Stack Overview */}
            <motion.div variants={itemVariants}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>
                    Technologies I work with regularly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Experience Content */}
              <div className="lg:col-span-3">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {experiences.map((exp, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="glass hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                            {/* Company Logo - Large and Prominent */}
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                              <div className="w-32 h-32 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-3 hover:bg-white/10 transition-all duration-300">
                                <img 
                                  src={getCompanyLogo(exp.company)} 
                                  alt={`${exp.company} logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                            
                            {/* Experience Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-1">{exp.position}</CardTitle>
                                  <CardDescription className="text-lg font-medium text-primary mb-3">
                                    {exp.company}
                                  </CardDescription>
                                  
                                  {/* Meta Information */}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {exp.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {exp.location}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {exp.type}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {/* Condensed Description */}
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                          
                          {/* Key Achievements - More Visual */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              Impact & Results
                            </h4>
                            <div className="grid gap-2">
                              {exp.achievements.slice(0, 3).map((achievement, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span className="text-muted-foreground">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Technologies - Compact */}
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Code className="w-4 h-4 text-blue-500" />
                              Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.technologies.slice(0, 6).map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs px-2 py-1">
                                  {tech}
                                </Badge>
                              ))}
                              {exp.technologies.length > 6 && (
                                <Badge variant="outline" className="text-xs px-2 py-1">
                                  +{exp.technologies.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Timeline Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-8"
                >
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        Career Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-red-400 to-red-300"></div>
                        
                        {/* Timeline Items */}
                        <div className="space-y-8">
                          {experiences.map((exp, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="relative flex items-start gap-4"
                            >
                              {/* Timeline Dot */}
                              <div className="relative z-10 flex-shrink-0">
                                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-background shadow-lg"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-red-500/20 rounded-full animate-ping"></div>
                              </div>
                              
                              {/* Timeline Content */}
                              <div className="flex-1 min-w-0 pb-4">
                                <div className="text-sm font-medium text-foreground mb-1">
                                  {exp.company}
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  {exp.position}
                                </div>
                                <div className="text-xs text-red-500 font-medium">
                                  {exp.duration}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Timeline End */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 }}
                          className="relative flex items-center gap-4 mt-8"
                        >
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-background shadow-lg flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground italic">
                            Journey continues...
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {Object.entries(skills).map(([category, categorySkills]) => (
                <motion.div key={category} variants={itemVariants}>
                  <Card className="glass h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {skill.years} years
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground">{skill.level}%</span>
                              {skill.level >= 90 && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            </div>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-8">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {projects.map((project, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="glass group hover:shadow-xl transition-all duration-500 border-l-4 border-l-primary/50 hover:border-l-primary">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {project.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs font-medium">
                              {PROJECTS.find(p => p.name === project.name)?.date}
                            </Badge>
                          </div>
                          <CardDescription className="text-base leading-relaxed">
                            {project.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="group/btn">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                              View Project
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Key Achievements */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h4 className="font-semibold text-sm">Key Achievements</h4>
                          </div>
                          <div className="space-y-2">
                            {project.highlights.map((highlight, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-muted-foreground leading-relaxed">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Technologies */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <h4 className="font-semibold text-sm">Tech Stack</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <motion.div
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: techIndex * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs hover:bg-primary/10 transition-colors cursor-default"
                                >
                                  {tech}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Project Impact/Stats */}
                      <div className="mt-6 pt-4 border-t border-border/50">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                          {index === 0 && ( // AI Phishing Detection
                            <>
                              <div>
                                <div className="text-lg font-bold text-primary">95%</div>
                                <div className="text-xs text-muted-foreground">Accuracy</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">0.07</div>
                                <div className="text-xs text-muted-foreground">Log-loss Score</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">Kaggle</div>
                                <div className="text-xs text-muted-foreground">Competition</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">ML</div>
                                <div className="text-xs text-muted-foreground">Ensemble</div>
                              </div>
                            </>
                          )}
                          {index === 1 && ( // FoundU
                            <>
                              <div>
                                <div className="text-lg font-bold text-primary">36hrs</div>
                                <div className="text-xs text-muted-foreground">Hackathon</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">30K+</div>
                                <div className="text-xs text-muted-foreground">Students</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">500+</div>
                                <div className="text-xs text-muted-foreground">Monthly Users</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">🏆</div>
                                <div className="text-xs text-muted-foreground">Winner</div>
                              </div>
                            </>
                          )}
                          {index === 2 && ( // DormBuddy
                            <>
                              <div>
                                <div className="text-lg font-bold text-primary">10K+</div>
                                <div className="text-xs text-muted-foreground">Daily Readings</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">IoT</div>
                                <div className="text-xs text-muted-foreground">Sensors</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">Real-time</div>
                                <div className="text-xs text-muted-foreground">Pipeline</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">Energy</div>
                                <div className="text-xs text-muted-foreground">Optimization</div>
                              </div>
                            </>
                          )}
                          {index === 3 && ( // Campus Chirp
                            <>
                              <div>
                                <div className="text-lg font-bold text-primary">30K+</div>
                                <div className="text-xs text-muted-foreground">Students</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">Full-stack</div>
                                <div className="text-xs text-muted-foreground">Platform</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">GCP</div>
                                <div className="text-xs text-muted-foreground">Deployment</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-primary">Social</div>
                                <div className="text-xs text-muted-foreground">Network</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Education */}
              <motion.div variants={itemVariants}>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-primary font-medium">{edu.institution}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{edu.duration}</span>
                            <span>GPA: {edu.gpa}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {edu.honors.map((honor) => (
                            <Badge key={honor} variant="secondary" className="text-xs">
                              {honor}
                            </Badge>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Relevant Coursework:</h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.coursework.map((course) => (
                              <Badge key={course} variant="outline" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
