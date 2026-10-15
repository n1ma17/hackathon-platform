import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createPrismaClient } from './lib/database/create-prisma-client.js';

const prisma = createPrismaClient();

export const auth = betterAuth({
  appName: 'hackathon-platform',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'PARTICIPANT',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: 'PARTICIPANT',
          },
        }),
      },
    },
  },
});
