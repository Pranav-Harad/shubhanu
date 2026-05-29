import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Typing declarations
interface AuthenticatedUser {
  parentId: string;
  email: string;
}

interface CreateChildBody {
  name?: string;
  dateOfBirth?: string; // "YYYY-MM-DD"
}

interface UpdateSettingsBody {
  screenLimitMinutes?: number;
  isBedtimeLocked?: boolean;
}

// Age Group Calculator Helper
const calculateAgeGroup = (dobString: string): string => {
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age >= 12) return '12-14';
  if (age >= 8) return '8-11';
  return '5-7'; // Default base age bracket
};

export const createChildHandler = async (
  request: FastifyRequest<{ Body: CreateChildBody }>,
  reply: FastifyReply
) => {
  const user = request.user as AuthenticatedUser;
  const { name, dateOfBirth } = request.body;

  if (!name || !dateOfBirth) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Both child name and date of birth fields are required.',
    });
  }

  try {
    // 1. Ensure ParentSettings records exist for this parent ID
    let parentSettings = await prisma.parentSettings.findUnique({
      where: { id: user.parentId },
    });

    if (!parentSettings) {
      parentSettings = await prisma.parentSettings.create({
        data: { id: user.parentId },
      });
    }

    // 2. Classify child age groups automatically
    const ageGroup = calculateAgeGroup(dateOfBirth);

    // 3. Create Child record
    const child = await prisma.child.create({
      data: {
        parentId: user.parentId,
        name,
        dateOfBirth: new Date(dateOfBirth),
        ageGroup,
        avatarUrls: [], // Starts empty until SAM2/DreamBooth pipeline fires!
      },
    });

    return reply.status(201).send({
      message: 'Child profile created successfully',
      child,
    });
  } catch (err) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to write child profile record.',
    });
  }
};

export const listChildrenHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as AuthenticatedUser;

  try {
    const children = await prisma.child.findMany({
      where: { parentId: user.parentId },
    });

    return reply.status(200).send({ children });
  } catch (err) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to retrieve child lists.',
    });
  }
};

export const getChildHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const user = request.user as AuthenticatedUser;
  const childId = request.params.id;

  try {
    const child = await prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Child profile does not exist.',
      });
    }

    // Security compliance check: parent must own the child record!
    if (child.parentId !== user.parentId) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Access denied. You do not own this child profile.',
      });
    }

    return reply.status(200).send({ child });
  } catch (err) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to retrieve child data.',
    });
  }
};

export const updateParentSettingsHandler = async (
  request: FastifyRequest<{ Body: UpdateSettingsBody }>,
  reply: FastifyReply
) => {
  const user = request.user as AuthenticatedUser;
  const { screenLimitMinutes, isBedtimeLocked } = request.body;

  try {
    // Upsert ParentSettings
    const settings = await prisma.parentSettings.upsert({
      where: { id: user.parentId },
      update: {
        ...(screenLimitMinutes !== undefined && { screenLimitMinutes }),
        ...(isBedtimeLocked !== undefined && { isBedtimeLocked }),
      },
      create: {
        id: user.parentId,
        ...(screenLimitMinutes !== undefined && { screenLimitMinutes }),
        ...(isBedtimeLocked !== undefined && { isBedtimeLocked }),
      },
    });

    return reply.status(200).send({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (err) {
    request.server.log.error(err);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to update parent settings.',
    });
  }
};
