import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to uploaded files
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}
