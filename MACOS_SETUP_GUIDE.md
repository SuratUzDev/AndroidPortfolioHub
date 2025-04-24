# macOS Setup Guide for Android Portfolio Hub

This is a quick reference guide for setting up the Android Portfolio Hub on macOS. For more detailed instructions, refer to `LOCAL_DEVELOPMENT_GUIDE.md`.

## Quick Start Steps

### 1. Install Prerequisites

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15
```

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd AndroidPortfolioHub

# Install dependencies
npm install
```

### 3. Set Up the Database

```bash
# Create a PostgreSQL database
createdb android_portfolio_hub

# Create a .env file
cat > .env << EOL
DATABASE_URL=postgres://localhost:5432/android_portfolio_hub
PGHOST=localhost
PGUSER=$(whoami)
PGPASSWORD=
PGDATABASE=android_portfolio_hub
PGPORT=5432
EOL

# Edit the .env file to add your PostgreSQL password if needed
nano .env
```

### 4. Initialize Database and Sample Data

```bash
# Make the setup script executable
chmod +x setup-local-db.js

# Run the setup script
node setup-local-db.js
```

### 5. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5000`.

## Common Issues and Solutions

### PostgreSQL Connection Failed

If you have issues connecting to PostgreSQL:

```bash
# Check if PostgreSQL is running
brew services list

# If not running, start it
brew services start postgresql@15

# Check if you can connect to PostgreSQL
psql -d android_portfolio_hub

# If you get an authentication error, you may need to set up a password
psql postgres
\password
# Follow prompts to set a password
# Then update your .env file with this password
```

### Port Already in Use

If port 5000 is already in use:

```bash
# Find the process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Alternatively, you can modify the server to use a different port
# Edit server/index.ts and change the port number
```

### Database Schema Issues

If you need to reset the database schema:

```bash
# Drop the database
dropdb android_portfolio_hub

# Recreate the database
createdb android_portfolio_hub

# Run the setup script again
node setup-local-db.js
```

## Development Environment

For the best development experience, we recommend:

- **Editor**: Visual Studio Code with TypeScript and ESLint extensions
- **Database Tool**: TablePlus or pgAdmin for PostgreSQL management
- **API Testing**: Postman or Insomnia for testing API endpoints

## Additional Resources

For more detailed setup and troubleshooting:
- Full local development guide: `LOCAL_DEVELOPMENT_GUIDE.md`
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Node.js documentation: https://nodejs.org/en/docs/