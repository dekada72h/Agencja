"use client";

import { Marquee } from "@/components/ui/marquee";

const TECH = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "MDX",
  "PostgreSQL",
  "Stripe",
  "Vercel",
  "Cloudflare",
  "n8n",
  "Make.com",
  "OpenAI",
  "Schema.org",
  "Core Web Vitals",
  "GDPR",
];

export function TechStackMarquee() {
  return (
    <section className="border-y border-gray-100 bg-white py-12 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 mb-6">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gray-500 font-medium">
          Pracujemy z najnowszymi technologiami
        </p>
      </div>
      <Marquee pauseOnHover className="[--duration:60s]">
        {TECH.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-100 text-ink font-display font-semibold text-base lg:text-lg whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
