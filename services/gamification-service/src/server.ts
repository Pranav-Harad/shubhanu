import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { startKafkaConsumer, stopKafkaConsumer } from './kafka/consumer.js';

dotenv.config();

const prisma = new PrismaClient();
const port = process.env.PORT ? parseInt(process.env.PORT) : 5002;

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

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// healthcheck
fastify.get('/health', async () => {
  return { status: 'healthy', service: 'gamification-service', timestamp: new Date() };
});

// Fetch child badges endpoint
fastify.get('/api/v1/gamification/:childId/badges', async (request, reply) => {
  const { childId } = request.params as { childId: string };

  try {
    const badges = await prisma.badge.findMany({
      where: { childId },
      orderBy: { unlockedAt: 'desc' },
    });

    const progress = await prisma.childProgress.findUnique({
      where: { childId },
    });

    return reply.status(200).send({
      childId,
      progress: progress || { totalXp: 0, streakDays: 0, storyGems: 0 },
      badges,
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to retrieve achievements log.',
    });
  }
});

// Bootstrapper config
const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Gamification Service successfully listening on http://localhost:${port}`);
    
    // Asynchronously connect to Kafka event bus
    startKafkaConsumer();
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shut down binds
const gracefulShutdown = async () => {
  console.log('🛑 Shutting down microservice gracefully...');
  await stopKafkaConsumer();
  await fastify.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
