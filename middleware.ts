import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/test-middleware')) {
    return NextResponse.rewrite(new URL('/mb9998', request.url))
  }

  return NextResponse.next()

}