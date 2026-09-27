import { Suspense } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { BusinessProvider } from "@/components/providers/BusinessProvider";
import { AIEmployee } from "@/components/marketing/AIEmployee";
import { AuditCTA } from "@/components/marketing/AuditCTA";
import { CommandPalette } from "@/components/marketing/CommandPalette";
import { FocusSystem } from "@/components/marketing/FocusSystem";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { LeakSection } from "@/components/marketing/LeakSection";
import { MobileStickyCTA } from "@/components/marketing/MobileStickyCTA";
import { Navbar } from "@/components/marketing/Navbar";
import { PricingFAQ } from "@/components/marketing/PricingFAQ";
import { ProductFeatures } from "@/components/marketing/ProductFeatures";
import { ScrollDepthTracker } from "@/components/marketing/ScrollDepthTracker";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Workflow } from "@/components/marketing/Workflow";
import { homepageJsonLd, jsonLdScript } from "@/lib/structured-data";

/**
 * Seven chapters: problem → product → workflow → proof → price → trust → sales conversation.
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
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {/* 01 Hero */}
          <Hero />
          {/* 02 The leak */}
          <Suspense fallback={null}>
            <LeakSection />
          </Suspense>
          {/* 03 How 10X works */}
          <Suspense fallback={null}>
            <Workflow />
          </Suspense>
          {/* 04 Your AI employee */}
          <Suspense fallback={null}>
            <AIEmployee />
          </Suspense>
          {/* 05 Product + proof */}
          <Suspense fallback={null}>
            <ProductFeatures />
          </Suspense>
          {/* 06 Pricing + trust + FAQ */}
          <Suspense fallback={null}>
            <PricingFAQ />
          </Suspense>
          {/* Testimonials: second to last, just before the final CTA */}
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
          {/* 07 Book a conversation */}
          <Suspense fallback={null}>
            <AuditCTA />
          </Suspense>
        </main>
        <Footer />
        <MobileStickyCTA />
        <CommandPalette />
        <ScrollDepthTracker />
      </BusinessProvider>
    </MotionProvider>
  );
}
