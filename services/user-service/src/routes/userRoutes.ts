import { FastifyInstance } from 'fastify';
import {
  createChildHandler,
  listChildrenHandler,
  getChildHandler,
  updateParentSettingsHandler
} from '../controllers/userController.js';

export default async function userRoutes(fastify: FastifyInstance) {
  // Add authentication hook check to all endpoints
  fastify.addHook('onRequest', fastify.authenticate);

  // Child Endpoints
  fastify.post('/api/v1/children', createChildHandler);
  fastify.get('/api/v1/children', listChildrenHandler);
  fastify.get('/api/v1/children/:id', getChildHandler);

  // Parent Settings Endpoints
  fastify.put('/api/v1/parent/settings', updateParentSettingsHandler);
}
