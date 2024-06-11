//get  all warehouse
// Path: mse800-assessment-2/src/app/api/warehouse/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//get all warehouse
export async function GET() {
	try {
		const result = await prisma.warehouse.findMany();
		return NextResponse.json( result
		);
	} catch (error) {
		console.log("🚀 ~ GET ~ error:", error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}