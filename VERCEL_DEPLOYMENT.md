# Vercel Deployment Guide

## Prerequisites

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
3. **Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Deployment Steps

### 1. Prepare Your Repository

Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel should automatically detect this as a Vite project

### 3. Configure Environment Variables

In your Vercel project settings, add the following environment variable:

- **Variable Name**: `GEMINI_API_KEY`
- **Value**: Your actual Gemini API key from Google AI Studio
- **Environment**: Production, Preview, and Development (all three)

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (should take 1-2 minutes)
3. Your app will be available at the provided URL

## Project Configuration

This project is already configured with:

- ✅ `vercel.json` for deployment settings
- ✅ Vite React plugin for proper React support
- ✅ Build optimizations (code splitting, minification)
- ✅ Proper environment variable handling
- ✅ SPA routing support

## Build Details

- **Framework**: Vite + React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x (default)

## Troubleshooting

### Build Failures
- Ensure all dependencies are in `package.json`
- Check that the build works locally with `npm run build`
- Verify environment variables are set correctly

### Runtime Errors
- Check Vercel's function logs in the dashboard
- Ensure your Gemini API key is valid and has proper permissions
- Verify the API key is set in all environments (Production, Preview, Development)

### API Issues
- The app will work in fallback mode without the API key
- Check the browser console for API-related error messages
- Ensure you're not exceeding Gemini API quotas

## Performance Optimizations

The build is optimized with:
- Code splitting (vendor, genai, and main chunks)
- Terser minification
- Asset caching headers
- Minimal bundle sizes

## Post-Deployment

After successful deployment:

1. **Test the live site**: Verify all features work correctly
2. **Check API functionality**: Ensure AI-generated problems are working
3. **Monitor performance**: Use Vercel's analytics dashboard
4. **Set up monitoring**: Consider adding error tracking if needed

## Continuous Deployment

Once connected, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run builds and tests automatically

Your math quiz app should now be live and accessible worldwide! 🎉 