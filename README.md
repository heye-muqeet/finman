# FinMan - Financial & Expense Management System

A comprehensive personal financial and expense management system built with Next.js, TypeScript, MongoDB, and modern web technologies.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally (or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finman
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - API keys (Gemini, Cloudinary, etc.)
   - Email configuration
   - OAuth credentials

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
finman/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── layout.tsx         # Root layout
├── lib/                   # Shared utilities and services
│   ├── config/           # Configuration files
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── middleware/       # Middleware functions
│   └── store/            # Redux store
├── components/           # React components
│   ├── common/          # Common components
│   └── ui/              # UI components (Radix UI)
├── models/              # Mongoose models
├── types/               # TypeScript types
└── scripts/             # Utility scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (TypeScript)
- **Database**: MongoDB with Mongoose
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Radix UI with Tailwind CSS
- **Authentication**: JWT, 2FA, OAuth (Google, Facebook)
- **AI Integration**: Google Gemini API
- **File Storage**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📚 Documentation

Full documentation is available in the `Documentation/` folder:
- `FINANCIAL_MANAGEMENT_SYSTEM_DOCUMENTATION.md` - Complete system documentation
- `DEVELOPMENT_PLAN.md` - Development plan and chunk breakdown

## 🧪 Testing

Testing setup will be added in later chunks.

## 📄 License

Private project - All rights reserved

## 👥 Development

This project follows a chunk-based development approach. See `Documentation/DEVELOPMENT_PLAN.md` for details.

---

**Current Status**: Chunk 01 - Project Initialization Complete ✅
