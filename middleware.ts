import { NextRequest, NextResponse } from 'next/server';
import { getTenantSubdomainOrDefault } from './src/utils/db';

export const config = {
  matcher: ['/', '/_sites/:path', '/profile', '/profile/history', '/all'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = req.headers.get('host');

  const subdomain = await getTenantSubdomainOrDefault(hostname!);

  if ( subdomain instanceof NextResponse ) {
    return subdomain;
  }

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
