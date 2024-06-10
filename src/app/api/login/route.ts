import { createAdminUser } from '../../../database/create-admin.database';
// src/app/api/create-admin/route.ts
import { NextResponse } from 'next/server';


export async function POST() {
  try {
    const result = await createAdminUser();
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
