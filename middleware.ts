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

const locales = ['fr'];

const addLocaleToPath = (path: string, locale: string) => {
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
};

const pagePathsWithLocales = (paths: string[]) => {
  const pathsWithLocales: string[] = [];

  paths.forEach((path) => {
    pathsWithLocales.push(path);
    locales.forEach((locale) => {
      pathsWithLocales.push(addLocaleToPath(path, locale));
    });
  });

  return pathsWithLocales;
};

const websitePagePaths = pagePathsWithLocales([
  '/',
  '/about-us',
  '/blog/*',
  '/blog',
  '/earnings-calculator',
  '/pricing',
  '/support',
  '/templates',
]);

const marketplacePagePaths = ['/marketplace/*'];

const customersPagePath = [
  '/login',
  '/subscriptions',
  '/dashboard',
  '/purchase/*',
];

const isMatchingPagePaths = (pathname: string, paths: string[]) => {
  return paths.some((path: string) => {
    if (path.endsWith('*')) {
      const pathWithoutWildcard = path.slice(0, -1);
      return `${pathname}`.startsWith(pathWithoutWildcard);
    }
    return pathname === path;
  });
};

export function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub)
  const hostname = req.headers.get('host');
  if (!hostname) {
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });
  }

  if (pathname.startsWith('/_sites')) {
    return new Response(null, {
      status: 404,
    });
  }

  if (hostname === mainDomain || secondaryDomainNamesPattern.test(hostname)) {
    return NextResponse.next();
  }

  const currentHost = hostname
    .replace(`.${mainDomain}`, '')
    .replace(secondaryDomainNamesPattern, '');

  const isPublicAssetRoute = isPublicAsset(pathname);
  const isNextPathRoute = isNextPath(pathname);
  const isApiRoute = pathname.startsWith('/api');
  // const publicAsset = pathname.includes('.')
  if (!isApiRoute && !isPublicAssetRoute && !isNextPathRoute) {
    if (hostname === mainDomain || secondaryDomainNamesPattern.test(hostname)) {
      url.pathname = pathname;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${currentHost}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
