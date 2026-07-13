"use client";

import { Check } from "lucide-react";

export type PricingGlassTier = {
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  description: string;
  isPopular?: boolean;
  features: string[];
};

export function PricingGlass({
  billingCycle,
  onBillingCycleChange,
  tiers
}: {
  billingCycle: "monthly" | "annual";
  onBillingCycleChange: (billingCycle: "monthly" | "annual") => void;
  tiers: PricingGlassTier[];
}) {
  return (
    <section className="pricing-glass" aria-label="Pricing plans">
      <div className="pricing-glass-heading">
        <span>Simple pricing</span>
        <h2>Choose your Nyra plan</h2>
        <div className="pricing-glass-toggle" role="group" aria-label="Billing cycle">
          <button
            className={billingCycle === "monthly" ? "active" : undefined}
            type="button"
            onClick={() => onBillingCycleChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={billingCycle === "annual" ? "active" : undefined}
            type="button"
            onClick={() => onBillingCycleChange("annual")}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="pricing-glass-grid">
        {tiers.map((tier) => {
          const price = billingCycle === "monthly" ? tier.priceMonthly : tier.priceAnnual;

          return (
            <article className={tier.isPopular ? "pricing-glass-card popular" : "pricing-glass-card"} key={tier.name}>
              {tier.isPopular ? <span className="pricing-glass-badge">Popular</span> : null}
              <h3>{tier.name}</h3>
              <p>{tier.description}</p>
              <div className="pricing-glass-price">
                <span>${price}</span>
                <small>/mo</small>
              </div>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <Check size={17} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="pricing-glass-action" type="button">
                Get {tier.name}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
