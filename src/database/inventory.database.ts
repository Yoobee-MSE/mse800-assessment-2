import { Car, Supplier, Warehouse } from '@prisma/client';
import prisma from './client';

type createInventoryInput = Omit<Car, 'id'>;
export const createInventory = async (
	  data: createInventoryInput,
): Promise<Car> => {
  return prisma.car.create({
    data: data,
  });
};

export type CarDetails = Car & {
  warehouse: Warehouse;
  supplier: Supplier;
}

export const getAllInventory = async (): Promise<Car[]> => {
	  return prisma.car.findMany({include: {supplier: true, warehouse: true}});
}

export const getInventoryByVin = async (vin : string): Promise<Car | null> => {
	  return prisma.car.findUnique({
	    where: { vin: vin },
			include: {supplier: true, warehouse: true}
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

export const updateUser = async (vin: string, data: Car,): Promise<Car> => {
  return prisma.car.update({
    where: {
      vin: vin,
    },
    data: data
  });
};

export const deleteInventory = async (id: string): Promise<any> => {
  const user = await getInventoryByVin(id);

  if (user) {
    return prisma.car.delete({
      where: {
        id: user.id,
      },
    });
  }
};
