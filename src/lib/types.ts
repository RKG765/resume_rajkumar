// ─── GitHub API Response Types ──────────────────────────────────────────

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

// ─── Processed Project (after AI enrichment) ────────────────────────────

export interface Project {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  aiDescription: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  createdAt: string;
}

// ─── Commit (processed) ─────────────────────────────────────────────────

export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  author: string;
  url: string;
}

// ─── Project Detail Page ────────────────────────────────────────────────

export interface ProjectDetail extends Project {
  readmeContent: string | null;
  commits: Commit[];
  fullDescription: string | null;
  linkedinPost: string | null;
}

// ─── API Responses ──────────────────────────────────────────────────────

export interface ProjectsApiResponse {
  projects: Project[];
  profile: GitHubProfile | null;
  generatedAt: string;
  error?: string;
}

export interface ProjectDetailApiResponse {
  project: ProjectDetail | null;
  generatedAt: string;
  error?: string;
}
