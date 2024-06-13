import { NextRequest, NextResponse } from 'next/server';
import { sha256 } from 'js-sha256';
import { createUser, getUserByEmail, getUserById, getUsers } from '../../../database/users.database';
import { User } from '@prisma/client';


export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    const result = await createUser(email, password, role) as User;
    
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
      const user = await getUserById(Number(id))
      return NextResponse.json(user)
    } else {
      const users = await getUsers()
      return NextResponse.json(users)
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}
