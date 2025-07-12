# Blog Summarizer

A Next.js application that allows users to enter a blog URL, scrape the content, generate a summary, translate it to Urdu, and store the data in MongoDB and Supabase.

## Features

- Scrape text content from any blog URL
- Generate a concise summary of the blog content
- Translate the summary to Urdu
- Store summaries in Supabase
- Store full text in MongoDB
- Responsive UI using ShadCN components

## Technologies Used

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Supabase (for storing summaries)
- MongoDB (for storing full text)
- Cheerio (for web scraping)
- Google Gemini AI API

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following environment variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for deployment on Vercel. Simply connect your repository to Vercel and make sure to configure the environment variables.
