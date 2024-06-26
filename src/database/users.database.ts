// src/services/userService.ts
import { User, UserRole } from '@prisma/client';
import { sha256 } from 'js-sha256';
import prisma from './client';


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

export const updateUser = async (id: number, email: string, password: string, role: UserRole): Promise<User> => {
  const encryptedPassword = sha256(password);
  return prisma.user.update({
    where: {
      id: id,
    },
    data: {
      email,
      password: encryptedPassword,
      role
    },
  });
};

export const deleteUser = async (id: number): Promise<any> => {
  const user = await getUserById(id);

  if (user) {
    return prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
};
