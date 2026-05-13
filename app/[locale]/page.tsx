// WHY <main> here and not in layout:
/** biome-ignore-all assist/source/organizeImports: <> */
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
import TrustPartners from '@/components/sections/TrustPartners';
import CostSimulator from '@/components/sections/CostSimulator';
import EngineerVisit from '@/components/sections/EngineerVisit';
import FAQ from '@/components/sections/FAQ';
import EarlyAccess from '@/components/sections/EarlyAccess';


export default function Home() {
  return (
    <main className="page-enter" id="main-content" aria-label="Malaaz main content">
      {/* ScrollRevealInit is in layout.tsx — do NOT add it here */}
      <Hero />
      <Problem />
      <HowItWorks />
      <TrustPartners />
      <CostSimulator />
      <About />
      <ForTraders />
      <TheLab />
      <MarketNumbers />
      <EngineerVisit />
      <FAQ />
      <EarlyAccess />
    </main>
  );
}