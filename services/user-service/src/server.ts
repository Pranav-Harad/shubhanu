import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 5001;
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

// Decrypt and validate JWT tokens for restricted endpoints
fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized', message: 'Token authentication validation failed.' });
  }
});

// Declare custom property extensions inside Fastify Typings
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

// Health Check API
fastify.get('/health', async () => {
  return { status: 'healthy', service: 'user-service', timestamp: new Date() };
});

// Bind Routing Controllers
await fastify.register(userRoutes);

const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 User Profile Service successfully listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
