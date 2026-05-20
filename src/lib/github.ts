import { GitHubRepo, GitHubProfile, GitHubCommit, Commit } from "./types";

const GITHUB_API = "https://api.github.com";
const USERNAME = "rkg765";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

/**
 * Fetch all public repos for the user, sorted by most recently pushed.
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${USERNAME}/repos?per_page=100&sort=pushed&direction=desc`,
    {
      headers: GITHUB_HEADERS,
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error(`GitHub repos fetch failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((repo) => !repo.fork && !repo.archived);
}

/**
 * Helper to discover a README file inside top-level subfolders if the root README is missing.
 * Returns the path (e.g. "deep_search_engine/README.md") or null.
 */
async function discoverReadmePath(repoName: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${USERNAME}/${repoName}/contents`, {
      headers: GITHUB_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const items = await res.json();
    if (!Array.isArray(items)) return null;

    const dirs = items.filter((item) => item.type === "dir");

    for (const dir of dirs) {
      const dirRes = await fetch(
        `${GITHUB_API}/repos/${USERNAME}/${repoName}/contents/${dir.name}`,
        {
          headers: GITHUB_HEADERS,
          next: { revalidate: 3600 },
        }
      );
      if (!dirRes.ok) continue;
      const dirItems = await dirRes.json();
      if (!Array.isArray(dirItems)) continue;

      const readmeItem = dirItems.find(
        (item) => item.type === "file" && item.name.toLowerCase().startsWith("readme")
      );

      if (readmeItem) {
        return readmeItem.path;
      }
    }
  } catch (error) {
    console.error(`Error discovering README path for ${repoName}:`, error);
  }
  return null;
}

/**
 * Fetch the raw README content for a specific repo.
 * Returns null if README doesn't exist or fetch fails.
 */
export async function fetchReadmeContent(
  repoName: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${USERNAME}/${repoName}/readme`,
      {
        headers: {
          ...GITHUB_HEADERS,
          Accept: "application/vnd.github.raw+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const content = await res.text();
      return content.slice(0, 4000);
    }

    if (res.status === 404) {
      const subpath = await discoverReadmePath(repoName);
      if (subpath) {
        const subRes = await fetch(
          `${GITHUB_API}/repos/${USERNAME}/${repoName}/contents/${subpath}`,
          {
            headers: {
              ...GITHUB_HEADERS,
              Accept: "application/vnd.github.raw+json",
            },
            next: { revalidate: 3600 },
          }
        );
        if (subRes.ok) {
          const content = await subRes.text();
          return content.slice(0, 4000);
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch full README as pre-rendered HTML from GitHub.
 * Uses the GitHub HTML media type for reliable browser rendering.
 */
export async function fetchFullReadme(
  repoName: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${USERNAME}/${repoName}/readme`,
      {
        headers: {
          ...GITHUB_HEADERS,
          Accept: "application/vnd.github.html+json",
        },
        next: { revalidate: 86400 },
      }
    );

    if (res.ok) {
      return await res.text();
    }

    if (res.status === 404) {
      const subpath = await discoverReadmePath(repoName);
      if (subpath) {
        const subRes = await fetch(
          `${GITHUB_API}/repos/${USERNAME}/${repoName}/contents/${subpath}`,
          {
            headers: {
              ...GITHUB_HEADERS,
              Accept: "application/vnd.github.html+json",
            },
            next: { revalidate: 86400 },
          }
        );
        if (subRes.ok) {
          return await subRes.text();
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch the user's GitHub profile.
 */
export async function fetchGitHubProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${USERNAME}`, {
      headers: GITHUB_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch last N commits for a repo.
 */
export async function fetchRepoCommits(
  repoName: string,
  count: number = 20
): Promise<Commit[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${USERNAME}/${repoName}/commits?per_page=${count}`,
      {
        headers: GITHUB_HEADERS,
        next: { revalidate: 86400 }, // Revalidate daily
      }
    );

    if (!res.ok) return [];

    const rawCommits: GitHubCommit[] = await res.json();

    return rawCommits.map((c) => ({
      sha: c.sha,
      shortSha: c.sha.substring(0, 7),
      message: c.commit.message.split("\n")[0], // First line only
      date: c.commit.author.date,
      author: c.commit.author.name,
      url: c.html_url,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch single repo details.
 */
export async function fetchRepoDetails(
  repoName: string
): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${USERNAME}/${repoName}`,
      {
        headers: GITHUB_HEADERS,
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
