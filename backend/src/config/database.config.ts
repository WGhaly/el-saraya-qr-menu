import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://saraya_admin:saraya_password_2024@localhost:5432/saraya_menu_db',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
};