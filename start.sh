#!/bin/bash

# EL Saraya QR Menu - Complete Application Starter
# This script starts the database, backend, and frontend servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[SARAYA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid
        sleep 2
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down EL Saraya QR Menu..."
    
    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        print_info "Stopping backend server..."
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        print_info "Stopping frontend server..."
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$DB_STUDIO_PID" ]; then
        print_info "Stopping database studio..."
        kill $DB_STUDIO_PID 2>/dev/null
    fi
    
    # Kill any remaining processes
    kill_port 3001  # Backend
    kill_port 3003  # Frontend
    kill_port 5555  # Prisma Studio
    
    print_success "EL Saraya QR Menu stopped successfully!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main script starts here
clear
print_status "🚀 Starting EL Saraya QR Menu System..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the saraya-qr-menu root directory"
    exit 1
fi

# Navigate to the correct directory if needed
if [ -d "saraya-qr-menu" ]; then
    cd saraya-qr-menu
fi

print_status "📋 Pre-flight checks..."

# Check if backend directory exists
if [ ! -d "backend" ]; then
    print_error "Backend directory not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    print_error "Frontend directory not found!"
    exit 1
fi

print_success "✅ Directory structure verified"

# Kill any existing processes on our ports
print_status "🧹 Cleaning up existing processes..."
kill_port 3001
kill_port 3003
kill_port 5555

print_success "✅ Ports cleared"

# Check if dependencies are installed
print_status "📦 Checking dependencies..."

if [ ! -d "backend/node_modules" ]; then
    print_warning "Backend dependencies not found. Installing..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not found. Installing..."
    cd frontend && npm install && cd ..
fi

print_success "✅ Dependencies verified"

# Generate Prisma client
print_status "🗃️  Setting up database..."
cd backend
npx prisma generate >/dev/null 2>&1
print_success "✅ Database schema generated"
cd ..

# Start Database Studio (optional)
print_status "🗄️  Starting Prisma Studio (Database GUI)..."
cd backend
npx prisma studio &
DB_STUDIO_PID=$!
cd ..
sleep 3
print_success "✅ Database Studio running on http://localhost:5555"

# Start Backend Server
print_status "⚡ Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_info "Waiting for backend to initialize..."
sleep 5

# Check if backend started successfully
if check_port 3001; then
    print_success "✅ Backend server running on http://localhost:3001"
else
    print_error "❌ Backend server failed to start"
    cleanup
fi

# Start Frontend Server
print_status "🎨 Starting frontend application..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_info "Waiting for frontend to initialize..."
sleep 8

# Check if frontend started successfully
if check_port 3003; then
    print_success "✅ Frontend application running on http://localhost:3003"
else
    print_error "❌ Frontend application failed to start"
    cleanup
fi

# Display success message and URLs
echo ""
print_success "🎉 EL Saraya QR Menu System is now running!"
echo ""
echo -e "${PURPLE}📱 Application URLs:${NC}"
echo -e "   ${CYAN}• Public Menu:${NC}     http://localhost:3003"
echo -e "   ${CYAN}• Admin Panel:${NC}     http://localhost:3003/admin"
echo -e "   ${CYAN}• API Backend:${NC}     http://localhost:3001"
echo -e "   ${CYAN}• Database Studio:${NC} http://localhost:5555"
echo ""
echo -e "${PURPLE}👤 Default Login Credentials:${NC}"
echo -e "   ${CYAN}• Email:${NC}    admin@saraya.com"
echo -e "   ${CYAN}• Password:${NC} admin123"
echo ""
echo -e "   ${CYAN}• Email:${NC}    tahasinger@saraya.com"
echo -e "   ${CYAN}• Password:${NC} 01093463235"
echo ""
echo -e "${PURPLE}📊 System Status:${NC}"
echo -e "   ${GREEN}• Backend:${NC}  Running (Port 3001)"
echo -e "   ${GREEN}• Frontend:${NC} Running (Port 3003)"
echo -e "   ${GREEN}• Database:${NC} Studio available (Port 5555)"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Press ${CYAN}Ctrl+C${NC} to stop all services"
echo -e "   • Check terminal output for any error messages"
echo -e "   • Use the admin panel to manage products and categories"
echo ""
print_status "🔄 System ready! Monitoring services..."
echo ""

# Keep script running and monitor processes
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died unexpectedly!"
        cleanup
    fi
    
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died unexpectedly!"
        cleanup
    fi
    
    # Wait before next check
    sleep 10
done