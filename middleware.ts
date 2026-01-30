import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n } from './i18n-config';
import { updateSession } from './lib/supabase/middleware';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = i18n.locales as unknown as string[];
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle locale redirect
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  // Handle Supabase Auth Session and Route Protection
  return await updateSession(request);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|placeholder).*)'],
};
