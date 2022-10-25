import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { mainDomain, basePath } from './next-asset.config';

const PUBLIC_FILE_PATTERN = /\.(.*)$/;

const isPublicAsset = (pathname: string): boolean =>
  PUBLIC_FILE_PATTERN.test(pathname);

const isNextPath = (pathname: string): boolean =>
  pathname.startsWith(`${basePath}/_next`);

const secondaryDomainNamesPattern =
  /^(.+\.pages\.dev|.+\.landing\.snipfeed\.co|localhost|pages\.snipfeed\.us)$/;

export function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub)
  const hostname = req.headers.get('host') ?? '';

  const currentHost = hostname
    .replace(`.${mainDomain}`, '')
    .replace(secondaryDomainNamesPattern, '');

  const isPublicAssetRoute = isPublicAsset(pathname);
  const isNextPathRoute = isNextPath(pathname);
  const isApiRoute = pathname.startsWith('/api');
  if (pathname === '/test-middleware') {
    return NextResponse.json({
      test1: hostname === mainDomain,
      test2: secondaryDomainNamesPattern.test(hostname),
      isPublicAssetRoute,
      isNextPathRoute,
      isApiRoute,
      currentHost,
      hostname,
      url: url.toString(),
    });
  }

  return NextResponse.next();
}
