// src/services/userService.ts
import { PrismaClient, User, UserRole } from '@prisma/client';
import { sha256 } from 'js-sha256';

const prisma = new PrismaClient();


export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
}

export const createUser = async (email: string, password: string, role: UserRole): Promise<User> => {
  const encryptedPassword = sha256(password);
  return prisma.user.create({
    data: {
      email,
      password: encryptedPassword,
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
