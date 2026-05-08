'use client';
// components/common/LocaleHtmlAttributes.tsx
//
// WHY this exists:
// Next.js 16 requires app/layout.tsx to own <html><body>. But that root layout
// does not know the current locale (locale lives in [locale]/layout.tsx params).
// This client component bridges the gap: it receives locale + fontClasses from
// the server layout and sets them on document.documentElement after mount.
//
// useEffect runs after hydration, so the server HTML has no lang/dir/class
// attributes on <html>. suppressHydrationWarning on the root <html> element
// tells React not to throw when these attributes appear on the client.
// This is the officially supported pattern for locale-aware html attributes
// when the root layout cannot know the locale at render time.

import { useEffect } from 'react';

interface Props {
  locale: string;
  fontClasses: string;
}

export default function LocaleHtmlAttributes({ locale, fontClasses }: Props) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === 'ar' ? 'rtl' : 'ltr';
    // Merge font CSS variable classes — do not overwrite existing classes
    fontClasses.split(' ').forEach((cls) => {
      if (cls) html.classList.add(cls);
    });
  }, [locale, fontClasses]);

  return null;
}