# Saraya QR Menu - Application Startup Guide

## Quick Start

The easiest way to start the application is using one of the automated startup methods:

### Method 1: Node.js Startup Script (Recommended)
```bash
npm run start-app
```

### Method 2: Shell Script (macOS/Linux)
```bash
npm run start-app:shell
# or directly:
./start-app.sh
```

### Method 3: Batch File (Windows)
```bash
npm run start-app:win
# or directly:
start-app.bat
```

## What the Startup Scripts Do

1. **Port Cleanup**: Automatically kills any processes running on ports 3001 and 3003
2. **Environment Setup**: Sets proper CORS origins and environment variables
3. **Dependency Check**: Ensures all dependencies are installed
4. **Server Launch**: Starts both backend (port 3001) and frontend (port 3003) concurrently

## Manual Startup (Alternative)

If you prefer to start manually:

### 1. Clean up ports
```bash
# Kill processes on ports 3001 and 3003
npm run kill-ports

# Or manually:
lsof -ti:3001 | xargs -r kill -9
lsof -ti:3003 | xargs -r kill -9
```

### 2. Start the application
```bash
# Start both servers with proper CORS configuration
npm run dev
```

## Application URLs

- **Frontend (Customer Menu)**: http://localhost:3003
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:3003/admin/login
- **API Health Check**: http://localhost:3001/api/v1/health

## Default Admin Credentials

- **Email**: admin@saraya.com
- **Password**: admin123

## Environment Variables

The startup scripts automatically set these environment variables:

```bash
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003"
NODE_ENV="development"
PORT="3001"
```

## Troubleshooting

### Port Already in Use
If you get port errors, the startup scripts should handle this automatically. If not:
```bash
npm run kill-ports
```

### CORS Issues
Ensure the backend is started with proper CORS origins. The startup scripts set this automatically.

### Dependencies Missing
```bash
npm run install:all
```

### Database Issues
```bash
# Reset and seed the database
npm run db:reset
npm run db:seed
```

## Development Workflow

1. Run `npm run start-app` to start the application
2. Open http://localhost:3003 for the customer menu
3. Open http://localhost:3003/admin/login for the admin panel
4. Use Ctrl+C to stop both servers

The startup script handles cleanup automatically when you stop the application.

## Available NPM Scripts

- `npm run start-app` - Start application with Node.js script
- `npm run start-app:shell` - Start with shell script (macOS/Linux)  
- `npm run start-app:win` - Start with batch file (Windows)
- `npm run dev` - Start servers with concurrently
- `npm run kill-ports` - Kill processes on ports 3001 and 3003
- `npm run install:all` - Install all dependencies
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio for database management