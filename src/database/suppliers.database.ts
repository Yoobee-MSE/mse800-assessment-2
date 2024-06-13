import { PrismaClient, Supplier } from '@prisma/client';

const prisma = new PrismaClient();

export type SupplierCreateData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;

export const createSupplier = async (supplier: SupplierCreateData): Promise<Supplier> => {
  return prisma.supplier.create({
    data: supplier,
  });
};

export const getSupplierById = async (id: number): Promise<Supplier | null> => {
    return prisma.supplier.findUnique({
        where: {
            id,
        },
    });
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  return prisma.supplier.findMany();
};

/*export const updateSupplier = async (id: number, supplier: SupplierCreateData): Promise<Supplier> => {
  return prisma.supplier.update({
      where: {
        id,
      },
      data: supplier,
    });
};*/

export const updateSupplier = async (
  id: number,
  data: Supplier,
): Promise<Supplier | null> => {
  return prisma.supplier.update({
    where: { id: id },
    data: data,
  });
}

export const deleteSupplier = async (id: number) => {
    return prisma.user.delete({
        where: {
          id,
        },
      });
    };

