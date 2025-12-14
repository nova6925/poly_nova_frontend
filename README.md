# Poly Nova Frontend

A modern React + Vite application for tracking MrBeast video views and weather market analysis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend URL
# VITE_API_URL=http://localhost:3000
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
poly_nova_frontend/
├── src/
│   ├── components/     # React components
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000` |

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy!

### Deploy to Netlify

1. Push code to GitHub
2. Import repository in Netlify
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy!

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🤝 Related Repositories

- [poly_nova_backend](../poly_nova_backend) - Backend API server

## 📄 License

ISC
