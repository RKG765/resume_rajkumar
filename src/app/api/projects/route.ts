import { NextResponse } from "next/server";
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  fetchReadmeContent,
} from "@/lib/github";
import { generateProjectDescription } from "@/lib/gemini";
import type { Project, ProjectsApiResponse } from "@/lib/types";

// ISR: revalidate every 1 hour — new repos auto-appear
export const revalidate = 3600;

// Allow up to 120 seconds for AI generation
export const maxDuration = 120;

/**
 * Generate a fallback description from repo metadata when AI fails.
 */
function fallbackDescription(name: string, language: string | null, topics: string[]): string {
  const lang = language ? `Built with ${language}` : "A software project";
  const topicStr = topics.length > 0 ? ` focusing on ${topics.slice(0, 3).join(", ")}` : "";
  const displayName = name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `${displayName} — ${lang}${topicStr}. Click to explore the full project details, commit history, and technical breakdown.`;
}

/**
 * GET /api/projects
 * Fetches repos from GitHub, enriches with Gemini descriptions, returns JSON.
 */
export async function GET() {
  try {
    const [repos, profile] = await Promise.all([
      fetchGitHubRepos(),
      fetchGitHubProfile(),
    ]);

    // Process top 12 repos
    const topRepos = repos.slice(0, 12);

    // Process sequentially to respect rate limits
    const projects: Project[] = [];
    for (const repo of topRepos) {
      let aiDescription: string | null = null;

      // Fetch README and generate description with Gemini
      const readme = await fetchReadmeContent(repo.name);
      if (readme) {
        aiDescription = await generateProjectDescription(readme, repo.name);
        // Small delay between Gemini calls
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Fallback if both GitHub description and AI description are empty
      const finalDescription =
        aiDescription ||
        repo.description ||
        fallbackDescription(repo.name, repo.language, repo.topics);

      projects.push({
        id: repo.id,
        name: repo.name,
        displayName: repo.name
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description,
        aiDescription: finalDescription,
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
      });
    }

    const response: ProjectsApiResponse = {
      projects,
      profile,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      {
        projects: [],
        profile: null,
        generatedAt: new Date().toISOString(),
        error: "Failed to fetch projects",
      } satisfies ProjectsApiResponse,
      { status: 500 }
    );
  }
}
