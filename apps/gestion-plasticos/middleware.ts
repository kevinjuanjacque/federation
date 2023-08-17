import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { jwtConstants } from './helpers/constanst';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('middleware', request.method, request.url);

  // obtener headers autorization y validar token
  const token = request.headers.get('authorization');
  console.log('token', token);
  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  } else {
    const { payload } = await jose.jwtVerify(
      token.split(' ')[1],
      new TextEncoder().encode(jwtConstants.secret)
    );
    if (payload['email'] !== 'admin')
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/facturas/:path*',
  runtime: 'experimental-edge',
  unstable_allowDynamic: ['**/node_modules/lodash/**/*.js'],
};
