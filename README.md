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

### 🎮 User Experience
* Intuitive interface
* Real-time updates
* Player comparison tool
* Alternative player suggestions

## 🚀 Getting Started

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Selfrules/hoopster.git
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables
   ```sh
   NEXT_PUBLIC_API_URL=your_api_url_here
   NEXT_PUBLIC_API_TOKEN=your_api_token_here
   ```

4. Start the development server
   ```sh
   npm run dev
   # or
   yarn dev
   ```

## 🏗 Project Structure
```
hoopster/
├── components/          # UI Components
│   ├── layout/         # Layout components
│   └── team-creation/  # Team generation components
├── lib/                # Utilities and hooks
│   ├── hooks/         # Custom React hooks
│   ├── config/        # Configuration files
│   └── types.ts       # TypeScript types
├── pages/             # Next.js pages
├── public/            # Static assets
├── styles/            # CSS styles
└── store/            # State management
```

## 🎯 Usage

1. Set your budget (90-110 credits)
2. Choose your preferences:
   * Prioritize "On Fire" players 🔥
   * Balance team selection ⚖️
   * Maximize playing probability 📈
3. Click "Generate Optimal Team"
4. Review and adjust your team
5. Use the player comparison tool to optimize

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📫 Contact

Mattia Filippo De Luca - [@selfrules](https://www.linkedin.com/in/selfrules/) - info@selfrules.org

Project Link: [https://github.com/Selfrules/hoopster](https://github.com/Selfrules/hoopster)

Website: [https://selfrules.org/](https://selfrules.org/)

---

> Why did the basketball player take up gardening? 
> Because he wanted to work on his plant defense! 🌱🏀

<img src="https://readme-jokes.vercel.app/api" alt="Jokes Card" />