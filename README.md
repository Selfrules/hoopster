# 🏀 Hoopster - Fantasy Basketball Team Generator

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.0-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

> "The strength of the team is each individual member. The strength of each member is the team." - Phil Jackson 🏆

## 🎯 About The Project

Hoopster is your AI-powered fantasy basketball team generator that helps you create the perfect lineup while staying within your budget. Think of it as having an NBA GM's brain in your pocket!

### Built With Love and:
* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Zustand](https://github.com/pmndrs/zustand)

## ✨ Features

### 🤖 Smart Team Generation
* Automatic team composition based on:
  * Budget constraints (90-110 credits)
  * Position requirements (2 Centers, 4 Forwards, 4 Guards, 1 Coach)
  * Team balance (max 3 players per NBA team)
  * Player performance metrics
  * "On Fire" status
  * Playing probability

### 💰 Budget Management
* Real-time budget tracking
* Visual budget utilization
* Flexible credit allocation (90-110 range)

### 📊 Advanced Analytics
* Player efficiency scoring
* Team balance indicators
* Performance predictions
* "On Fire" player tracking

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.17.0 or higher)
* npm or yarn
* Docker (optional, for containerized deployment)

### Local Development

1. Clone the repo
   ```sh
   git clone https://github.com/Selfrules/hoopster.git
   ```

2. Install dependencies
   ```sh
   npm ci
   ```

3. Set up your environment variables
   ```sh
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

### 🐳 Docker Deployment

1. Build the Docker image
   ```sh
   docker build -t hoopster .
   ```

2. Run the container
   ```sh
   docker run -p 3000:3000 hoopster
   ```

### 🌐 Deploy to Render.com

1. Fork this repository

2. Create a new Web Service on Render
   - Connect your GitHub repository
   - Select the `Docker` environment
   - Choose the `starter` plan
   - Select `frankfurt` region (or your preferred region)
   - Set your environment variables:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_API_URL=your_api_url
     NEXT_PUBLIC_API_TOKEN=your_api_token
     NODE_VERSION=18.17.0
     ```

3. Deploy! Render will automatically:
   - Build the Docker image
   - Start the service
   - Enable HTTPS
   - Provide a deployment URL

### 🔧 Troubleshooting Common Deployment Issues

1. ESLint Errors
   - The project includes a pre-configured `.eslintrc.json`
   - Run `npm run lint` locally to catch issues before deployment
   - Common fixes are included in the ESLint config

2. Node.js Version Issues
   - Ensure you're using Node.js v18.17.0 or higher
   - The version is specified in `package.json` engines field
   - Render.com will automatically use the correct version

3. Build Cache Issues
   - Clear Render.com build cache if you encounter stale builds
   - Use `npm ci` instead of `npm install` for clean installs

4. Environment Variables
   - Double-check all required environment variables are set
   - Use the correct format for API URLs (including https://)
   - Ensure API tokens have the necessary permissions

## 🏗 Project Structure
```
hoopster/
├── components/          # UI Components
├── lib/                # Utilities and hooks
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/             # CSS styles
└── store/             # State management
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📫 Contact

Mattia Filippo De Luca - [@selfrules](https://www.linkedin.com/in/selfrules/) - info@selfrules.org

Project Link: [https://github.com/Selfrules/hoopster](https://github.com/Selfrules/hoopster)

Website: [https://selfrules.org/](https://selfrules.org/)

---

> Why did the basketball player bring a ladder to practice? 
> Because they heard they needed to work on their step-back jumper! 🪜🏀

<img src="https://readme-jokes.vercel.app/api" alt="Jokes Card" />