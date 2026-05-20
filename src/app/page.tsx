"use client";

import { useState, useEffect, useCallback } from "react";
import PortfolioHero from "@/components/ui/portfolio-hero";
import AboutSection from "@/components/ui/about-section";
import ProjectsSection from "@/components/ui/projects-section";
import ExperienceSection from "@/components/ui/experience-section";
import ContactSection from "@/components/ui/contact-section";
import type { Project } from "@/lib/types";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Fetch projects from API
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  return (
    <div
      className="w-full transition-colors duration-500"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
      }}
    >
      {/* Hero Section */}
      <PortfolioHero isDark={isDark} onToggleTheme={toggleTheme} />

      {/* About Section */}
      <AboutSection isDark={isDark} />

      {/* Projects Section — live from GitHub + Groq */}
      <ProjectsSection isDark={isDark} projects={projects} />

      {/* Experience + Education Section */}
      <ExperienceSection isDark={isDark} />

      {/* Contact Section */}
      <ContactSection isDark={isDark} />

      {/* Loading overlay for projects */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 z-40">
          <div
            className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
            style={{
              backgroundColor: isDark ? "hsl(0 0% 10%)" : "hsl(0 0% 95%)",
              color: isDark ? "hsl(0 0% 60%)" : "hsl(0 0% 40%)",
            }}
          >
            <div className="w-3 h-3 border-2 border-[#C3E41D] border-t-transparent rounded-full animate-spin" />
            Fetching projects from GitHub...
          </div>
        </div>
      )}
    </div>
  );
}
