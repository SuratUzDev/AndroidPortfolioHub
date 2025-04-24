#!/usr/bin/env node

/**
 * This script helps set up a local database for development.
 * It creates the database schema and populates it with sample data.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file...');
    
    const envContent = `DATABASE_URL=postgres://localhost:5432/android_portfolio_hub
PGHOST=localhost
PGUSER=
PGPASSWORD=
PGDATABASE=android_portfolio_hub
PGPORT=5432
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('Created .env file. Please edit it with your PostgreSQL credentials.');
  } else {
    console.log('.env file already exists.');
  }
}

// Run database migrations
function runMigrations() {
  console.log('Running database migrations...');
  
  exec('npm run db:push', (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Migration stderr: ${stderr}`);
      return;
    }
    
    console.log(`Migration stdout: ${stdout}`);
    console.log('Database migrations completed successfully.');
    
    createSampleData();
  });
}

// Create sample data
function createSampleData() {
  console.log('Creating sample data...');
  
  exec('node -e "require(\'./server/mock-migration\').createSampleData().then(() => console.log(\'Sample data created successfully.\'))"', 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Sample data error: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`Sample data stderr: ${stderr}`);
        return;
      }
      
      console.log(`Sample data stdout: ${stdout}`);
      console.log('Setup completed successfully!');
      console.log('\nYou can now run the application with:');
      console.log('npm run dev');
    }
  );
}

// Main execution
console.log('Setting up local database for Android Portfolio Hub...');
createEnvFile();
runMigrations();