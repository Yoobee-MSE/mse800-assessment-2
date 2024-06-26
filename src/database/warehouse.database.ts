import { Warehouse } from '@prisma/client';
import prisma from './client';

export const getWarehouses = async (): Promise<Warehouse[]> => {
  return prisma.warehouse.findMany();
}

export const createWarehouse = async (name: string, location: string, capacity: number): Promise<Warehouse> => {
  return prisma.warehouse.create({
    data: {
      name,
      location,
      capacity
    },
  });
};

export const getWarehouseById = async (id: number): Promise<Warehouse | null> => {
  return prisma.warehouse.findUnique({
    where: {
      id
    },
  });
};


export const updateWarehouse = async (id: number, name: string, location: string, capacity: number): Promise<Warehouse> => {
  return prisma.warehouse.update({
    where: {
      id: id,
    },
    data: {
      name,
      location,
      capacity
    },
  });
};

export const deleteWarehouse = async (id: number): Promise<any> => {
  const order = await getWarehouseById(id);

  if (order) {
    return prisma.warehouse.delete({
      where: {
        id: order.id,
      },
    });
  }
};
