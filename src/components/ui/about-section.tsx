"use client";

import React, { useRef, useEffect, useState } from "react";
import { MapPin, Code, Shield, Server, Terminal } from "lucide-react";

// ─── Animated section wrapper ───────────────────────────────────────────
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
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
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

// ─── Skill Data ─────────────────────────────────────────────────────────
const skills = [
  {
    category: "Languages",
    icon: Code,
    items: ["C++", "Python", "TypeScript", "JavaScript", "SQL", "Java"],
  },
  {
    category: "Web Frameworks",
    icon: Terminal,
    items: ["FastAPI", "React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"],
  },
  {
    category: "DevOps & Cloud",
    icon: Server,
    items: ["AWS", "GCP", "Docker", "Nginx", "GitHub Actions", "Linux/SSH"],
  },
  {
    category: "AI & Security",
    icon: Shield,
    items: ["Sentence-BERT", "Groq/DeepSeek LLMs", "Burp Suite", "Wireshark", "Certbot", "JWT"],
  },
];

interface AboutSectionProps {
  isDark: boolean;
}

export default function AboutSection({ isDark }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center py-24 px-6"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 3%)" : "hsl(0 0% 96%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto w-full">
        <FadeInSection>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-16"
            style={{
              color: "#C3E41D",
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
            }}
          >
            ABOUT
          </h2>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Bio */}
          <FadeInSection>
            <div className="space-y-6">
              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{
                  color: isDark
                    ? "hsl(0 0% 70%)"
                    : "hsl(0 0% 30%)",
                  fontFamily: "var(--font-antic), 'Antic', sans-serif",
                }}
              >
                I&apos;m <span className="font-bold" style={{ color: isDark ? "hsl(0 0% 95%)" : "hsl(0 0% 10%)" }}>Raj Kumar Gupta</span>, a 3rd-year B.Tech
                Computer Science student at BML Munjal University, Gurgaon. I
                build diverse projects spanning AI, full-stack web development,
                cybersecurity tools, and DevOps pipelines.
              </p>
              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{
                  color: isDark
                    ? "hsl(0 0% 70%)"
                    : "hsl(0 0% 30%)",
                  fontFamily: "var(--font-antic), 'Antic', sans-serif",
                }}
              >
                I hack ethically — finding vulnerabilities before the bad guys
                do. I believe in &ldquo;automate everything&rdquo; — DevOps isn&apos;t just a
                role, it&apos;s a mindset. My goal is to build tools that make the
                internet safer and smarter.
              </p>

              <div
                className="flex items-center gap-2 mt-4"
                style={{
                  color: isDark
                    ? "hsl(0 0% 50%)"
                    : "hsl(0 0% 50%)",
                }}
              >
                <MapPin className="w-4 h-4" />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-antic), 'Antic', sans-serif",
                  }}
                >
                  Gurgaon, India
                </span>
              </div>
            </div>
          </FadeInSection>

          {/* Right — Skills */}
          <div className="space-y-6">
            {skills.map((skill, idx) => (
              <FadeInSection key={skill.category}>
                <div
                  className="p-5 rounded-xl border transition-all duration-300 hover:border-[#C3E41D]/50 hover:shadow-lg hover:shadow-[#C3E41D]/5"
                  style={{
                    backgroundColor: isDark
                      ? "hsl(0 0% 5%)"
                      : "hsl(0 0% 100%)",
                    borderColor: isDark
                      ? "hsl(0 0% 15%)"
                      : "hsl(0 0% 88%)",
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <skill.icon
                      className="w-5 h-5"
                      style={{ color: "#C3E41D" }}
                    />
                    <h3
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{
                        color: isDark
                          ? "hsl(0 0% 90%)"
                          : "hsl(0 0% 15%)",
                      }}
                    >
                      {skill.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: isDark
                            ? "hsl(0 0% 12%)"
                            : "hsl(0 0% 92%)",
                          color: isDark
                            ? "hsl(0 0% 70%)"
                            : "hsl(0 0% 35%)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
