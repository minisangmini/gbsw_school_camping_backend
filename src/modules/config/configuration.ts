export default () => ({
  port: parseInt(process.env.PORT, 10) | 3000,
  DATABASE_HOST: process.env.DB_HOST,
  DATABASE_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DATABASE_USERNAME: process.env.DB_USERNAME,
  DATABASE_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_SCHEMA: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET
});
