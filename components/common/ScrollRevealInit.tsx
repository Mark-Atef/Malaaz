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

import { useEffect } from 'react';

export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Use data attribute — survives React re-renders; className does not
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []); // mount-only — all .reveal elements are SSR-present on first paint

  return null;
}