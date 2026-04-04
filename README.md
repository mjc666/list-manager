# List Manager

A simple web application to manage lists and their items, built with Next.js and MySQL.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, React 19)
- [Tailwind CSS](https://tailwindcss.com) (v4)
- [MySQL](https://www.mysql.com) (Database)
- [Lucide React](https://lucide.dev) (Icons)

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [MySQL](https://www.mysql.com/)

## Getting Started

1. **Database Setup**
   Run the provided `schema.sql` script to set up your MySQL database:
   ```bash
   mysql -u <username> -p < schema.sql
   ```

2. **Environment Configuration**
   Copy `.env.local.example` to `.env.local` and configure your database connection:
   ```env
   DATABASE_URL=mysql://<user>:<password>@localhost:3306/list_manager
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Production Deployment

To deploy in a production environment:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Set Environment Variables**
   Ensure all production environment variables (e.g., `DATABASE_URL`) are configured in your hosting environment.

3. **Start the Production Server**
   ```bash
   npm run start
   ```

The application will run on port 3000 by default. Use a process manager like **PM2** to keep the server running:
```bash
npx pm2 start npm --name "list-manager" -- start
```
