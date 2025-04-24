# Sulton UzDev Portfolio Application Guide

This guide explains how to run the portfolio application locally, access the PostgreSQL database, and deploy the application to a hosting service.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [PostgreSQL Database Access](#postgresql-database-access)
3. [Deployment Guide](#deployment-guide)
4. [Environment Variables](#environment-variables)
5. [Application Structure](#application-structure)

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL database

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd <repository-folder>
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

### Step 4: Run Database Migrations
```bash
npm run db:push
```
This command will create the necessary tables in your PostgreSQL database.

### Step 5: Seed the Database (Optional)
You can seed the database with sample data through the admin panel after starting the application or run:
```bash
npm run seed
```

### Step 6: Start the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:5000

## PostgreSQL Database Access

### Accessing Database via CLI
To access your PostgreSQL database via command line:
```bash
psql -U <username> -d <database_name> -h <host>
```

### View All Tables
```sql
\dt
```

### Common SQL Queries
Display all blog posts:
```sql
SELECT * FROM blog_posts;
```

Display all apps:
```sql
SELECT * FROM apps;
```

Display all GitHub repositories:
```sql
SELECT * FROM github_repos;
```

Display all code samples:
```sql
SELECT * FROM code_samples;
```

Display profile information:
```sql
SELECT * FROM profiles;
```

### Using pgAdmin
1. Install pgAdmin from [pgAdmin.org](https://www.pgadmin.org/)
2. Connect to your PostgreSQL server using the credentials in your DATABASE_URL
3. Browse databases and tables using the GUI interface

## Deployment Guide

### Replit Deployment (Recommended)
1. Make sure your application is running correctly in your Replit workspace
2. Click the "Deploy" button at the top of your Replit workspace
3. Follow the deployment steps provided by Replit
4. Once deployed, your app will be available at `https://<your-app-name>.replit.app`

### Other Deployment Options

#### Vercel Deployment
1. Create an account on [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel login` to log in to your account
4. Navigate to your project folder and run `vercel`
5. Follow the prompts to deploy your application

#### Railway Deployment
1. Create an account on [Railway](https://railway.app)
2. Connect your GitHub repository to Railway
3. Set up the required environment variables
4. Deploy the application

#### Heroku Deployment
1. Create an account on [Heroku](https://heroku.com)
2. Install Heroku CLI: `npm install -g heroku`
3. Log in to Heroku: `heroku login`
4. Create a Heroku app: `heroku create <app-name>`
5. Set up the PostgreSQL addon: `heroku addons:create heroku-postgresql:hobby-dev`
6. Push to Heroku: `git push heroku main`

## Environment Variables

Your application requires the following environment variables:

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| VITE_FIREBASE_API_KEY | Firebase API key for authentication |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_APP_ID | Firebase application ID |

## Application Structure

The portfolio application is organized as follows:

- `/client`: Frontend code (React + TypeScript)
  - `/src/components`: Reusable UI components
  - `/src/contexts`: React context providers
  - `/src/hooks`: Custom React hooks
  - `/src/lib`: Utility functions and configuration
  - `/src/pages`: Page components including admin panel
- `/server`: Backend code (Express + Node.js)
  - `/db.ts`: PostgreSQL database configuration
  - `/routes.ts`: API routes definition
  - `/storage.ts`: Data access layer
- `/shared`: Shared code between frontend and backend
  - `/schema.ts`: Database schema definitions

### Main Workflows
1. Database migrations: `npm run db:push`
2. Development server: `npm run dev`
3. Build for production: `npm run build`
4. Start production server: `npm start`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check that your DATABASE_URL is correct
   - Ensure PostgreSQL server is running
   - Check network access if database is hosted remotely

2. **Firebase Authentication Issues**
   - Verify Firebase credentials in environment variables
   - Check that authorized domains are configured in Firebase console

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run typecheck`

If you encounter any other issues, check the server logs for detailed error messages.