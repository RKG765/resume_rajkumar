import { NextResponse } from "next/server";
import {
  fetchRepoDetails,
  fetchFullReadme,
  fetchRepoCommits,
  fetchReadmeContent,
} from "@/lib/github";
import { generateFullDescription, generateLinkedInPost } from "@/lib/gemini";
import type { ProjectDetail, ProjectDetailApiResponse } from "@/lib/types";

// Revalidate daily — picks up new commits automatically
export const revalidate = 86400;

// Allow up to 120 seconds for AI generation
export const maxDuration = 120;

/**
 * GET /api/projects/[slug]
 * Fetches full project details: README, commits, AI description, LinkedIn post.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Fetch everything in parallel
    const [repo, fullReadme, shortReadme, commits] = await Promise.all([
      fetchRepoDetails(slug),
      fetchFullReadme(slug),
      fetchReadmeContent(slug),
      fetchRepoCommits(slug, 20),
    ]);

    if (!repo) {
      return NextResponse.json(
        {
          project: null,
          generatedAt: new Date().toISOString(),
          error: "Repository not found",
        } satisfies ProjectDetailApiResponse,
        { status: 404 }
      );
    }

    // Generate AI descriptions using Gemini
    let fullDescription: string | null = null;
    let linkedinPost: string | null = null;

    if (shortReadme) {
      // Run both AI calls in parallel (different API keys)
      [fullDescription, linkedinPost] = await Promise.all([
        generateFullDescription(shortReadme, repo.name),
        generateLinkedInPost(
          shortReadme,
          repo.name,
          repo.html_url,
          repo.language,
          repo.homepage
        ),
      ]);
    }

    const project: ProjectDetail = {
      id: repo.id,
      name: repo.name,
      displayName: repo.name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      description: repo.description,
      aiDescription: fullDescription || repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      readmeContent: fullReadme,
      commits,
      fullDescription,
      linkedinPost,
    };

    const response: ProjectDetailApiResponse = {
      project,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Project detail error for ${slug}:`, error);
    return NextResponse.json(
      {
        project: null,
        generatedAt: new Date().toISOString(),
        error: "Failed to fetch project details",
      } satisfies ProjectDetailApiResponse,
      { status: 500 }
    );
  }
}
