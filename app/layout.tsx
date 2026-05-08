// app/layout.tsx
//
// WHY <html suppressHydrationWarning><body suppressHydrationWarning>:
//
// Next.js 16.2.4 enforces that the ROOT layout contains <html> and <body>.
// The previous `return <>{children}</>` passthrough worked in earlier versions
// but is now rejected with "Missing <html> and <body> tags in the root layout."
//
// The problem: [locale]/layout.tsx also needs to set lang= and dir= attributes
// per locale (critical for RTL Arabic). If it rendered <html lang dir> too,
// you'd get nested <html> elements — invalid HTML and a hydration crash.
//
// The solution:
// 1. This root layout provides the required <html><body> shell — no lang/dir yet.
//    suppressHydrationWarning tells React: "this element's attributes will differ
//    between server and client — do not throw a hydration error for it."
// 2. LocaleHtmlAttributes (a client component in [locale]/layout.tsx) runs
//    useEffect on mount and sets document.documentElement.lang, dir, and className.
//    React never re-renders the <html> element itself, so there is no conflict.
//
// NO fonts, NO globals.css, NO providers here — all of that lives in [locale]/layout.tsx
// so it loads per-locale with the correct font variables and message context.

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: React will not warn when LocaleHtmlAttributes
    // mutates lang/dir/className on this element after hydration.
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}