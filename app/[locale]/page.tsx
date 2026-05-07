// WHY <main> here and not in layout:
// Next.js App Router: layout.tsx wraps children but does not re-render between
// page navigations. The page-enter animation must live on the page component so
// it replays on every route visit. <main> is the correct semantic landmark for
// primary page content — one per document.
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import About from '@/components/sections/About';
import ForTraders from '@/components/sections/ForTraders';
import TheLab from '@/components/sections/TheLab';
import MarketNumbers from '@/components/sections/MarketNumbers';
import FAQ from '@/components/sections/FAQ';
import EarlyAccess from '@/components/sections/EarlyAccess';
import ScrollRevealInit from '@/components/common/ScrollRevealInit';

export default function Home() {
  return (
    <main className="page-enter" id="main-content" aria-label="Malaaz main content">
      <ScrollRevealInit />
      <Hero />
      <Problem />
      <HowItWorks />
      <About />
      <ForTraders />
      <TheLab />
      <MarketNumbers />
      <FAQ />
      <EarlyAccess />
    </main>
  );
}