"use client";

import { FAQ } from "@/components/ui/faq-tabs";
import { faqSection, faqs } from "@/lib/content";

export function ComplianceSection() {
  return (
    <FAQ
      id="faq"
      data-nav-theme="light"
      theme="light"
      headingLine1={faqSection.headingLine1}
      headingLine2={faqSection.headingLine2}
      items={faqs}
      className="section-y section-y-tight-top bg-white"
    />
  );
}