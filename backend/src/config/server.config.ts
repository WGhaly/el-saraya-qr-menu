export const serverConfig = {
  port: parseInt(process.env.PORT || '3001'),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003').split(','),
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
};