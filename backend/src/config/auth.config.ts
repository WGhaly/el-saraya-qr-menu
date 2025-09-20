export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'saraya_jwt_secret_key_2024_very_secure_random_string_here',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'saraya_refresh_secret_key_2024_very_secure_random_string_here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};