import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Types for request bodies
interface RegisterBody {
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

export const registerHandler = async (
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  // 1. Basic validation checks
  if (!email || !password) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Both email and password fields are required parameters.',
    });
  }

  if (password.length < 6) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Password must consist of at least 6 characters.',
    });
  }

  try {
    // 2. Check if user already exists
    const existingParent = await prisma.parent.findUnique({
      where: { email },
    });

    if (existingParent) {
      return reply.status(409).send({
        error: 'Conflict',
        message: 'A parent account with this email address already exists.',
      });
    }

    // 3. Salt and Hash password (using 10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create new Parent record in PostgreSQL
    const newParent = await prisma.parent.create({
      data: {
        email,
        passwordHash,
      },
    });

    // 5. Generate secure JWT token payload
    const token = request.server.jwt.sign({
      parentId: newParent.id,
      email: newParent.email,
    });

    // 6. Return response (omit passwordHash for security compliance)
    return reply.status(201).send({
      message: 'Parent registered successfully',
      token,
      parent: {
        id: newParent.id,
        email: newParent.email,
        createdAt: newParent.createdAt,
      },
    });
  } catch (err: any) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An error occurred during transaction logging.',
    });
  }
};

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Both email and password are required fields.',
    });
  }

  try {
    // 1. Fetch user by email
    const parent = await prisma.parent.findUnique({
      where: { email },
    });

    if (!parent) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid email address or credential password.',
      });
    }

    // 2. Validate password hashes
    const passwordValid = await bcrypt.compare(password, parent.passwordHash);

    if (!passwordValid) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid email address or credential password.',
      });
    }

    // 3. Sign token payload
    const token = request.server.jwt.sign({
      parentId: parent.id,
      email: parent.email,
    });

    // 4. Emmit token response
    return reply.status(200).send({
      message: 'Authentication successful',
      token,
      parent: {
        id: parent.id,
        email: parent.email,
      },
    });
  } catch (err: any) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An error occurred during account login validation.',
    });
  }
};
