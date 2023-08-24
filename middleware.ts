import { NextRequest, NextResponse } from 'next/server';
import { getTenantSubdomainOrDefault } from './src/utils/db';

export const config = {
  matcher: ['/', '/_sites/:path', '/profile', '/profile/history'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host');

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  // const currentHost =
  //   process.env.NODE_ENV === "development" &&
  //   hostname.replace(`.${process.env.ROOT_DOMAIN}`, "");
  // const data = await getHostnameDataOrDefault(currentHost);

  const subdomain = await getTenantSubdomainOrDefault(hostname!);

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
