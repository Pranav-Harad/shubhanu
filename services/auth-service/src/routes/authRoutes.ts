import { FastifyInstance } from 'fastify';
import { registerHandler, loginHandler } from '../controllers/authController.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/v1/auth/register', registerHandler);
  fastify.post('/api/v1/auth/login', loginHandler);
}
