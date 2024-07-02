import { Car, Order, OrderStatus, User } from '@prisma/client';
import prisma from './client';

export type OrderDetails = Order & {
  user: User;
  car: Car;
}

export const getOrders = async (): Promise<OrderDetails[]> => {
  return prisma.order.findMany({include: {car: true, user: true }});
}

export const createOrder = async (userId: number, carId: number): Promise<Order> => {
  return prisma.order.create({
    data: {
      userId,
      carId,
      status: OrderStatus.PENDING,
    },
  });
};

export const getOrderById = async (orderId: number): Promise<Order | null> => {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
};


export const updateOrder = async (id: number, status: OrderStatus): Promise<Order> => {
  return prisma.order.update({
    where: {
      id: id,
    },
    data: {
      status,
    },
  });
};

export const deleteOrder = async (id: number): Promise<any> => {
  const order = await getOrderById(id);

  if (order) {
    return prisma.order.delete({
      where: {
        id: order.id,
      },
    });
  }
};
