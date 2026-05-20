"use client";

import React, { useRef, useEffect, useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Timeline Item ──────────────────────────────────────────────────────
function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  period,
  description,
  bullets,
  badge,
  isDark,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  bullets?: string[];
  badge?: string;
  isDark: boolean;
  delay: number;
}) {
  return (
    <FadeInSection delay={delay}>
      <div className="flex gap-4 md:gap-6">
        {/* Icon circle */}
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border"
            style={{
              borderColor: "#C3E41D",
              backgroundColor: isDark
                ? "rgba(195, 228, 29, 0.08)"
                : "rgba(195, 228, 29, 0.1)",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: "#C3E41D" }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <h3
              className="text-lg md:text-xl font-bold"
              style={{
                color: isDark ? "hsl(0 0% 95%)" : "hsl(0 0% 10%)",
              }}
            >
              {title}
            </h3>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: isDark
                  ? "hsl(0 0% 12%)"
                  : "hsl(0 0% 92%)",
                color: isDark ? "hsl(0 0% 60%)" : "hsl(0 0% 45%)",
              }}
            >
              {period}
            </span>
          </div>
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "#C3E41D" }}
          >
            {subtitle}
          </p>
          {badge && (
            <span
              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
              style={{
                backgroundColor: "rgba(195, 228, 29, 0.12)",
                color: "#C3E41D",
              }}
            >
              {badge}
            </span>
          )}
          {description && (
            <p
              className="text-sm leading-relaxed"
              style={{
                color: isDark ? "hsl(0 0% 55%)" : "hsl(0 0% 45%)",
                fontFamily: "var(--font-antic), 'Antic', sans-serif",
              }}
            >
              {description}
            </p>
          )}
          {bullets && bullets.length > 0 && (
            <ul className="mt-2 space-y-2">
              {bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed flex gap-2"
                  style={{
                    color: isDark ? "hsl(0 0% 55%)" : "hsl(0 0% 45%)",
                    fontFamily: "var(--font-antic), 'Antic', sans-serif",
                  }}
                >
                  <span style={{ color: "#C3E41D" }} className="mt-1 flex-shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </FadeInSection>
  );
}

// ─── Experience Section ─────────────────────────────────────────────────
interface ExperienceSectionProps {
  isDark: boolean;
}

export default function ExperienceSection({ isDark }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="min-h-screen flex items-center py-24 px-6"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 3%)" : "hsl(0 0% 96%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Experience Column */}
          <div>
            <FadeInSection>
              <h2
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-12"
                style={{
                  color: "#C3E41D",
                  fontFamily:
                    "var(--font-fira-code), 'Fira Code', monospace",
                }}
              >
                EXP.
              </h2>
            </FadeInSection>

            <div className="space-y-2">
              <TimelineItem
                icon={Briefcase}
                title="SWAN Livelihood"
                subtitle="DevOps Intern"
                period="June 2025 — Aug 2025"
                bullets={[
                  "Orchestrated multi-cloud CI/CD pipelines using GitHub Actions to automate production deployments across AWS EC2 and GCP Compute Engine.",
                  "Configured Nginx as a secure Reverse Proxy to manage traffic for custom domains, implementing SSL/TLS (Certbot) for encrypted connections.",
                  "Implemented production-grade process management using PM2 and Systemd to ensure application resilience, auto-healing, and zero-downtime updates.",
                  "Managed DNS records and server security configurations, optimizing static asset delivery and reducing latency for end-users.",
                ]}
                isDark={isDark}
                delay={100}
              />
            </div>
          </div>

          {/* Education Column */}
          <div>
            <FadeInSection>
              <h2
                id="education"
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-12"
                style={{
                  color: "#C3E41D",
                  fontFamily:
                    "var(--font-fira-code), 'Fira Code', monospace",
                }}
              >
                EDU.
              </h2>
            </FadeInSection>

            <div className="space-y-2">
              <TimelineItem
                icon={GraduationCap}
                title="B.Tech — Computer Science Engineering"
                subtitle="BML Munjal University, Gurgaon"
                period="2023 — 2027"
                badge="CGPA: 7.3 / 10.0"
                description="Core Coursework: DSA, OOPs, DBMS, Operating Systems, Computer Networks, System Architecture. Building 20+ projects across AI, Web, Security & Systems."
                isDark={isDark}
                delay={100}
              />
              <TimelineItem
                icon={GraduationCap}
                title="Class XII — Intermediate"
                subtitle="MPS Science College, Bihar"
                period="2021"
                badge="Percentage: 64.8%"
                description="Completed intermediate education with a focus on Science stream (Physics, Chemistry, Mathematics)."
                isDark={isDark}
                delay={200}
              />
              <TimelineItem
                icon={GraduationCap}
                title="Class X — Matriculation"
                subtitle="Ambika Bhawani School, Bihar"
                period="2019"
                badge="Percentage: 78.6%"
                description="Completed matriculation with distinction, building foundational skills in mathematics and science."
                isDark={isDark}
                delay={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
