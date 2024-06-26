import { Car } from '@prisma/client';

import prisma from './client';

type createInventoryInput = Omit<Car, 'id'>;
export const createInventory = async (
	  data: createInventoryInput,
): Promise<Car> => {
  return prisma.car.create({
    data: data,
  });
};

export const getAllInventory = async (): Promise<Car[]> => {
	  return prisma.car.findMany();
}

export const getInventoryByVin = async (vin : string): Promise<Car | null> => {
	  return prisma.car.findUnique({
	    where: { vin: vin },
	  });
}

export const deleteInventory = async (vin : string): Promise<Car | null> => {
	  return prisma.car.delete({
	    where: { vin: vin },
	  });
}

export const updateInventory = async (
	  vin: string,
	  data: Car,
): Promise<Car | null> => {
	  return prisma.car.update({
	    where: { vin: vin },
	    data: data,
	  });
}