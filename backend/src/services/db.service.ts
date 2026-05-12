import { PrismaClient } from '@prisma/client';
import { ResumeData } from '../../../shared/schema';

const prisma = new PrismaClient();

export class DbService {
  static async saveResume(userId: string, data: ResumeData) {
    return prisma.resume.create({
      data: {
        userId,
        data: data as any
      }
    });
  }
}