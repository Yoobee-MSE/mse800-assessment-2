import { createInventory } from '../../../database/inventory.database';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ vin: any; make: any; model: any; year: any; color: any; price: any; quantity: any; supplierId: any; warehouseId: any; }> | { vin: any; make: any; model: any; year: any; color: any; price: any; quantity: any; supplierId: any; warehouseId: any; }; }, res: any) {
	console.log("req,res", req, res)
	const { vin, make, model, year, color, price, quantity, supplierId, warehouseId } = await req.json();

	try {
		const result = await createInventory({
			vin: vin,
			make: make,
			model: model,
			color: color,
			year: Number(year),
			price: Number(price),
			quantity: Number(quantity),
			supplierId: Number(supplierId),
			warehouseId: Number(warehouseId),
		});
		return NextResponse.json({ code: 200, data: result });
	} catch (error) {
		console.log("🚀 ~ POST ~ error:", error)
		return NextResponse.json({ error: `Internal server error,req:${req},res:${res} ${vin}` }, { status: 500 });
	}
}

export async function GET(req: any, res: any) {
	const { searchParams, pathname } = new URL(req.url);
	const vin = searchParams.get('vin');
	console.log("vin",vin)
	try {
		if (vin) {
			const result = await prisma.car.findUnique({
				where: { vin: vin },
			});
			return NextResponse.json({
				code: 200,
				data: result
			})
		} else {
			const result = await prisma.car.findMany();
			return NextResponse.json(result);
		}
	} catch (error) {
		console.log("🚀 ~ GET ~ error:", error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
//delete
export async function DELETE(req: { json: () => PromiseLike<{ vin: any; }> | { vin: any; }; }) {
	const { vin } = await req.json();
	try {
		const result = await prisma.car.delete({
			where: { vin: vin },
		});
		return NextResponse.json({
			code: 200,
			data: result
		});
	} catch (error) {
		console.log("🚀 ~ DELETE ~ error:", error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

//update
export async function PUT(req: { json: () => PromiseLike<{ vin: any; make: any; model: any; year: any; color: any; price: any; quantity: any; supplierId: any; warehouseId: any; }> | { vin: any; make: any; model: any; year: any; color: any; price: any; quantity: any; supplierId: any; warehouseId: any; }; }) {
	const { vin, make, model, year, color, price, quantity, supplierId, warehouseId } = await req.json();
	try {
		const result = await prisma.car.update({
			where: { vin: vin },
			data: {
				make: make,
				model: model,
				color: color,
				year: Number(year),
				price: Number(price),
				quantity: Number(quantity),
				supplierId: Number(supplierId),
				warehouseId: Number(warehouseId),
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