"use client";

import React, { useState } from "react";
import { PricingGlass, type PricingGlassTier } from "@/components/ui/pricing-glass";

type BgOption = {
  name: string;
  className: string;
  buttonClass: string;
};

const BG_COLORS: BgOption[] = [
  { name: "Obsidian", className: "pricing-glass-bg-obsidian", buttonClass: "pricing-glass-swatch-obsidian" },
  { name: "Midnight Cosmos", className: "pricing-glass-bg-cosmos", buttonClass: "pricing-glass-swatch-cosmos" },
  { name: "Mariana Trench", className: "pricing-glass-bg-mariana", buttonClass: "pricing-glass-swatch-mariana" },
  { name: "Dark Moss", className: "pricing-glass-bg-moss", buttonClass: "pricing-glass-swatch-moss" },
  { name: "Volcanic Ash", className: "pricing-glass-bg-ash", buttonClass: "pricing-glass-swatch-ash" }
];

const DEMO_TIERS: PricingGlassTier[] = [
  {
    name: "Basic",
    priceMonthly: "9",
    priceAnnual: "7",
    description: "Perfect for individuals and side projects.",
    features: ["1 Workspace", "Basic Analytics", "Community Support"]
  },
  {
    name: "Pro",
    priceMonthly: "29",
    priceAnnual: "24",
    description: "For professionals and growing teams.",
    isPopular: true,
    features: ["Unlimited Workspaces", "Advanced Analytics", "Priority Support", "Custom Domains"]
  },
  {
    name: "Ultra",
    priceMonthly: "99",
    priceAnnual: "79",
    description: "Maximum power for massive scale.",
    features: ["Unlimited Everything", "Predictive AI Insights", "24/7 Dedicated Support", "Custom Domains", "Biometric Security"]
  }
];

export function PricingGlassDemo() {
  const [bgIndex, setBgIndex] = useState(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section className={`pricing-glass-demo ${BG_COLORS[bgIndex].className}`} aria-label="Pricing plan demo">
      <div className="pricing-glass-bg-selector">
        <span>Test Backgrounds</span>
        <div>
          {BG_COLORS.map((color, index) => (
            <button
              aria-label={color.name}
              aria-pressed={bgIndex === index}
              className={`${color.buttonClass} ${bgIndex === index ? "active" : ""}`}
              key={color.name}
              onClick={() => setBgIndex(index)}
              title={color.name}
              type="button"
            />
          ))}
        </div>
      </div>

      <div className="pricing-glass-demo-inner">
        <PricingGlass
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          tiers={DEMO_TIERS}
        />
      </div>
    </section>
  );
}
