# Resume AI - Smart Resume Analyzer & Builder

A comprehensive resume management platform that helps job seekers optimize their resumes, create ATS-friendly documents, and track applications efficiently.

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Live Demo

- **Frontend**: [https://resume-ai-rework.vercel.app](https://resume-ai-rework.vercel.app)
- **Backend API**: [https://resume-ai-rework.onrender.com](https://resume-ai-rework.onrender.com)

## ✨ Features

### 📊 Resume Analysis
- **AI-Powered Analysis**: Instantly analyze your resume against job descriptions
- **ATS Optimization**: Get personalized feedback on keywords, skills, and formatting
- **Smart Recommendations**: Receive actionable insights to make your resume job-ready

### 📝 Resume Builder
- **Modern Templates**: Choose from ATS-optimized, professional templates
- **Quick Creation**: Build polished resumes in minutes
- **Customizable Sections**: Highlight your strengths and tailor content
- **Download Ready**: Export ready-to-use PDF resumes

### 📋 Application Tracker
- **Centralized Management**: Store and organize all job applications
- **Comprehensive Details**: Track company, role, platform, resume used, dates, and status
- **Progress Monitoring**: Keep tabs on your job search progress

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Backend
- **Flask** - Python web framework
- **Cohere AI** - Advanced language model for resume analysis
- **Python 3.11.9** - Recommended Python version

### Database & Auth
- **Supabase** - PostgreSQL database and authentication
- **Google OAuth** - Secure social login

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend API hosting

## 📁 Project Structure

```
RESUME-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── cohere_analyzer.py   # AI analysis logic
│   │   ├── main.py              # Application entry point
│   │   ├── routes.py            # API endpoints
│   │   └── utils.py             # Helper functions
│   ├── .env                     # Environment variables
│   ├── main.py                  # Main application file
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── dist/                    # Build output
│   ├── node_modules/            # Node dependencies
│   ├── public/                  # Static assets
│   ├── src/                     # Source code
│   ├── .env                     # Environment variables
│   ├── package.json             # Node.js dependencies
│   ├── tailwind.config.ts       # Tailwind configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vercel.json              # Vercel deployment config
│   └── vite.config.ts           # Vite configuration
│
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Docker configuration
└── README.md                    # Project documentation
```

## 🚀 Local Development

### Prerequisites

- **Python 3.11.9** (recommended)
- **Node.js 18+**
- **Git**

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Rahul1038402/Resume-AI-Rework.git
```

2. **Navigate to backend directory**
```bash
cd backend
```

3. **Create and activate virtual environment**

**Windows:**
```bash
py -3.11 -m venv .venv
.venv\Scripts\activate
```

**Linux/macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

4. **Install dependencies**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

5. **Start the backend server**
```bash
python main.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ./frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

## 🔑 API Endpoints

### Resume Analysis
- `POST /analyze` - Analyze resume against job description

### Health Check
- `GET /health` - Check server status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Cohere AI** for powerful language model capabilities
- **Supabase** for backend-as-a-service platform
- **Vercel** and **Render** for reliable hosting solutions

---

**Made with ❤️ for job seekers everywhere**