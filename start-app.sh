#!/bin/bash

# Saraya QR Menu - Complete Startup Script
# This script kills any processes on ports 3001 and 3003, then starts both servers

echo "🚀 Starting Saraya QR Menu Application..."
echo "================================================"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    echo "🔍 Checking for processes on port $port..."
    
    # Find and kill processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "⚠️  Killing existing processes on port $port: $pids"
        kill -9 $pids 2>/dev/null
        sleep 2
        
        # Double check if processes are killed
        local remaining_pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$remaining_pids" ]; then
            echo "❌ Failed to kill some processes on port $port: $remaining_pids"
            echo "   Please manually kill these processes and try again"
            exit 1
        else
            echo "✅ Successfully cleared port $port"
        fi
    else
        echo "✅ Port $port is already free"
    fi
}

# Kill any existing Node.js/Next.js processes that might be running
echo "🧹 Cleaning up existing Node.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "node.*3003" 2>/dev/null || true
sleep 2

# Kill processes on specific ports
kill_port 3001
kill_port 3003

echo ""
echo "🔧 Setting up environment..."

# Ensure we're in the correct directory
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in $SCRIPT_DIR"
    echo "   Please run this script from the saraya-qr-menu root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Set environment variables for CORS
export CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003"
export NODE_ENV="development"
export PORT="3001"

echo ""
echo "🌟 Starting servers..."
echo "📡 Backend will run on: http://localhost:3001"
echo "🖥️  Frontend will run on: http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"

# Start both servers using concurrently
npm run dev

# If npm run dev fails, try starting manually
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  npm run dev failed, trying manual startup..."
    
    # Start backend in background
    echo "🔧 Starting backend server..."
    cd backend
    CORS_ORIGINS="$CORS_ORIGINS" npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    echo "🔧 Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Function to cleanup on exit
    cleanup() {
        echo ""
        echo "🛑 Shutting down servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        kill_port 3001
        kill_port 3003
        echo "✅ Cleanup complete"
        exit 0
    }
    
    # Set trap to cleanup on script exit
    trap cleanup SIGINT SIGTERM EXIT
    
    echo "✅ Servers started manually"
    echo "   Backend PID: $BACKEND_PID"
    echo "   Frontend PID: $FRONTEND_PID"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Wait for user to stop
    wait
fi