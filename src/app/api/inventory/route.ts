import { createInventory, deleteInventory, getAllInventory, getInventoryByVin, updateInventory } from '../../../database/inventory.database';
import { NextResponse } from 'next/server';
import { Car, PrismaClient } from '@prisma/client';

export async function POST(req: { json: () => PromiseLike<{ vin: any; make: any; model: any; year: any; color: any; price: any; plate_number: any; supplierId: any; warehouseId: any; }> | { vin: any; make: any; model: any; year: any; color: any; price: any; plate_number: any; supplierId: any; warehouseId: any; }; }, res: any) {
	console.log("req,res", req, res)
	const { vin, make, model, year, color, price, plate_number, supplierId, warehouseId } = await req.json();

	try {
		const result = await createInventory({
			vin: vin,
			make: make,
			model: model,
			color: color,
			year: Number(year),
			price: Number(price),
			plate_number: plate_number,
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
			const result = await getInventoryByVin(vin)
			return NextResponse.json({
				code: 200,
				data: result
			})
		} else {
			const result = await getAllInventory();
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
		const result = await deleteInventory(vin)
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
export async function PUT(req: { json: () => PromiseLike<{ 
	id: number, 
	vin: any; 
	make: any; 
	model: any; 
	year: any; 
	color: any; 
	price: any; 
	plate_number: any; 
	supplierId: any; 
	warehouseId: any; }> | { 
		id: number, 
		vin: any; make: any; 
		model: any; 
		year: any; 
		color: any; 
		price: any; 
		plate_number: any; 
		supplierId: any; 
		warehouseId: any; }; 
	}) {
	const { id, vin, make, model, year, color, price, plate_number, supplierId, warehouseId } = await req.json();
	try {
		const data: Car = {
			id: id,
			vin: vin,
			make: make,
			model: model,
			color: color,
			year: Number(year),
			price: Number(price),
			plate_number: plate_number,
			supplierId: Number(supplierId),
			warehouseId: Number(warehouseId),
		};

		const result = await updateInventory(vin, data);
		return NextResponse.json({
			code: 200,
			data: result
		});
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}