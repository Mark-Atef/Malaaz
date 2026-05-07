// This is the single owner of <html>, <body>, fonts, metadata, and providers.
// Root app/layout.tsx is a passthrough — see its comments.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ScrollRevealInit from '@/components/common/ScrollRevealInit';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '../globals.css';

const locales = ['ar', 'en'] as const;
type Locale = (typeof locales)[number];

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});


// generateMetadata: locale-aware title + description + full Open Graph + Twitter card
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
    ? 'منصة ذكية متكاملة لإدارة طلبات الكهرباء والتشطيبات والديكور مع مساعد تقني بالذكاء الاصطناعي. من الجدران الخام إلى بيت متكامل.'
    : 'An integrated smart platform for electrical, finishing, and décor — guided by AI, backed by verified local traders across Egypt.';
 
  return {
    title: { default: title, template: `%s — Malaaz` },
    description,
    metadataBase: new URL('https://malaaz.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: '/ar', en: '/en' },
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
          alt: isAr ? 'ملاذ — منصة التشطيب الذكية' : 'Malaaz — Egypt\'s Smart Finishing Platform',
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
 

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
 
  const isRTL = locale === 'ar';
  const messages = await getMessages();
 
  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* Navbar is always visible — fixed/sticky */}
          <Navbar />
 
          {/*
            WHY no <main> here:
            Each page (page.tsx, privacy/page.tsx, terms/page.tsx) provides
            its own <main> element. This keeps semantics correct — one <main>
            per document — and allows pages to set their own padding-top,
            min-height, and aria-labelledby independently.
          */}
          {children}
 
          <Footer />
          <ScrollRevealInit />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}