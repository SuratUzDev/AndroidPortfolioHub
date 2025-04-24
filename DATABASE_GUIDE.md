# PostgreSQL Database Guide for Portfolio Application

This guide provides detailed information about the PostgreSQL database setup for your portfolio application.

## Database Configuration

Your application is configured to use a PostgreSQL database. The connection details are stored in the `DATABASE_URL` environment variable which follows this format:

```
postgresql://<username>:<password>@<host>:<port>/<database>
```

In the Replit environment, this is automatically configured for you.

## Database Schema

The database consists of the following tables:

1. `apps` - Stores Android application information
2. `blog_posts` - Stores blog content
3. `code_samples` - Stores code examples
4. `contact_messages` - Stores messages from the contact form
5. `github_repos` - Stores GitHub repository information
6. `profiles` - Stores user profile information
7. `users` - Stores user authentication data

### Table Structures

#### Blog Posts Table

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | integer | Primary key |
| title | text | Blog post title |
| slug | text | URL-friendly version of the title |
| excerpt | text | Short summary of the post |
| content | text | Main content of the post |
| cover_image_url | text | URL to the cover image |
| published_at | text | Publication date |
| author | text | Author name |
| tags | ARRAY | Array of tags for categorization |
| is_featured | boolean | Whether the post is featured on the blog page |

#### Apps Table

The `apps` table stores information about Android applications including title, description, features, screenshots, and Google Play store links.

#### GitHub Repos Table

The `github_repos` table stores information about open-source GitHub repositories including name, description, programming languages used, and repository URL.

#### Code Samples Table

The `code_samples` table stores code examples including title, language, description, and the code itself.

#### Profiles Table

The `profiles` table stores user profile information including personal details, work experience, education history, skills, and social media links.

## Accessing the Database

### Using SQL in Replit

You can execute SQL queries directly in the Replit environment using the built-in tools.

### Common Queries

#### View All Blog Posts
```sql
SELECT * FROM blog_posts;
```

#### Get Featured Blog Post
```sql
SELECT * FROM blog_posts WHERE is_featured = true;
```

#### Count Posts by Tag
```sql
SELECT unnest(tags) as tag, COUNT(*) 
FROM blog_posts 
GROUP BY tag 
ORDER BY COUNT(*) DESC;
```

#### View Applications
```sql
SELECT * FROM apps;
```

#### View GitHub Repositories
```sql
SELECT * FROM github_repos;
```

#### View Code Samples
```sql
SELECT * FROM code_samples;
```

#### View User Profile
```sql
SELECT * FROM profiles;
```

## Database Management

### Creating Database Backups

You can create a backup of your database with:

```bash
pg_dump -U <username> -d <database_name> -h <host> -F c -f backup.dump
```

### Restoring Database Backups

Restore from a backup file with:

```bash
pg_restore -U <username> -d <database_name> -h <host> -F c backup.dump
```

### Database Migration

The application uses Drizzle ORM for database migrations. To apply schema changes:

```bash
npm run db:push
```

This command updates the database schema according to the definitions in `shared/schema.ts`.

## Troubleshooting PostgreSQL

### Check Database Connection

```bash
psql -U <username> -d <database_name> -h <host> -c "SELECT 1;"
```

If this returns `1`, your connection is working.

### Check Table Existence

```bash
psql -U <username> -d <database_name> -h <host> -c "\dt"
```

This will list all tables in the database.

### Common Errors

1. **Connection Refused**
   - Ensure PostgreSQL is running
   - Check that the host and port are correct
   - Verify network connectivity to the database server

2. **Authentication Failed**
   - Check username and password in the DATABASE_URL
   - Ensure the user has access to the specified database

3. **Relation Does Not Exist**
   - Run database migrations with `npm run db:push`
   - Check that the table name is correct in your query

## Local Development with PostgreSQL

### Installing PostgreSQL Locally

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Follow the installation instructions for your operating system
3. Create a new database for your application

### Connecting to Local PostgreSQL

Update your `.env` file with the local connection string:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
```

Replace `postgres`, `password`, and `portfolio` with your PostgreSQL username, password, and database name.

### Running Migrations Locally

Execute the database migration command to create the necessary tables:

```bash
npm run db:push
```

This command will use the schema defined in `shared/schema.ts` to create all required tables in your local PostgreSQL database.