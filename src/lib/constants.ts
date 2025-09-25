export const SITE_CONFIG = {
  name: "Rishik Muthyala",
  title: "Rishik Muthyala - CS & Math Student | Software Engineering Intern",
  description: "Rishik Muthyala - CS & Math Student at UMass Amherst. Software Engineering Intern specializing in full-stack development and AI/ML.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  keywords: ["Computer Science Student", "Software Engineering Intern", "Full Stack Developer", "React", "Next.js", "TypeScript", "Python", "AI", "Machine Learning", "MITRE Corporation", "UMass Amherst"],
  author: "Rishik Muthyala",
  social: {
    github: "https://github.com/rishikmuthyala",
    linkedin: "https://www.linkedin.com/in/rishik-muthyala-75a7a1213/",
    email: "rishikmuthyala05@gmail.com",
    twitter: "https://twitter.com/rishikmuthyala"
  }
}

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Apps", href: "/apps" },
  { name: "Resume", href: "/resume" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" }
]

export const MINI_APPS = [
  {
    id: "ai-resume-builder",
    name: "AI Resume Builder",
    description: "Generate ATS-optimized resumes with GPT-4 powered suggestions and real-time scoring",
    icon: "📄",
    href: "/apps/ai-resume-builder",
    featured: true
  },
  {
    id: "chat-with-rishik",
    name: "Chat with Rishik",
    description: "Have a personal conversation with Rishik's AI assistant",
    icon: "💬",
    href: "/apps/chat-with-rishik",
    featured: true
  },
  {
    id: "ai-chat",
    name: "AI Chat Assistant",
    description: "Chat with an AI trained on my experience and skills",
    icon: "🤖",
    href: "/apps/ai-chat",
    featured: true
  },
  {
    id: "ml-recommender",
    name: "Smart Media Recommender",
    description: "ML-powered movie & music recommendations using collaborative filtering and content analysis",
    icon: "🎬",
    href: "/apps/ml-recommender",
    featured: true
  },
  {
    id: "wordle-game",
    name: "Wordle Clone",
    description: "Custom Wordle game with difficulty levels, statistics tracking, and daily challenges",
    icon: "🎮",
    href: "/apps/wordle",
    featured: true
  },
  {
    id: "link-shortener",
    name: "Link Shortener",
    description: "Shorten URLs with analytics tracking",
    icon: "🔗",
    href: "/apps/link-shortener",
    featured: true
  },
  {
    id: "code-snippets",
    name: "Code Snippet Manager",
    description: "Save and share code with syntax highlighting",
    icon: "💻",
    href: "/apps/code-snippets",
    featured: false
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Live preview markdown editor with export options",
    icon: "📝",
    href: "/apps/markdown-editor",
    featured: false
  },
  {
    id: "todo-ai",
    name: "AI-Powered Todo",
    description: "Smart todo list with AI task suggestions",
    icon: "✅",
    href: "/apps/todo-ai",
    featured: false
  },
  {
    id: "weather-dashboard",
    name: "Weather Dashboard",
    description: "Beautiful weather app with charts and forecasts",
    icon: "🌤️",
    href: "/apps/weather",
    featured: false
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description: "Track expenses with visualizations",
    icon: "💰",
    href: "/apps/expenses",
    featured: false
  },
  {
    id: "quiz-game",
    name: "Tech Quiz Game",
    description: "Interactive quiz on programming topics",
    icon: "🧠",
    href: "/apps/quiz",
    featured: false
  },
  {
    id: "api-tester",
    name: "API Tester",
    description: "Test REST APIs like Postman",
    icon: "🔌",
    href: "/apps/api-tester",
    featured: false
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords with customization",
    icon: "🔐",
    href: "/apps/password-generator",
    featured: false
  },
  {
    id: "image-optimizer",
    name: "Image Optimizer",
    description: "Compress and resize images efficiently",
    icon: "🖼️",
    href: "/apps/image-optimizer",
    featured: false
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON data",
    icon: "📋",
    href: "/apps/json-formatter",
    featured: false
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with explanations",
    icon: "🔍",
    href: "/apps/regex-tester",
    featured: false
  },
  {
    id: "pomodoro-timer",
    name: "Pomodoro Timer",
    description: "Productivity timer with statistics",
    icon: "⏰",
    href: "/apps/pomodoro",
    featured: false
  }
]

export const TECH_STACK = [
  "Python", "Java", "C++", "JavaScript", "TypeScript", "Swift", "React", "Next.js", 
  "Node.js", "TensorFlow", "PyTorch", "AWS", "Azure", "GCP", "PostgreSQL", "MongoDB", 
  "Docker", "REST APIs", "WebSockets", "XGBoost", "LightGBM", "Scikit-learn", "Pandas", 
  "NumPy", "SwiftUI", "Arduino", "Linux", "Git", "AFSIM", "Cesium 3D"
]

