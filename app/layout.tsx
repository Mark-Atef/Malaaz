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


// Next.js 16.2 requires <html><body> here.
// suppressHydrationWarning: LocaleHtmlAttributes sets lang/dir/className
// on document.documentElement after hydration. React would otherwise warn
// about the attribute mismatch between server (no lang) and client (lang=ar).
// bfcache note: cache-control:no-store failures are from Next.js dev overlay
// and Vercel preview — not actionable per Lighthouse's own classification.


import type { ReactNode } from 'react';
 
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: React will not warn when LocaleHtmlAttributes
    // mutates lang/dir/className on this element after hydration.
    <html suppressHydrationWarning>
            <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}



// Alternative approach: determine locale in this root layout and render <html lang=>

// middleware
// headers
// cookies
// next-intl helpers

// to determine locale server-side.

// That avoids:

// hydration mutation
// suppressHydrationWarning
// client-side document mutation

// But your current setup is still acceptable.





// export default async function RootLayout({ children }) {
//   const locale = await getLocaleSomehow();

//   return (
//     <html lang={locale}>
//       <body>{children}</body>
//     </html>
//   );
// }