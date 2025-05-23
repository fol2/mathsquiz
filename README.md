# Math Genius Challenge 🧠✨

A modern, AI-powered math quiz game built with React, TypeScript, and Google's Gemini AI. Challenge yourself with progressively difficult math problems and track your progress!

## ✨ Features

### Core Gameplay
- **AI-Generated Problems**: Dynamic math questions powered by Google Gemini AI
- **Progressive Difficulty**: 5 difficulty levels from basic arithmetic to advanced algebra
- **Smart Scoring System**: Points based on difficulty level and performance
- **Time-Based Challenges**: Adaptive timer that increases with difficulty
- **Strike System**: Build streaks to level up

### User Experience
- **Responsive Design**: Beautiful glassmorphism UI with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard shortcuts (Escape to clear, Enter to submit)
- **Progress Tracking**: Persistent statistics and high scores
- **Audio Feedback**: Sound effects for correct answers and level ups
- **Loading States**: Smooth loading animations with prefetching
- **Error Handling**: Graceful fallbacks when AI is unavailable

### Technical Excellence
- **PWA Ready**: Install as a mobile app with offline support
- **Service Worker**: Background caching for better performance
- **TypeScript**: Full type safety and better developer experience
- **Performance Optimized**: React.memo, prefetching, and optimized renders
- **Code Quality**: ESLint + Prettier for consistent code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (16+ recommended)
- Gemini API key (optional - app works with fallbacks)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd math-genius-challenge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment (optional for AI features):**
   ```bash
   # Create .env.local and add your Gemini API key
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```
   
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:5173`

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check for linting errors
npm run lint:fix        # Fix linting errors automatically
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # TypeScript type checking
```

## 📱 PWA Features

The app can be installed as a Progressive Web App:
- **Mobile Install**: Add to home screen on mobile devices
- **Offline Support**: Play even without internet connection
- **App-like Experience**: Standalone app window

## 🎮 Gameplay Guide

### Difficulty Levels
1. **Explorer** - Basic arithmetic (+, -, ×, ÷)
2. **Solver** - Simple algebra and order of operations
3. **Strategist** - Fractions, decimals, percentages
4. **Virtuoso** - Geometry, multi-step problems
5. **Genius** - Advanced algebra and complex word problems

### Keyboard Shortcuts
- **Enter**: Submit answer
- **Escape**: Clear input and refocus

### Scoring System
- Base points: 10 × difficulty level per correct answer
- Streak bonus: 3 correct answers = level up
- High score tracking with local storage persistence

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with glassmorphism design
- **AI**: Google Gemini API for problem generation
- **Build Tool**: Vite for fast development and optimized builds
- **PWA**: Service Worker + Web App Manifest

### Project Structure
```
src/
├── components/         # Reusable UI components
├── contexts/          # React contexts (theme, etc.)
├── hooks/             # Custom React hooks
├── services/          # API and business logic
├── types.ts           # TypeScript type definitions
├── constants.ts       # Game configuration
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

### Key Optimizations
- **React.memo** for preventing unnecessary re-renders
- **Prefetching** of next problems for seamless gameplay
- **Error boundaries** for graceful error handling
- **Accessibility** features for screen readers
- **Performance monitoring** and optimization

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (optional)
- `NODE_ENV`: Environment mode (development/production)

### Customization
Game constants can be modified in `src/constants.ts`:
- Timer duration per level
- Points per correct answer
- Number of strikes needed to level up
- Total questions per game

## 🚢 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `GEMINI_API_KEY`

### Vercel
1. Import project from GitHub
2. Framework preset: Vite
3. Add environment variable: `GEMINI_API_KEY`

### Manual
1. Run `npm run build`
2. Deploy `dist` folder to your web server
3. Set environment variables on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Run `npm run lint` before committing
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent problem generation
- Tailwind CSS for the beautiful design system
- React and TypeScript communities for excellent tooling
- Sound effects from various royalty-free sources

---

**Ready to become a Math Genius?** 🌟

Start playing at: [Your Deployment URL]
