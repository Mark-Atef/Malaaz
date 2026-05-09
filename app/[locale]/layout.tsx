// app/[locale]/layout.tsx
//
// This layout does NOT render <html> or <body>.
// Root app/layout.tsx owns those elements with suppressHydrationWarning.
// LocaleHtmlAttributes sets lang, dir, and font class names on the <html>
// element from the client after hydration — see that file for full explanation.

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollRevealInit from '@/components/common/ScrollRevealInit';
import LocaleHtmlAttributes from '@/components/common/LocaleHtmlAttributes';
import '../globals.css';

const locales = ['ar', 'en'] as const;
type Locale = (typeof locales)[number];

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'optional', // 'optional' avoids FOIT flash on slow connections
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'optional',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const title = isAr
    ? 'ملاذ — منصة التشطيب الذكية في مصر'
    : 'Malaaz — Egypt\'s Smart Finishing Platform';

  const description = isAr
    ? 'منصة ذكية متكاملة لإدارة طلبات الكهرباء والتشطيبات والديكور مع مساعد تقني بالذكاء الاصطناعي'
    : 'An integrated smart platform for electrical, finishing, and décor — guided by AI, backed by verified local traders across Egypt.';

  return {
    title: { default: title, template: `%s — Malaaz` },
    description,
    metadataBase: new URL('https://malaaz.com'),
alternates: {
  canonical: `https://malaaz.com/${locale}`,
  languages: {
    ar: 'https://malaaz.com/ar',
    en: 'https://malaaz.com/en'
  },
},
    openGraph: {
      title,
      description,
      url: `https://malaaz.com/${locale}`,
      siteName: 'Malaaz',
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: isAr ? 'ملاذ — منصة التشطيب الذكية' : "Malaaz — Egypt's Smart Finishing Platform",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const fontClasses = `${cormorant.variable} ${dmSans.variable}`;

  return (
    <NextIntlClientProvider messages={messages}>
      {/*
        LocaleHtmlAttributes sets lang/dir/className on document.documentElement
        after mount. suppressHydrationWarning on the root <html> element (in
        app/layout.tsx) prevents React from throwing when these attributes appear.
      */}
      <LocaleHtmlAttributes locale={locale} fontClasses={fontClasses} />
      <Navbar />
      {children}
      <Footer />
      <ScrollRevealInit />
    </NextIntlClientProvider>
  );
}