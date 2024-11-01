# ThoughtCrafter-Blogging
## This is a Medium-inspired project built with the following stack:

### Frontend: React
### Backend: Cloudflare Workers (using Hono framework)
### Validation: Zod (for validation and type inference)
### Language: TypeScript
### ORM: Prisma with connection pooling
### Database: PostgreSQL (Neon DB connection pool URL via Prisma Accelerate)
### Authentication: JWT
## Project Setup
# 1. Initialize the Project
Create a new folder for the project:
mkdir medium
cd medium
Set up a Hono-based Cloudflare Worker app for the backend:
npm create hono-app

# 3. Database Configuration
Obtain the connection URL from Neon DB for PostgreSQL.
Configure Prisma with a connection pool URL from Prisma Accelerate.
# 4. Environment Variables
Replace DATABASE_URL in the .env file with the connection URL.
Set the DATABASE_URL as the connection pool URL in wrangler.toml:
vars = { DATABASE_URL = "your_database_url" }
# 5. Prisma Setup
Initialize Prisma schema, migrate the database, and generate the Prisma client with JWT authorization:
npx prisma init
npx prisma migrate dev
npx prisma generate
# 6. Deployment
Log in to the Cloudflare CLI:
npx wrangler login

## Deploy the app:
npm run deploy

# 7. Shared Module (Common)
Create a common folder for shared types, validation, and utilities required by both frontend and backend.
Configure common as an independent npm module for easy access from both environments.

## Getting Started
### Prerequisites
### Node.js installed.
### Cloudflare CLI and account (for deployment).
### PostgreSQL database (Neon DB recommended for connection pooling).

# Running Locally
Clone the repository:
git clone https://github.com/Manisha01407/ThoughtCrafer-blogging.git
### Install dependencies:
npm install
### Start the development server:
npm run dev
