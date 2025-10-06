# 🚀 Modern Portfolio Website

A stunning, full-stack portfolio website built with Next.js 14, featuring interactive applications, AI-powered chatbot, and modern design with glassmorphism effects.

## Link Go To:
https://www.rishikmuthyala.xyz

## ✨ Features

### 🎨 **Modern Design**
- **Glassmorphism UI** with backdrop blur effects
- **Dark/Light/System** theme support
- **Responsive design** optimized for all devices
- **Smooth animations** powered by Framer Motion
- **Custom scrollbars** and micro-interactions

### 🏠 **Homepage**
- **Animated hero section** with dynamic role rotation
- **Parallax effects** and floating elements
- **About section** with interactive cards
- **Skills visualization** with animated progress bars
- **Contact CTA** with multiple engagement options

### 🛠️ **Interactive Applications (15+ Mini-Apps)**
1. **AI Chat Assistant** - Intelligent chatbot trained on experience
2. **Link Shortener** - URL shortening with analytics
3. **Code Snippet Manager** - Save and organize code snippets
4. **Markdown Editor** - Live preview markdown editor
5. **Color Palette Generator** - Generate beautiful color schemes
6. **AI-Powered Todo** - Smart task management
7. **Weather Dashboard** - Beautiful weather visualization
8. **Expense Tracker** - Personal finance management
9. **Tech Quiz Game** - Interactive programming quiz
10. **API Tester** - Postman-like API testing tool
11. **Password Generator** - Secure password creation
12. **Image Optimizer** - Compress and resize images
13. **JSON Formatter** - Format and validate JSON
14. **Regex Tester** - Test regular expressions
15. **Pomodoro Timer** - Productivity timer with stats

### 🤖 **AI Integration**
- **Floating chat widget** accessible from all pages
- **OpenAI GPT integration** for intelligent responses
- **Conversation history** stored in database
- **Suggested questions** for better engagement
- **Export chat** functionality

### 📄 **Interactive Resume**
- **Tabbed interface** with multiple sections
- **Experience timeline** with detailed achievements
- **Skills visualization** with proficiency levels
- **Project showcase** with live links
- **Education & certifications** display
- **PDF download** functionality

### 📝 **Blog System**
- **MDX support** for rich content
- **Search and filtering** by tags/categories
- **Reading time estimates** and view counts
- **Responsive design** with syntax highlighting
- **Newsletter signup** integration

### 📧 **Contact System**
- **Form validation** with Zod schema
- **Database storage** of all inquiries
- **Multiple contact methods** (email, form, calendar)
- **Real-time form submission** with error handling
- **FAQ section** for common questions

### 🔧 **Backend & Database**
- **Next.js API routes** for all functionality
- **Prisma ORM** with PostgreSQL
- **Type-safe database** operations
- **RESTful API design** with proper error handling
- **Database migrations** and seeding

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom utilities
- **Framer Motion** for animations
- **shadcn/ui** component library

### **Backend**
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** database
- **OpenAI API** integration
- **Zod** for validation

### **Deployment & Analytics**
- **Vercel** deployment ready
- **Google Analytics** integration
- **SEO optimization** with meta tags
- **Sitemap & robots.txt** generation
- **Performance monitoring**

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, has fallback)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"

# OpenAI API (optional - has fallback responses)
OPENAI_API_KEY="your_openai_api_key_here"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Your Name"

# Email Configuration (for contact form)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="your-email@gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS="G-XXXXXXXXXX"

# GitHub (for repo stats)
GITHUB_TOKEN="your_github_token"
GITHUB_USERNAME="your_github_username"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── apps/              # Mini applications
│   │   ├── blog/              # Blog system
│   │   ├── contact/           # Contact page
│   │   ├── resume/            # Resume page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── home/             # Homepage sections
│   │   ├── apps/             # Mini-app components
│   │   ├── blog/             # Blog components
│   │   ├── contact/          # Contact components
│   │   ├── resume/           # Resume components
│   │   └── chat/             # Chat widget
│   ├── lib/                  # Utilities and config
│   │   ├── prisma.ts         # Database client
│   │   ├── constants.ts      # App constants
│   │   └── utils.ts          # Utility functions
│   └── styles/               # Global styles
├── prisma/                   # Database schema
├── public/                   # Static assets
└── content/                  # Blog content (MDX)
```

## 🎨 Customization

### **Personal Information**
Update your details in `src/lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Your Name",
  title: "Your Title",
  description: "Your description",
  // ... more config
}
```

### **Theme Colors**
Customize colors in `src/app/globals.css`:

```css
:root {
  --primary: /* your primary color */;
  --secondary: /* your secondary color */;
  /* ... more variables */
}
```

### **Content**
- **Resume data**: Update experience, skills, and projects in components
- **Blog posts**: Add MDX files to the `content/blog/` directory
- **Mini-apps**: Customize or add new applications in `src/app/apps/`

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### **Manual Deployment**

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

### **Database Setup**
- **Local**: Use PostgreSQL locally
- **Production**: Use services like:
  - [Supabase](https://supabase.com) (recommended)
  - [PlanetScale](https://planetscale.com)
  - [Neon](https://neon.tech)

## 📊 Analytics & Monitoring

### **Google Analytics**
Add your GA4 tracking ID to environment variables:
```env
NEXT_PUBLIC_GOOGLE_ANALYTICS="G-XXXXXXXXXX"
```

### **Performance Monitoring**
The site includes:
- **Core Web Vitals** tracking
- **Page view** analytics
- **Custom event** tracking
- **Error monitoring** setup

## 🔧 API Endpoints

### **Contact Form**
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact statistics (admin)

### **AI Chat**
- `POST /api/chat` - Send message to AI assistant

### **Link Shortener**
- `POST /api/links` - Create short link
- `GET /api/links` - Get all links and stats
- `GET /s/[code]` - Redirect to original URL

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations
- **Prisma** for excellent database tooling
- **OpenAI** for AI capabilities

## 📞 Support

If you have any questions or need help setting up the portfolio:

- **Open an issue** on GitHub
- **Email**: your-email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

**⭐ If you found this portfolio helpful, please give it a star on GitHub!**

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
