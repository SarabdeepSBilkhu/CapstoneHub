import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input fields', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    let user: any = null;

    // Try live database first; gracefully fallback to mock database if Postgres is not connected
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch {
      await mockDb.init();
      user = mockDb.users.find((u) => u.email === email);
    }

    if (!user) {
      // Check mockDb as well
      await mockDb.init();
      user = mockDb.users.find((u) => u.email === email);
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
