"use client";

import React, { useEffect, useState, useRef } from "react";
import { ExternalLink, Star, GitFork, Globe } from "lucide-react";
import type { Project } from "@/lib/types";

// ─── Language color map ─────────────────────────────────────────────────
const langColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  "C++": "#F34B7D",
  C: "#555555",
  Java: "#B07219",
  Svelte: "#FF3E00",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Jupyter: "#DA5B0B",
};

// ─── Fade-in wrapper ────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
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
      className={`transition-all duration-600 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Project Card ───────────────────────────────────────────────────────
function ProjectCard({
  project,
  isDark,
  index,
}: {
  project: Project;
  isDark: boolean;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FadeIn delay={index * 80}>
      <a
        href={`/projects/${project.name}`}
        className="block h-full rounded-xl border p-6 transition-all duration-300 group"
        style={{
          backgroundColor: isDark
            ? isHovered
              ? "hsl(0 0% 8%)"
              : "hsl(0 0% 5%)"
            : isHovered
              ? "hsl(0 0% 98%)"
              : "hsl(0 0% 100%)",
          borderColor: isHovered
            ? "#C3E41D"
            : isDark
              ? "hsl(0 0% 15%)"
              : "hsl(0 0% 88%)",
          boxShadow: isHovered
            ? "0 0 30px rgba(195, 228, 29, 0.08)"
            : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3
            className="text-lg font-bold tracking-tight group-hover:text-[#C3E41D] transition-colors duration-300"
            style={{
              color: isDark ? "hsl(0 0% 95%)" : "hsl(0 0% 10%)",
            }}
          >
            {project.displayName}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            {project.homepage && (
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                style={{ backgroundColor: "rgba(195, 228, 29, 0.15)", color: "#C3E41D" }}
              >
                <Globe className="w-2.5 h-2.5" />
                Live
              </span>
            )}
            <ExternalLink
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: "#C3E41D" }}
            />
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-3"
          style={{
            color: isDark ? "hsl(0 0% 55%)" : "hsl(0 0% 45%)",
            fontFamily: "var(--font-antic), 'Antic', sans-serif",
          }}
        >
          {project.aiDescription || project.description || "Explore this project for details."}
        </p>

        {/* Topics */}
        {project.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: isDark
                    ? "rgba(195, 228, 29, 0.08)"
                    : "rgba(195, 228, 29, 0.12)",
                  color: "#C3E41D",
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer — Language + Stats */}
        <div className="flex items-center gap-4 mt-auto">
          {project.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    langColors[project.language] || "#888",
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: isDark
                    ? "hsl(0 0% 50%)"
                    : "hsl(0 0% 50%)",
                }}
              >
                {project.language}
              </span>
            </div>
          )}
          {project.stars > 0 && (
            <div
              className="flex items-center gap-1"
              style={{
                color: isDark ? "hsl(0 0% 50%)" : "hsl(0 0% 50%)",
              }}
            >
              <Star className="w-3 h-3" />
              <span className="text-xs">{project.stars}</span>
            </div>
          )}
          {project.forks > 0 && (
            <div
              className="flex items-center gap-1"
              style={{
                color: isDark ? "hsl(0 0% 50%)" : "hsl(0 0% 50%)",
              }}
            >
              <GitFork className="w-3 h-3" />
              <span className="text-xs">{project.forks}</span>
            </div>
          )}
        </div>
      </a>
    </FadeIn>
  );
}

// ─── Projects Section ───────────────────────────────────────────────────
interface ProjectsSectionProps {
  isDark: boolean;
  projects: Project[];
}

export default function ProjectsSection({
  isDark,
  projects,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="min-h-screen py-24 px-6"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        <FadeIn>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
            style={{
              color: "#C3E41D",
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
            }}
          >
            PROJECTS
          </h2>
          <p
            className="text-lg mb-16"
            style={{
              color: isDark ? "hsl(0 0% 50%)" : "hsl(0 0% 50%)",
              fontFamily: "var(--font-antic), 'Antic', sans-serif",
            }}
          >
            Live from GitHub — auto-updated with AI-generated descriptions
          </p>
        </FadeIn>

        {projects.length === 0 ? (
          <FadeIn>
            <div
              className="text-center py-20 rounded-xl border"
              style={{
                borderColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 88%)",
                color: isDark ? "hsl(0 0% 40%)" : "hsl(0 0% 60%)",
              }}
            >
              <p className="text-lg">Loading projects from GitHub...</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                isDark={isDark}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
