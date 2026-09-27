import { Suspense } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { BusinessProvider } from "@/components/providers/BusinessProvider";
import { AIEmployee } from "@/components/marketing/AIEmployee";
import { AuditCTA } from "@/components/marketing/AuditCTA";
import { CommandPalette } from "@/components/marketing/CommandPalette";
import { DepthBackground } from "@/components/marketing/DepthBackground";
import { FocusSystem } from "@/components/marketing/FocusSystem";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { LeakSection } from "@/components/marketing/LeakSection";
import { MobileStickyCTA } from "@/components/marketing/MobileStickyCTA";
import { Navbar } from "@/components/marketing/Navbar";
import { OnePersonCompany } from "@/components/marketing/OnePersonCompany";
import { PricingFAQ } from "@/components/marketing/PricingFAQ";
import { ProductFeatures } from "@/components/marketing/ProductFeatures";
import { ScrollDepthTracker } from "@/components/marketing/ScrollDepthTracker";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Workflow } from "@/components/marketing/Workflow";
import { homepageJsonLd, jsonLdScript } from "@/lib/structured-data";

/**
 * Order: hero, problem, how it works, one person company, AI employee, features,
 * testimonials, pricing, final CTA. A fixed depth background sits behind at z-0.
 * Suspense boundaries let React hydrate chapters in separate, interruptible chunks.
 */
export default function HomePage() {
  return (
    <MotionProvider>
      <BusinessProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homepageJsonLd()) }} />
        <ScrollProgress />
        <Navbar />
        <FocusSystem />
        <DepthBackground />
        <main id="main" tabIndex={-1} className="relative z-10 focus:outline-none">
          {/* Hero */}
          <Hero />
          {/* Problem + calculator (one section: LeakSection holds both) */}
          <Suspense fallback={null}>
            <LeakSection />
          </Suspense>
          {/* How it works */}
          <Suspense fallback={null}>
            <Workflow />
          </Suspense>
          {/* One person company */}
          <Suspense fallback={null}>
            <OnePersonCompany />
          </Suspense>
          {/* AI employee */}
          <Suspense fallback={null}>
            <AIEmployee />
          </Suspense>
          {/* Features */}
          <Suspense fallback={null}>
            <ProductFeatures />
          </Suspense>
          {/* Testimonials */}
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
          {/* Pricing + FAQ (one section: PricingFAQ holds both) */}
          <Suspense fallback={null}>
            <PricingFAQ />
          </Suspense>
          {/* Final CTA */}
          <Suspense fallback={null}>
            <AuditCTA />
          </Suspense>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
        <MobileStickyCTA />
        <CommandPalette />
        <ScrollDepthTracker />
      </BusinessProvider>
    </MotionProvider>
  );
}
