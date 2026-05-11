/* NEW FILE — app/sitemap.ts */
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://malaaz.com';
  const locales = ['ar', 'en'] as const;
  const routes = ['', '/about', '/privacy', '/terms'];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly' as const,
      priority: route === '' ? 1.0 : 0.7,
    }))
  );
}