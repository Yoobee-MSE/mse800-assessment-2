import { createSupplier, getSupplierById, getSuppliers, updateSupplier, deleteSupplier } from '../../../database/suppliers.database';
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, contact, email, phone } = await request.json();
    const result = await createSupplier({ name, contact, email, phone });
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

/*
export async function PUT(id: string, name: string, contact: string, email: string, phone: string) {
  try {
    const result = await updateSupplier(parseInt(id), {name, contact, email, phone});
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error as any);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
*/

export async function PUT(req: { json: () => PromiseLike<{ id: any, name: any, contact: any, email: any, phone: any; }> | { id: any, name: any, contact: any, email: any, phone: any; }; }) {
	const { id, name, contact, email, phone } = await req.json();
	try {
		const result = await prisma.supplier.update({
			where: { id: id },
			data: {
				name: name,
        contact: contact,
        email: email,
        phone: phone,
			},
		});
		return NextResponse.json({
			code: 200,
			data: result
		});
	} catch (error) {
		console.log("🚀 ~ PUT ~ error:", error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


export async function DELETE(req: { json: () => PromiseLike<{ id: any; }> | { id: any; }; }) {
  const { id } = await req.json();

  try {
    const result = await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      code: 200,
      data: result,
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);

    return NextResponse.json({
      code: 500,
      error: 'Internal server error',
      message: 'Failed to delete supplier. Please try again later.',
    });
  }
}

/*
export async function DELETE(req: { json: () => PromiseLike<{ id: any; }> | { id: any; }; }) {
  const { id } = await req.json();
  try {
    const result = await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({
      code: 200,
      data: result
    });
  } catch (error) {
    console.log("🚀 ~ DELETE ~ error:", error);
    console.log("Failed to delete supplier with id:", id);
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}*/