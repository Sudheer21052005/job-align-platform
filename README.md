# 🎯 JobAlign Platform

**An intelligent job alignment platform powered by AI that matches job seekers with opportunities using resume and job analysis.**

[![GitHub](https://img.shields.io/badge/GitHub-Sudheer21052005%2Fjob--align--platform-blue?logo=github)](https://github.com/Sudheer21052005/job-align-platform)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

---

## ✨ Features

### 🔐 **User Authentication & Authorization**
- Role-based access control (Job Seeker, Recruiter, Admin)
- JWT-based authentication with refresh tokens
- Secure password reset flow with email verification

### 👤 **Job Seeker Capabilities**
- Upload and parse resumes with AI-powered analysis
- Browse jobs with advanced filtering (industry, location, salary, etc.)
- AI-powered job matching based on resume profile
- Save/unsave job listings
- Apply for jobs with one-click submission
- View application status and matching scores
- Get personalized job search recommendations from AI assistant

### 💼 **Recruiter Capabilities**
- Create and manage job listings
- AI-powered job analysis and skill extraction
- Edit and close job postings
- View applicants with intelligent matching scores
- Filter and sort candidates by match percentage
- Manage company profile and branding
- Analytics dashboard for hiring metrics

### 🤖 **AI-Powered Intelligence**
- **Resume Analysis**: Extracts skills, experience, education, and certifications
- **Job Analysis**: Parses job descriptions and identifies key requirements
- **Smart Matching**: Calculates compatibility scores between candidates and jobs
- **AI Assistant**: Provides job search guidance and career recommendations
- Built with **Google Gemini API** for advanced NLP

### 📱 **User Experience**
- Responsive design (Desktop, Tablet, Mobile)
- Fast page load times (< 3 seconds)
- Intuitive navigation
- Real-time notifications
- Dark/Light mode support

### 🔒 **Security**
- Input sanitization and validation on all user inputs
- HTTPS/TLS encryption
- Rate limiting on API endpoints
- Secure file uploads (Cloudinary integration)
- CORS protection
- XSS and CSRF prevention

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18+ with Vite
- **Styling**: TailwindCSS / CSS Modules
- **HTTP Client**: Axios
- **State Management**: Context API / Redux (if applicable)
- **Routing**: React Router v6

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **AI/ML**: Google Gemini API
- **File Storage**: Cloudinary
- **Email**: SMTP (Gmail)

### **DevOps & Tools**
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv
- **Testing**: Jest, Mocha (if applicable)
- **Linting**: ESLint

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git**

### External Services Required:
- Google Gemini API key (for AI analysis)
- Cloudinary account (for image/file uploads)
- Gmail account (for email notifications)

---

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/Sudheer21052005/job-align-platform.git
cd JobAlignProject
```

### **2. Backend Setup**

Navigate to backend directory:
```bash
cd jobalign-backend
```

Install dependencies:
```bash
npm install
```

Create `.env` file (use `.env.example` as template):
```bash
cp .env.example .env
```

Configure `.env` with your credentials:
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/jobalign
```

**Generate JWT Secrets (optional but recommended)**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### **3. Frontend Setup**

Open new terminal, navigate to frontend:
```bash
cd AppFrontend
```

Install dependencies:
```bash
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Configure `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start development server:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 📁 Project Structure

```
JobAlignProject/
├── AppFrontend/                    # React Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API calls
│   │   ├── context/               # Global state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── jobalign-backend/               # Express.js backend
│   ├── config/                    # Configuration files
│   ├── controllers/               # Route controllers
│   ├── middleware/                # Custom middleware
│   ├── models/                    # MongoDB schemas
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic
│   ├── utils/                     # Helper functions
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── .env.example
│
├── testsprite_tests/              # Test cases & documentation
│   ├── TC*.py                     # Test scenarios
│   └── standard_prd.json          # Requirements
│
└── README.md                       # This file
```

---

## 🔌 API Endpoints Overview

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/reset-password` - Request password reset

### **Job Seeker**
- `POST /api/seeker/upload-resume` - Upload and parse resume
- `GET /api/seeker/jobs` - Browse jobs with filters
- `POST /api/seeker/apply` - Apply for a job
- `GET /api/seeker/applications` - View my applications
- `POST /api/seeker/save-job` - Save job listing

### **Recruiter**
- `POST /api/recruiter/jobs` - Create job listing
- `PUT /api/recruiter/jobs/:id` - Edit job listing
- `DELETE /api/recruiter/jobs/:id` - Close job listing
- `GET /api/recruiter/applicants` - View applicants with scores
- `PUT /api/recruiter/profile` - Update company profile

### **AI Assistant**
- `POST /api/ai/job-recommendation` - Get job recommendations
- `POST /api/ai/resume-analysis` - Analyze resume
- `POST /api/ai/job-analysis` - Analyze job description

See [API.txt](./jobalign-backend/API.txt) for detailed documentation.

---

## 🧪 Testing

Run backend tests:
```bash
cd jobalign-backend
npm test
```

Run frontend tests:
```bash
cd AppFrontend
npm test
```

View test cases in `testsprite_tests/` directory.

---

## 🌐 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY - Google Gemini API key for AI analysis
JWT_SECRET - Secret key for JWT tokens
REFRESH_TOKEN_SECRET - Secret for refresh tokens
PORT - Server port (default: 5000)
FRONTEND_URL - Frontend URL for CORS
CLOUD_NAME - Cloudinary project name
API_KEY - Cloudinary API key
API_SECRET - Cloudinary API secret
EMAIL_USER - Gmail account for sending emails
EMAIL_PASS - Gmail app password
MONGODB_URI - MongoDB connection string
```

### Frontend (.env)
```
VITE_API_BASE_URL - Backend API URL (default: http://localhost:5000)
```

⚠️ **Never commit `.env` files!** Use `.env.example` as template.

---

## 🚢 Deployment

### **Frontend (Vercel/Netlify)**
```bash
cd AppFrontend
npm run build
# Deploy the 'dist' folder to Vercel/Netlify
```

### **Backend (Heroku/Railway/Render)**
```bash
cd jobalign-backend
# Push to your hosting platform
git push heroku main
```

### **Database (MongoDB Atlas)**
1. Create MongoDB Atlas account
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`

---

## 📊 Performance Metrics

- ⚡ **Page Load Time**: < 3 seconds
- 🚀 **API Response Time**: < 500ms
- 📦 **Bundle Size**: Optimized with code splitting
- 🔍 **SEO**: Implemented meta tags and structured data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/Sudheer21052005/job-align-platform/issues)
- **Email**: sudheerprajapti0@gmail.com

---


## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB for reliable database
- Cloudinary for file management
- The open-source community

---

**Made with ❤️ by [Sudheer21052005](https://github.com/Sudheer21052005)**

⭐ **If you find this project helpful, please give it a star!** ⭐
