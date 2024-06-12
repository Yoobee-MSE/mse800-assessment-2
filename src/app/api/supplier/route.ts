import { createSupplier, getSupplierById, getSuppliers, updateSupplier, deleteSupplier } from '../../../database/suppliers.database';
import { NextResponse } from 'next/server';

export async function POST(name: string, contact: string, email: string, phone: string) {
  try {
    const result = await createSupplier({name, contact, email, phone});
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    try {
      const result = await getSupplierById(parseInt(id));
      return NextResponse.json(result);
    } catch (error) {
      console.log("🚀 ~ GET ~ error:", error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } else {
    try {
      const result = await getSuppliers();
      return NextResponse.json(result);
    } catch (error) {
      console.log("🚀 ~ GET ~ error:", error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function PUT(id: string, name: string, contact: string, email: string, phone: string) {
  try {
    const result = await updateSupplier(parseInt(id), {name, contact, email, phone});
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(id: string) {
  try {
    await deleteSupplier(parseInt(id));
    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.log("🚀 ~ DELETE ~ error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}