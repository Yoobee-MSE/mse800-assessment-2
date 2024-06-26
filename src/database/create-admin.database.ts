import { sha256 } from 'js-sha256';
import { UserRole } from '@prisma/client';
import prisma from './client';

export const createAdminUser = async () => {
  const adminEmail = 'jose@gmail.com';
  const adminPassword = '123456';

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
