"use client";

import { useEffect, useState, useRef, use } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Clock,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import type { ProjectDetail } from "@/lib/types";

// Language color map
const langColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  "C++": "#F34B7D",
  C: "#555555",
  Java: "#B07219",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Jupyter: "#DA5B0B",
};

// GitHub icon
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

// LinkedIn icon
const LinkedinIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Fade wrapper ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease-out ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDark] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const copyLinkedInPost = () => {
    if (project?.linkedinPost) {
      navigator.clipboard.writeText(project.linkedinPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const relativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateStr);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(0 0% 0%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#C3E41D] border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-400 text-sm">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(0 0% 0%)" }}
      >
        <div className="text-center">
          <p className="text-neutral-400 text-lg mb-4">Project not found</p>
          <a href="/" className="text-[#C3E41D] hover:underline">← Back to portfolio</a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 90%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header Bar */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid hsl(0 0% 12%)",
        }}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <a
            href="/#projects"
            className="flex items-center gap-2 text-neutral-400 hover:text-[#C3E41D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Projects</span>
          </a>
          <div className="flex items-center gap-3">
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#C3E41D",
                  color: "#000",
                }}
              >
                <Globe className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium text-neutral-300 hover:text-[#C3E41D] hover:border-[#C3E41D] transition-colors"
              style={{ borderColor: "hsl(0 0% 20%)" }}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              View Source
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Project Title + Meta */}
        <FadeIn>
          <div className="mb-12">
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-4"
              style={{
                color: "#C3E41D",
                fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
              }}
            >
              {project.displayName}
            </h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {project.language && (
                <span className="flex items-center gap-1.5 text-sm">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: langColors[project.language] || "#888",
                    }}
                  />
                  <span style={{ color: "hsl(0 0% 60%)" }}>{project.language}</span>
                </span>
              )}
              {project.stars > 0 && (
                <span className="flex items-center gap-1 text-sm" style={{ color: "hsl(0 0% 60%)" }}>
                  <Star className="w-3.5 h-3.5" /> {project.stars}
                </span>
              )}
              {project.forks > 0 && (
                <span className="flex items-center gap-1 text-sm" style={{ color: "hsl(0 0% 60%)" }}>
                  <GitFork className="w-3.5 h-3.5" /> {project.forks}
                </span>
              )}
              <span className="text-xs" style={{ color: "hsl(0 0% 40%)" }}>
                Updated {relativeTime(project.updatedAt)}
              </span>
            </div>

            {/* Topics */}
            {project.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.topics.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider"
                    style={{
                      backgroundColor: "rgba(195, 228, 29, 0.1)",
                      color: "#C3E41D",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* AI Description */}
            {project.fullDescription && (
              <p
                className="text-lg leading-relaxed max-w-3xl"
                style={{
                  color: "hsl(0 0% 65%)",
                  fontFamily: "var(--font-antic), 'Antic', sans-serif",
                }}
              >
                {project.fullDescription}
              </p>
            )}
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content — README */}
          <div className="lg:col-span-2">
            {project.readmeContent && (
              <FadeIn delay={100}>
                <div
                  className="rounded-xl border p-6 md:p-8"
                  style={{
                    backgroundColor: "hsl(0 0% 4%)",
                    borderColor: "hsl(0 0% 15%)",
                  }}
                >
                  <h2
                    className="text-lg font-bold mb-6 pb-3 border-b"
                    style={{
                      color: "hsl(0 0% 90%)",
                      borderColor: "hsl(0 0% 15%)",
                    }}
                  >
                    📖 README
                  </h2>
                  <div
                    className="readme-styled"
                    dangerouslySetInnerHTML={{ __html: project.readmeContent }}
                  />
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar — Commits + LinkedIn */}
          <div className="space-y-6">
            {/* Commit History */}
            {project.commits.length > 0 && (
              <FadeIn delay={200}>
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "hsl(0 0% 4%)",
                    borderColor: "hsl(0 0% 15%)",
                  }}
                >
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                    style={{ color: "hsl(0 0% 80%)" }}
                  >
                    <Clock className="w-4 h-4" style={{ color: "#C3E41D" }} />
                    Recent Commits ({project.commits.length})
                  </h2>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {project.commits.map((commit) => (
                      <a
                        key={commit.sha}
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg border transition-all hover:border-[#C3E41D]/40"
                        style={{
                          backgroundColor: "hsl(0 0% 6%)",
                          borderColor: "hsl(0 0% 12%)",
                        }}
                      >
                        <p
                          className="text-xs font-medium mb-1 line-clamp-2"
                          style={{ color: "hsl(0 0% 80%)" }}
                        >
                          {commit.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <code
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: "rgba(195, 228, 29, 0.08)",
                              color: "#C3E41D",
                            }}
                          >
                            {commit.shortSha}
                          </code>
                          <span
                            className="text-[10px]"
                            style={{ color: "hsl(0 0% 40%)" }}
                          >
                            {relativeTime(commit.date)}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* LinkedIn Post Suggestion */}
            {project.linkedinPost && (
              <FadeIn delay={300}>
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "hsl(0 0% 4%)",
                    borderColor: "hsl(0 0% 15%)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                      style={{ color: "hsl(0 0% 80%)" }}
                    >
                      <LinkedinIcon
                        className="w-4 h-4"
                        style={{ color: "#0A66C2" }}
                      />
                      Share on LinkedIn
                    </h2>
                    <button
                      onClick={copyLinkedInPost}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all"
                      style={{
                        backgroundColor: copied
                          ? "rgba(195, 228, 29, 0.15)"
                          : "hsl(0 0% 12%)",
                        color: copied ? "#C3E41D" : "hsl(0 0% 60%)",
                      }}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="text-xs leading-relaxed whitespace-pre-wrap"
                    style={{
                      color: "hsl(0 0% 60%)",
                      fontFamily: "var(--font-antic), 'Antic', sans-serif",
                    }}
                  >
                    {project.linkedinPost}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
