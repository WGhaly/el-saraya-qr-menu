#!/bin/bash

# Quick Development Starter for EL Saraya QR Menu
# This script provides a fast way to start development servers

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 EL Saraya QR Menu - Quick Dev Start${NC}"
echo ""

# Kill existing processes
echo -e "${YELLOW}🧹 Cleaning existing processes...${NC}"
lsof -ti:3001 | xargs -r kill -9 2>/dev/null
lsof -ti:3003 | xargs -r kill -9 2>/dev/null  
lsof -ti:5555 | xargs -r kill -9 2>/dev/null

# Start the development servers
echo -e "${GREEN}⚡ Starting development servers...${NC}"
echo ""

# Use the npm script that starts everything with concurrently
npm run start:dev

echo -e "${GREEN}✅ Development servers started!${NC}"