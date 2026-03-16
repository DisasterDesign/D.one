import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || password !== process.env.MATCHER_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'סיסמה שגויה' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'matcher' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('matcher_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'שגיאת שרת' },
      { status: 500 }
    );
  }
}
