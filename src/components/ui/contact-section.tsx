"use client";

import React, { useRef, useEffect, useState } from "react";
import { Mail, ArrowUpRight } from "lucide-react";

function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
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
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Custom SVG icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const contactLinks = [
  {
    label: "Email",
    href: "mailto:rajkumargupta7632@gmail.com",
    display: "rajkumargupta7632@gmail.com",
    icon: Mail,
    isSvg: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/rkg765",
    display: "github.com/rkg765",
    icon: GithubIcon,
    isSvg: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rajkumar098/",
    display: "linkedin.com/in/rajkumar098",
    icon: LinkedinIcon,
    isSvg: true,
  },
];

interface ContactSectionProps {
  isDark: boolean;
}

export default function ContactSection({ isDark }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center py-24 px-6"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto w-full text-center">
        <FadeInSection>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            style={{
              color: "#C3E41D",
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
            }}
          >
            LET&apos;S TALK
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-16"
            style={{
              color: isDark ? "hsl(0 0% 55%)" : "hsl(0 0% 45%)",
              fontFamily: "var(--font-antic), 'Antic', sans-serif",
            }}
          >
            I&apos;m open to freelance work, collaborations, and open-source
            contributions. If you have an interesting project idea or need a
            developer with a security mindset — let&apos;s connect.
          </p>
        </FadeInSection>

        <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
          {contactLinks.map((link, idx) => (
            <FadeInSection key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-6 py-4 rounded-xl border w-full transition-all duration-300 hover:border-[#C3E41D] hover:shadow-lg hover:shadow-[#C3E41D]/5"
                style={{
                  backgroundColor: isDark
                    ? "hsl(0 0% 5%)"
                    : "hsl(0 0% 100%)",
                  borderColor: isDark
                    ? "hsl(0 0% 15%)"
                    : "hsl(0 0% 88%)",
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                {link.isSvg ? (
                  <link.icon className="w-5 h-5 text-neutral-500 group-hover:text-[#C3E41D] transition-colors duration-300" />
                ) : (
                  <link.icon
                    className="w-5 h-5 text-neutral-500 group-hover:text-[#C3E41D] transition-colors duration-300"
                  />
                )}
                <span
                  className="flex-1 text-left text-sm md:text-base"
                  style={{
                    color: isDark
                      ? "hsl(0 0% 70%)"
                      : "hsl(0 0% 35%)",
                    fontFamily: "var(--font-antic), 'Antic', sans-serif",
                  }}
                >
                  {link.display}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#C3E41D]" />
              </a>
            </FadeInSection>
          ))}
        </div>

        {/* Footer */}
        <FadeInSection>
          <div className="mt-24 pt-8 border-t" style={{ borderColor: isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 90%)" }}>
            <p
              className="text-xs"
              style={{
                color: isDark ? "hsl(0 0% 30%)" : "hsl(0 0% 70%)",
              }}
            >
              © {new Date().getFullYear()} Raj Kumar Gupta. Built with Next.js, Tailwind CSS & Groq AI.
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
