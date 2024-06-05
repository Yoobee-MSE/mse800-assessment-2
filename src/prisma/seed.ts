// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import { sha256 } from 'js-sha256';


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await sha256('123456')
  // Create an initial admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword, // Ideally, hash this password before storing it
      role: UserRole.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
