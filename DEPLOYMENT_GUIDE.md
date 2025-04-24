# Deployment Guide for Portfolio Application

This guide provides detailed steps to deploy your portfolio application to various hosting platforms.

## Prerequisites

Before deploying, ensure your application:
- Runs correctly locally
- Has all environment variables configured
- Has database migrations applied
- Passes all tests (if applicable)

## Environment Variables Needed for Deployment

Wherever you deploy, you'll need to set these environment variables:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id  
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

## 1. Replit Deployment (Recommended)

### Step 1: Prepare for Deployment
Ensure your app is running correctly in the Replit workspace.

### Step 2: Deploy with Replit
1. Click the "Deploy" button at the top of your Replit workspace
2. Follow the deployment steps provided by Replit
3. Once deployed, your app will be available at `https://<your-app-name>.replit.app`

### Step 3: Custom Domain (Optional)
1. In your deployed Replit project, go to the "Deployment" tab
2. Click "Custom domains"
3. Follow the instructions to add your domain and configure DNS settings

### Step 4: Monitor Deployment
1. Check the deployment logs for any errors
2. Test all major functionality on the deployed site
3. Set up monitoring if needed (e.g., UptimeRobot)

## 2. Vercel Deployment

### Step 1: Prepare Your Repository
Ensure your repository is hosted on GitHub, GitLab, or Bitbucket.

### Step 2: Create a Vercel Account
Sign up at [vercel.com](https://vercel.com) if you don't have an account.

### Step 3: Connect to Vercel
1. Install Vercel CLI (optional): `npm install -g vercel`
2. Log in to Vercel: `vercel login`

### Step 4: Configure Project
1. Create a `vercel.json` file in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.ts" },
    { "src": "/(.*)", "dest": "client/dist/$1" }
  ]
}
```

### Step 5: Deploy on Vercel
1. Run `vercel` in your project directory, or
2. Import your project from the Vercel dashboard
3. Configure environment variables in the Vercel dashboard

### Step 6: Set Up Database
1. Set up a PostgreSQL database (Vercel Postgres, Supabase, or other provider)
2. Set the `DATABASE_URL` environment variable in Vercel dashboard

## 3. Railway Deployment

### Step 1: Create Railway Account
Sign up at [railway.app](https://railway.app)

### Step 2: Create New Project
1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Select your repository

### Step 3: Add PostgreSQL Service
1. Click "New Service" > "Database" > "PostgreSQL"
2. Wait for the database to be provisioned

### Step 4: Configure Environment Variables
1. Go to your project settings
2. Add environment variables:
   - The `DATABASE_URL` will be automatically linked
   - Add other required environment variables

### Step 5: Deploy Your Application
1. Deploy either manually or set up automatic deployments
2. Railway will build and deploy your application automatically

## 4. Heroku Deployment

### Step 1: Create Heroku Account
Sign up at [heroku.com](https://heroku.com)

### Step 2: Install Heroku CLI
```bash
npm install -g heroku
```

### Step 3: Login and Create App
```bash
heroku login
heroku create your-portfolio-app
```

### Step 4: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Step 5: Configure Environment Variables
```bash
heroku config:set VITE_FIREBASE_API_KEY=your-firebase-api-key
heroku config:set VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
heroku config:set VITE_FIREBASE_APP_ID=your-firebase-app-id
```

### Step 6: Create Procfile
Create a file named `Procfile` in the root directory:
```
web: npm start
```

### Step 7: Deploy to Heroku
```bash
git push heroku main
```

### Step 8: Open Your Application
```bash
heroku open
```

## 5. DigitalOcean App Platform

### Step 1: Create DigitalOcean Account
Sign up at [digitalocean.com](https://digitalocean.com)

### Step 2: Create New App
1. Click "Create" > "Apps"
2. Connect your GitHub repository

### Step 3: Configure App
1. Select the branch to deploy
2. Configure build settings
3. Add environment variables

### Step 4: Add Database
1. Click "Add a Resource" > "Database"
2. Select PostgreSQL
3. Choose your plan

### Step 5: Deploy Your Application
Click "Launch App" to deploy your application

## Post-Deployment Steps

Regardless of the platform you choose, complete these steps after deployment:

### 1. Verify Application Functionality
- Test all main features
- Check database connectivity
- Ensure Firebase authentication works
- Verify API endpoints

### 2. Set Up SSL/HTTPS
Most platforms handle this automatically, but verify HTTPS works correctly.

### 3. Configure Custom Domain (Optional)
Follow the platform-specific instructions to add your custom domain.

### 4. Set Up Monitoring (Optional)
Consider adding monitoring tools like:
- UptimeRobot for uptime monitoring
- LogRocket for error tracking
- Google Analytics for visitor tracking

### 5. Regular Backups
Set up regular database backups:
```bash
# Example automated backup script
pg_dump -U <username> -d <database_name> -h <host> -F c -f backup-$(date +%Y%m%d).dump
```

## Troubleshooting Deployment Issues

### Common Issues and Solutions

1. **Build Failures**
   - Check deployment logs for specific errors
   - Verify that all dependencies are correctly specified in package.json
   - Make sure your Node.js version is supported by the platform

2. **Database Connection Issues**
   - Check that the DATABASE_URL is correctly formatted
   - Ensure the database server is accessible from your deployment platform
   - Verify database credentials are correct

3. **Environment Variable Problems**
   - Double-check all environment variables are set
   - Ensure sensitive values are properly escaped if they contain special characters
   - Verify frontend variables have the proper VITE_ prefix

4. **Firebase Authentication Issues**
   - Add your deployment domain to Firebase authorized domains list
   - Verify Firebase configuration variables are correct

5. **Static Asset Loading Problems**
   - Check that assets are being correctly served from the correct path
   - Verify path references in your code match the deployment structure

If you encounter persistent issues, check the platform-specific documentation or contact support.