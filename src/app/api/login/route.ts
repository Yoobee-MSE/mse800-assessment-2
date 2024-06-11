import { NextResponse } from 'next/server';
import { sha256 } from 'js-sha256';
import { getUserByEmail } from '../../../database/users.database';
import { User } from '@prisma/client';


export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await getUserByEmail(email) as User;
    
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (result.password !== sha256(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
