// components/common/ScrollRevealInit.tsx
'use client';

import { useEffect } from 'react';
 
export default function ScrollRevealInit() {
  useEffect(() => {
    // Immediately reveal elements already in view on mount
    const revealAll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use data-revealed — React never touches data-* attrs it didn't set
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      });
    };
 
    const observer = new IntersectionObserver(revealAll, {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    });
 
    // Observe every .reveal element present now and added later
    const observe = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        // Skip if already revealed
        if (!el.getAttribute('data-revealed')) {
          observer.observe(el);
        }
      });
    };
 
    observe();
 
    // Re-scan when new sections mount (lazy-loaded or conditional)
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });
 
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
 
  return null;
}