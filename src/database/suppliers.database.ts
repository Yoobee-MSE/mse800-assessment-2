import { Supplier } from '@prisma/client';
import prisma from './client';

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

export const updateSupplier = async (
  id: number,
  data: Supplier,
): Promise<Supplier | null> => {
  try {
    return await prisma.supplier.update({
      where: { id: id },
      data: data,
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return null;
  }
}

export const deleteSupplier = async (id: number) => {
    return prisma.user.delete({
        where: {
          id,
        },
      });
    };
