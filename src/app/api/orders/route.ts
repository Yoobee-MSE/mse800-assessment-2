import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@prisma/client';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../../../database/orders.database';


export async function POST(request: Request) {
  try {
    const { userId, carId } = await request.json();
    const result = await createOrder(userId, carId) as Order;
    
    if (!result) {
      return NextResponse.json({ error: 'Unable to Create User' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest){
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  try {
    if(id) {
      const order = await getOrderById(Number(id))
      return NextResponse.json(order)
    } else {
      const orders = await getOrders()
      return NextResponse.json(orders)
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}

export async function DELETE(request: NextRequest){
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if(id) {
      await deleteOrder(Number(id))
      return NextResponse.json({ message: 'Successfully Deleted Order' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Order id not provided' }, { status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}

export async function PUT(request: NextRequest){
  const { id, status } = await request.json();

  try {
    if(id) {
      const order = await getOrderById(Number(id))
      if(!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404});
      } 
      
      const updatedOrder = await updateOrder(id, status)
      return NextResponse.json(updatedOrder)
    } else {
      return NextResponse.json({ error: 'Order id not provided' }, { status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}