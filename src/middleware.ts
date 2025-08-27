import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dejar pasar estas rutas técnicas para que no las intercepte Next.js
  if (pathname.startsWith('/posts') || pathname.startsWith('/service-offer')) {
    return NextResponse.next()
  }

  // Para todas las demás rutas, aplica el comportamiento estándar
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: '/:path*',
}
Agregar middleware para ignorar rutas técnicas
