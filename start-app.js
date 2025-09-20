#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const os = require('os');

console.log('🚀 Starting Saraya QR Menu Application...');
console.log('================================================');

// Function to kill processes on a port
function killPort(port) {
  return new Promise((resolve) => {
    const isWindows = os.platform() === 'win32';
    
    if (isWindows) {
      exec(`for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}"') do taskkill /f /pid %a`, (error) => {
        console.log(`✅ Port ${port} cleared`);
        resolve();
      });
    } else {
      exec(`lsof -ti:${port} | xargs -r kill -9`, (error) => {
        console.log(`✅ Port ${port} cleared`);
        resolve();
      });
    }
  });
}

// Function to start the application
async function startApp() {
  console.log('🧹 Cleaning up existing processes...');
  
  // Kill existing processes
  await killPort(3001);
  await killPort(3003);
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔧 Setting up environment...');
  
  // Set environment variables
  process.env.CORS_ORIGINS = 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003';
  process.env.NODE_ENV = 'development';
  process.env.PORT = '3001';
  
  console.log('🌟 Starting servers...');
  console.log('📡 Backend will run on: http://localhost:3001');
  console.log('🖥️  Frontend will run on: http://localhost:3003');
  console.log('');
  console.log('Press Ctrl+C to stop both servers');
  console.log('================================================');
  
  // Start the dev command
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down servers...');
    devProcess.kill('SIGTERM');
    await killPort(3001);
    await killPort(3003);
    console.log('✅ Cleanup complete');
    process.exit(0);
  });
  
  devProcess.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
  });
}

startApp().catch(console.error);