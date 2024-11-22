// src/app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serializeCookie, removeCookie, parseCookies } from '@/lib/session/cookieUtils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionToken } = body;

  if (!sessionToken) {
    return NextResponse.json({ message: 'Session token is required' }, { status: 400 });
  }

  const res = NextResponse.json({ message: 'Session created' });
  res.headers.set('Set-Cookie', serializeCookie('session', sessionToken));
  return res;
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ message: 'Session deleted' });
  res.headers.set('Set-Cookie', removeCookie('session'));
  return res;
}

export async function GET(req: NextRequest) {
  const cookies = parseCookies(req.headers.get('cookie'));
  const sessionToken = cookies.session;

  if (!sessionToken) {
    return NextResponse.json({ message: 'No session found' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Session verified', sessionToken });
}
