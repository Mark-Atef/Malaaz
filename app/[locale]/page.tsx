// app/[locale]/page.tsx
import Hero from '@/components/sections/Hero';
import MarketNumbers from '@/components/sections/MarketNumbers';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import ForTraders from '@/components/sections/ForTraders';
import TheLab from '@/components/sections/TheLab';
import About from '@/components/sections/About';
import FAQ from '@/components/sections/FAQ';
import EarlyAccess from '@/components/sections/EarlyAccess';
import ScrollRevealInit from '@/components/common/ScrollRevealInit';

export default function Home() {
  return (
    <main className="page-enter">
      <ScrollRevealInit />
      <Hero />
      <MarketNumbers />
      <Problem />
      <HowItWorks />
      <ForTraders />
      <TheLab />
      <About />
      <FAQ />
      <EarlyAccess />
    </main>
  );
}