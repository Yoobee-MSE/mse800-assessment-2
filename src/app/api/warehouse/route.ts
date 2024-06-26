import { NextRequest, NextResponse } from 'next/server';
import { Warehouse } from '@prisma/client';
import { createWarehouse, deleteWarehouse, getWarehouseById, getWarehouses, updateWarehouse } from '../../../database/warehouse.database';

export async function POST(request: Request) {
  try {
    const { name, location, capacity } = await request.json();
    const result = await createWarehouse(name, location, capacity) as Warehouse;
    
    if (!result) {
      return NextResponse.json({ error: 'Unable to Create Warehouse' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest){
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  try {
    if(id) {
      const warehouse = await getWarehouseById(Number(id))
      return NextResponse.json(warehouse)
    } else {
      const warehouses = await getWarehouses()
      return NextResponse.json(warehouses)
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
      await deleteWarehouse(Number(id))
      return NextResponse.json({ message: 'Successfully Deleted Warehouse' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Warehouse id not provided' }, { status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}

export async function PUT(request: NextRequest){
  const { id, name, location, capacity } = await request.json();

  try {
    if(id) {
      const warehouse = await getWarehouseById(Number(id))
      if(!warehouse) {
        return NextResponse.json({ error: 'Warehouse not found' }, { status: 404});
      } 
      
      const updatedWarehouse = await updateWarehouse(id, name, location, capacity)
      return NextResponse.json(updatedWarehouse)
    } else {
      return NextResponse.json({ error: 'Warehouse id not provided' }, { status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}