import { sha256 } from 'js-sha256';
// src/services/create-admin.ts
import { PrismaClient, UserRole } from '@prisma/client';


const prisma = new PrismaClient();

export const createAdminUser = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'securepassword';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await sha256(adminPassword);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    return { message: `Admin user created: ${admin.email}` };
  } else {
    return { message: 'Admin user already exists' };
  }
};
