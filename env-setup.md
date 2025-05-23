# Environment Setup Guide

## Setting up the Gemini API Key

To enable AI-generated math problems, you need to configure a Gemini API key.

### Steps:

1. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the generated key

2. **Local Development:**
   - Create a file named `.env.local` in the project root
   - Add your API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Production Deployment:**
   - For Netlify: Add the environment variable in your site settings
   - For Vercel: Add it in your project's environment variables
   - For other platforms: Follow their specific environment variable setup

### Troubleshooting:

- If you see "fallback" questions, the API key is not configured correctly
- Check that the key is valid and has the correct permissions
- Ensure the environment variable name is exactly `GEMINI_API_KEY`

### Fallback Mode:

The app will work without an API key by using simple fallback math problems, but you'll get a better experience with AI-generated questions. 