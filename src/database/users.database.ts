// src/services/userService.ts
import { PrismaClient, User, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (email: string, password: string, role: UserRole): Promise<User> => {
  return prisma.user.create({
    data: {
      email,
      password,
      role,
    },
  });
};

export const getUserById = async (userId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const updateUser = async (userId: number, email: string): Promise<User> => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
    },
  });
};

export const deleteUser = async (userId: number): Promise<User> => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
