# Local Development Guide for Android Portfolio Hub

This guide provides detailed instructions for setting up and running the Android Portfolio Hub application on your local machine.

## Prerequisites

Before you start, make sure you have the following installed:

1. **Node.js (v20+)** - [Download](https://nodejs.org/en/download/)
2. **npm (v8+)** - Comes with Node.js
3. **PostgreSQL (v15+)** - [Download](https://www.postgresql.org/download/)
4. **Git** - [Download](https://git-scm.com/downloads)

### MacOS Setup (using Homebrew)

```bash
# Install Node.js
brew install node@20

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15
```

### Windows Setup

1. Download and install Node.js from the [official website](https://nodejs.org/)
2. Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/windows/)
3. During PostgreSQL installation, note down the username and password you create

### Linux Setup (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AndroidPortfolioHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

#### Create a PostgreSQL Database

For MacOS/Linux:
```bash
createdb android_portfolio_hub
```

For Windows (using psql):
```bash
psql -U postgres
CREATE DATABASE android_portfolio_hub;
\q
```

#### Configure Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgres://localhost:5432/android_portfolio_hub
PGHOST=localhost
PGUSER=your_postgres_username
PGPASSWORD=your_postgres_password
PGDATABASE=android_portfolio_hub
PGPORT=5432
```

Replace `your_postgres_username` and `your_postgres_password` with your PostgreSQL credentials.

### 4. Run Database Migrations and Sample Data Generation

We've created a helper script to set up your local database:

```bash
# Make the script executable (MacOS/Linux only)
chmod +x setup-local-db.js

# Run the script
node setup-local-db.js
```

This script will:
1. Create a `.env` file if it doesn't exist
2. Run database migrations to create the schema
3. Create sample data for development

### 5. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5000`.

## Project Structure Overview

- `client/` - Frontend React application
  - `src/` - Source code
    - `components/` - UI components
    - `contexts/` - React contexts for state management
    - `hooks/` - Custom React hooks
    - `lib/` - Utility functions and configurations
    - `pages/` - Page components
    - `services/` - API service functions
- `server/` - Backend Express application
  - `db.ts` - Database connection setup
  - `routes.ts` - API route definitions
  - `storage.ts` - Data access layer abstraction
  - `postgres-storage.ts` - PostgreSQL implementation of storage
- `shared/` - Shared code between frontend and backend
  - `schema.ts` - Database schema definitions using Drizzle ORM

## Development Workflow

1. **Database Schema Changes**:
   - Update `shared/schema.ts` with your changes
   - Run `npm run db:push` to apply changes to the database

2. **API Changes**:
   - Add the needed storage operations in `postgres-storage.ts`
   - Add corresponding API endpoints in `routes.ts`

3. **Frontend Changes**:
   - Create/modify components in `client/src/components/`
   - Add/update pages in `client/src/pages/`
   - Use React Query for data fetching (see existing examples)

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `brew services list` (MacOS) or `service postgresql status` (Linux)
- Check your `.env` file has the correct credentials
- Make sure the database exists: `psql -l` (list all databases)

### Server Startup Issues

- Check for errors in the console
- Verify the PORT is not in use by another application
- Check if your Node.js version is compatible (v20+ recommended)

### Frontend Issues

- Check the browser console for errors
- Verify network requests are working properly in the Network tab
- Clear browser cache if necessary

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [TanStack React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)