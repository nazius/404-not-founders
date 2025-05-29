# DevStream - Developer RSS Feed Reader

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nazius-projects/v0-404-not-founders)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/5uUoDBo2daa)

## Overview

DevStream is a modern, accessible RSS feed reader designed specifically for developers. It aggregates content from popular developer platforms like Dev.to and Hacker News, featuring AI-powered summaries and a pinning system to keep your favorite articles at the top.

## Features

- 📰 **Multi-Source RSS Feeds** - Dev.to and Hacker News integration
- 🤖 **AI Summaries** - Generate intelligent article summaries using OpenAI
- 📌 **Article Pinning** - Pin important articles to keep them at the top
- 🔍 **Real-time Search** - Search through articles by title and content
- ♿ **ADA Compliant** - Full accessibility support with ARIA labels and keyboard navigation
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Beautiful gradient hero section with smooth animations

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **OpenAI API Key**: Required for AI summary functionality

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/nazius/404-not-founders.git
   cd 404-not-founders
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`bash
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Build & Production

### Development
\`\`\`bash
npm run dev
\`\`\`

### Build for production
\`\`\`bash
npm run build
\`\`\`

### Start production server
\`\`\`bash
npm start
\`\`\`

### Lint code
\`\`\`bash
npm run lint
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI summaries | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Keeping It Running

### Development
For development, simply run:
\`\`\`bash
npm run dev
\`\`\`
The development server will automatically reload when you make changes.

### Production (Local)
\`\`\`bash
npm run build
npm start
\`\`\`

### Production (PM2 - Recommended)
For production environments, use PM2 to keep the application running:

1. **Install PM2 globally**
   \`\`\`bash
   npm install -g pm2
   \`\`\`

2. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Start with PM2**
   \`\`\`bash
   pm2 start npm --name "devstream" -- start
   \`\`\`

4. **Save PM2 configuration**
   \`\`\`bash
   pm2 save
   pm2 startup
   \`\`\`

### Production (Docker)
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK with OpenAI
- **Icons**: Lucide React
- **RSS Parsing**: Native DOMParser
- **Storage**: localStorage (for pinned articles)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── article-card.tsx  # Article display component
│   ├── feed-reader.tsx   # Main feed reader
│   ├── hero-section.tsx  # Landing hero
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/              # Static assets
\`\`\`

## API Endpoints

- `GET /api/feed?source={dev|hn}` - Fetch RSS feeds
- `POST /api/summarize` - Generate AI summaries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

Your project is live at:

**[https://vercel.com/nazius-projects/v0-404-not-founders](https://vercel.com/nazius-projects/v0-404-not-founders)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/5uUoDBo2daa](https://v0.dev/chat/5uUoDBo2daa)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## License

© 2025 404 Not Founders Challenge. All rights reserved.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
