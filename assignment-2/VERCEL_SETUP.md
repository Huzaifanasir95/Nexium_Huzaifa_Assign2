# Vercel Integration Guide

## Required Vercel Information for GitHub Actions

### 1. **Vercel Token**
```bash
# Go to Vercel Dashboard → Settings → Tokens
# Create a new token and copy it
VERCEL_TOKEN=your_token_here
```

### 2. **Organization ID**
```bash
# Go to Vercel Dashboard → Settings → General
# Copy your Team/Organization ID
VERCEL_ORG_ID=your_org_id_here
```

### 3. **Project ID**
```bash
# Go to your project in Vercel → Settings → General
# Copy the Project ID
VERCEL_PROJECT_ID=your_project_id_here
```

## How to Add These to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VERCEL_TOKEN` | Your Vercel token | For deployment authentication |
| `VERCEL_ORG_ID` | Your organization ID | Vercel team/org identifier |
| `VERCEL_PROJECT_ID` | Your project ID | Specific project identifier |
| `MONGODB_URI` | Your MongoDB connection string | Database access |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Public Supabase endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Public Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service key | Private Supabase operations |
| `GEMINI_API_KEY` | Your Google Gemini API key | AI functionality |

## Vercel CLI Commands (Alternative to GitHub Actions)

If you prefer manual deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from assignment-2 directory
cd assignment-2
vercel

# Deploy to production
vercel --prod
```

## Environment Variables in Vercel Dashboard

Alternatively, you can set environment variables directly in Vercel:

1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add all your environment variables from .env.local

## Benefits of GitHub Actions + Vercel

1. **Automated Deployment**: Every push to main deploys automatically
2. **Quality Assurance**: Code is tested before deployment
3. **Rollback Capability**: Easy to revert problematic deployments
4. **Build Logs**: Track deployment history and debug issues
5. **Preview Deployments**: Each PR gets a preview URL

## Manual Vercel Setup (Simpler Option)

If GitHub Actions feel too complex for your assignment:

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel will auto-deploy on every push to main
4. No GitHub Actions needed!
