import { Suspense } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { VerticalProvider } from "@/components/providers/VerticalProvider";
import { AIEmployee } from "@/components/marketing/AIEmployee";
import { AuditForm } from "@/components/marketing/AuditForm";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { CaseStudy } from "@/components/marketing/CaseStudy";
import { CommandPalette } from "@/components/marketing/CommandPalette";
import { CompanyTrust } from "@/components/marketing/CompanyTrust";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { InitialTestimonials } from "@/components/marketing/InitialTestimonials";
import { LeadTimeline } from "@/components/marketing/LeadTimeline";
import { LossCalculator } from "@/components/marketing/LossCalculator";
import { MobileStickyCTA } from "@/components/marketing/MobileStickyCTA";
import { Navbar } from "@/components/marketing/Navbar";
import { ObjectionFAQ } from "@/components/marketing/ObjectionFAQ";
import { Pricing } from "@/components/marketing/Pricing";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { ScrollDepthTracker } from "@/components/marketing/ScrollDepthTracker";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { Security } from "@/components/marketing/Security";
import { Testimonials } from "@/components/marketing/Testimonials";
import { VerticalSelector } from "@/components/marketing/VerticalSelector";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { homepageJsonLd, jsonLdScript } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <MotionProvider>
      <VerticalProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homepageJsonLd()) }} />
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {/* 1. Understand the problem */}
          <Hero />
          {/* Suspense boundaries let React hydrate below-the-fold sections in separate, interruptible chunks. */}
          <Suspense fallback={null}>
            <InitialTestimonials />
            <ProblemSection />
            <LossCalculator />
          </Suspense>
          {/* 2. See it fits my business */}
          <Suspense fallback={null}>
            <VerticalSelector />
          </Suspense>
          {/* 3. Understand the workflow */}
          <Suspense fallback={null}>
            <WorkflowSection />
          </Suspense>
          <Suspense fallback={null}>
            <AIEmployee />
          </Suspense>
          <Suspense fallback={null}>
            <FeatureShowcase />
            <BeforeAfter />
            <LeadTimeline />
          </Suspense>
          {/* 4. Trust */}
          <Suspense fallback={null}>
            <Testimonials />
            <CaseStudy />
          </Suspense>
          {/* 5. Convert */}
          <Suspense fallback={null}>
            <AuditForm />
            <Pricing />
            <ObjectionFAQ />
          </Suspense>
          <Suspense fallback={null}>
            <Security />
            <CompanyTrust />
            <FinalCTA />
          </Suspense>
        </main>
        <Footer />
        <MobileStickyCTA />
        <CommandPalette />
        <ScrollDepthTracker />
      </VerticalProvider>
    </MotionProvider>
  );
}
