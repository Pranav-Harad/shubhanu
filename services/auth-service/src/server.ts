import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_dev_mode';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register Plugins
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

await fastify.register(jwt, {
  secret: jwtSecret,
});

// Root Healthcheck API for EKS/Kong
fastify.get('/health', async () => {
  return { status: 'healthy', service: 'auth-service', timestamp: new Date() };
});

// Bind Routing Modules
await fastify.register(authRoutes);

// Graceful Shutdown configurations
const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Auth Service successfully listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
