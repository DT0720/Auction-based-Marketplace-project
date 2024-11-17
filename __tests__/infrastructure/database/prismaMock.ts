import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from "@/infrastructure/database/prisma";

const prismaMock = mockDeep<typeof prisma>();

export const mockedPrisma = prismaMock as DeepMockProxy<typeof prisma>;

jest.mock('@/infrastructure/database/prisma', () => prismaMock);

export default prismaMock;