export const EXPERIENCE = [
  {
    company: "MITRE Corporation",
    position: "Software Engineering Intern",
    duration: "Jun 2025 - Aug 2025",
    location: "Bedford, Massachusetts",
    description: "DoD satellite communications, Python-based V&V scripts, automated testing frameworks.",
    technologies: ["Python", "AFSIM", "Cesium 3D", "Orbit", "Satellite Communications"],
    achievements: [
      "Improved 65% test coverage for national security operations",
      "Validated 200+ transmission windows per orbital cycle",
      "Delivered 35% faster computational performance for multi-satellite coordination"
    ]
  },
  {
    company: "Treevah",
    position: "Full Stack Engineering Intern",
    duration: "Dec 2024 - May 2025",
    location: "Chicago, Illinois",
    description: "Multi-enterprise file management system, React/TypeScript, Redis caching, Elasticsearch.",
    technologies: ["React", "TypeScript", "Azure", "Redis", "Elasticsearch", "WebSocket", "OpenAI GPT-4"],
    achievements: [
      "Improved file access latency by 40%",
      "Achieved projected $300K annual cost savings",
      "Reduced transmission errors by 35%",
      "Built AI categorization POC with 60% reduction in manual tasks"
    ]
  },
  {
    company: "SellServe",
    position: "Head iOS Development",
    duration: "Jan 2025 - Apr 2025",
    location: "Boston, Massachusetts",
    description: "iOS hospitality platform, SwiftUI/Combine, MVVM architecture, CoreData persistence.",
    technologies: ["SwiftUI", "Combine", "MVVM", "CoreData", "OAuth 2.0", "AWS Lambda", "PostgreSQL"],
    achievements: [
      "Reduced development cycle by 40%",
      "Achieved 99.9% uptime",
      "Enabled democratized hospitality technology"
    ]
  },
  {
    company: "Columbia University",
    position: "Software Engineering Intern",
    duration: "Sep 2023",
    location: "New York, New York",
    description: "Autonomous drone prototype, Python, TensorFlow/PyTorch, MAVLink communication.",
    technologies: ["Python", "TensorFlow", "PyTorch", "MAVLink", "Pandas", "NumPy"],
    achievements: [
      "Improved tracking accuracy by 30% for emergency response",
      "Achieved 25% weight reduction and 35% stability enhancement",
      "Saved $50K in R&D costs"
    ]
  }
]

export const PROJECTS = [
  {
    name: "AI-Powered Phishing Detection System",
    date: "Jun 2025",
    description: "Ensemble learning model for malicious URL classification. XGBoost/LightGBM with 95%+ accuracy.",
    technologies: ["Python", "XGBoost", "LightGBM", "Scikit-learn", "Pandas", "Jupyter"],
    link: "https://www.kaggle.com/code/rishikmuthyala/phishing-model",
    achievements: [
      "Achieved 95%+ accuracy on phishing detection",
      "0.07 log-loss score in competitive Kaggle environment",
      "Implemented ensemble learning with hyperparameter tuning"
    ]
  },
  {
    name: "FoundU - 36-Hour Hackathon Winner",
    date: "Nov 2024",
    description: "ID recovery system for 30K+ students. Built in 36 hours using Google Vision API.",
    technologies: ["React Native", "Node.js", "Google Vision API", "Puppeteer"],
    link: "https://github.com/rishikmuthyala/Hackathon_FoundU_Code",
    achievements: [
      "Won 36-hour hackathon competition",
      "Built for 30K+ students",
      "Projected 500+ monthly recoveries",
      "Pending campus deployment"
    ]
  },
  {
    name: "DormBuddy - IoT Smart Dorm System",
    date: "Nov 2023",
    description: "IoT smart dorm system with Arduino sensors. Real-time data pipeline processing 10K+ daily readings.",
    technologies: ["Arduino", "C++", "Node.js", "MongoDB", "IoT Sensors"],
    link: "https://devpost.com/software/dorm-buddy",
    achievements: [
      "Processing 10K+ daily readings",
      "Real-time data pipeline",
      "Energy optimization analytics",
      "Student comfort monitoring"
    ]
  },
  {
    name: "Campus Chirp - Social Platform",
    date: "Sep 2024",
    description: "Full-stack social platform for 30K+ students. React frontend, Node.js API, MongoDB.",
    technologies: ["React.js", "Node.js", "MongoDB", "JWT", "GCP", "RESTful API"],
    link: "https://github.com/rishikmuthyala/campus-chirp",
    achievements: [
      "Built for 30K+ students",
      "Full-stack architecture",
      "RESTful API design",
      "Prepared for GCP deployment"
    ]
  }
]
