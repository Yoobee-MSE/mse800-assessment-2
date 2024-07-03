import { Car, Supplier, Warehouse } from '@prisma/client';
import prisma from './client';

type createInventoryInput = Omit<Car, 'id'>;
export const createInventory = async (data: createInventoryInput): Promise<Car> => {
  console.log("🚀 ~ createInventory ~ data:", data)
  return prisma.car.create({
    data: data,
  });
};

export type CarDetails = Car & {
  warehouse: Warehouse;
  supplier: Supplier;
}

export const getAllInventory = async (): Promise<Car[]> => {
  return prisma.car.findMany({ include: { supplier: true, warehouse: true } });
}

export const getInventoryByVin = async (vin: string): Promise<Car | null> => {
  return prisma.car.findUnique({
    where: { vin: vin },
    include: { supplier: true, warehouse: true }
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
    console.log("🚀 ~ deleteInventory ~ user", user)
    // return prisma.car.delete({
    //   where: {
    //     id: user.id,
    //   },
    // });
    // 1. Fetch the Car (and any associated Orders):
    const car = await prisma.car.findUnique({
      where: { id : user.id },
      include: { orders: true }, // Include orders related to the car
    });

    if (!car) {
      throw new Error("Car not found"); // Handle the case where the car doesn't exist
    }

    // 2. Check for Existing Orders:
    if (car.orders && car.orders.length > 0) {
      // Car has associated orders, cannot delete
      return {
        error: "Cannot delete car. It is associated with existing orders.",
        existingOrders: car.orders, // Optionally include the orders for more info
      };
    }

    // 3. Delete the Car:
    return await prisma.car.delete({
      where: { id:user.id },
    });
  }
};
