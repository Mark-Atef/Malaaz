'use client';
// components/common/ScrollRevealInit.tsx
//
// IMPORTANT: This component and globals.css MUST stay in sync.
// This sets:    element.setAttribute('data-revealed', 'true')
// globals.css responds to: .reveal[data-revealed="true"]
//
// WHY data-revealed instead of classList.add('visible'):
// React owns element.className. When any state changes (e.g. user opens FAQ),
// React re-renders and writes element.className = "..." — the entire string
// from JSX — which overwrites and removes any externally-added classes like
// 'visible'. data-* attributes React never touches unless they're in JSX,
// so data-revealed survives every re-render.
//
// WHY removed MutationObserver:
// All section components are SSR-rendered and present in the DOM when this
// effect runs. A MutationObserver watching the entire body for childList
// changes fires on every React state mutation (e.g. FAQ accordion open/close),
// calling querySelectorAll('.reveal') on every interaction — unnecessary work.

//
// CRITICAL FIX: Added usePathname as dependency.
//
// WHY pathname dep:
// ScrollRevealInit lives in [locale]/layout.tsx which persists across
// navigations (Next.js App Router layouts never remount). The original
// mount-only effect ran once, observed elements, unobserved them after
// triggering, then was done. When the user navigates back to a page,
// page.tsx remounts with fresh DOM — all .reveal elements are new and
// have no data-revealed attribute. The old observer never saw them.
// Result: every section stays at opacity: 0 (invisible content).
//
// Adding pathname as dep means:
// 1. Cleanup: previous observer.disconnect() runs
// 2. Effect re-runs: new observer created for fresh DOM elements
//
// WHY 60ms setTimeout:
// After a navigation, React commits the new page.tsx DOM in a microtask.
// Without the delay, querySelectorAll('.reveal') may run before the new
// page's elements exist in the DOM. 60ms is conservative — in practice
// React commits in ~10-20ms, but network/hydration variance exists.
//
// WHY data-revealed not className:
// React owns element.className. Every setState() call (e.g. FAQ open/close)
// triggers re-render that writes element.className = "..." from JSX,
// overwriting any class added externally. data-* attributes React never
// touches unless they appear in JSX.
//
// IMPORTANT: This file and globals.css MUST stay in sync.
// This sets:    element.setAttribute('data-revealed', 'true')
// globals.css:  .reveal[data-revealed="true"] { opacity: 1; transform: none; }

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRevealInit() {

  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Delay: wait for page.tsx DOM to be committed by React
    // before querying .reveal elements.
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal');
      for (const el of elements) {
        // Skip already-revealed elements (e.g. layout elements
        // that persist and were revealed on initial mount)
        if (el.getAttribute('data-revealed') !== 'true') {
          observer.observe(el);
        }
      }
    }, 60);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]); // Re-run on every route change — this is the critical fix

  return null;
}