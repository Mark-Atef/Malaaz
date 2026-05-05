// app/[locale]/page.tsx
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
    <main className="page-enter">
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