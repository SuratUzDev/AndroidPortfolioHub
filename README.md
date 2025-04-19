
# Modern Portfolio Web Application

A full-stack web application built with React, Express, and Firebase, featuring a portfolio showcase, blog management, and admin dashboard.

## Prerequisites

- Node.js 20.x or later
- NPM 10.x or later
- A Replit account

## Quick Start on Replit

1. Fork this Repl to your account
2. Click the "Run" button to start the development server
3. The application will be available at the provided URL

## Local Development

1. Clone the repository to your Replit workspace
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will run on port 5000

## Project Structure

```
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   └── lib/        # Utility functions
├── server/            # Backend Express server
│   └── index.ts      # Server entry point
└── shared/           # Shared type definitions
```

## Features

- Responsive portfolio showcase
- Blog management system
- Admin dashboard
- Firebase authentication
- Real-time database updates
- Code snippet showcase
- Contact form

## Environment Variables

The following environment variables need to be set in Replit's Secrets tab:

- `DATABASE_URL`: PostgreSQL database URL
- `FIREBASE_API_KEY`: Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `FIREBASE_APP_ID`: Firebase app ID

## Deployment

1. Open the Deployments tab in your Replit workspace
2. Click "Deploy" 
3. The application will be deployed to a production environment
4. Access your deployed application through the provided URL

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: Type-check TypeScript files

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Authentication: Firebase Auth
- Storage: Firebase Storage
- Hosting: Replit

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
