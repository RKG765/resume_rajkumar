/**
 * Groq LLM service — summarizes GitHub README content into
 * portfolio-ready project descriptions.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// In-memory cache to avoid re-processing the same repos across requests
const summaryCache = new Map<string, string>();

/**
 * Summarize a README into a concise, professional portfolio description.
 * Returns null if Groq API is unavailable or key is missing.
 */
export async function summarizeReadme(
  readmeContent: string,
  repoName: string
): Promise<string | null> {
  // Check cache first
  if (summaryCache.has(repoName)) {
    return summaryCache.get(repoName)!;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "gsk_your_key_here") {
    return null; // Graceful fallback — will use GitHub description instead
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are a professional portfolio writer. Given a GitHub repository README, write a compelling 2-sentence description for a developer portfolio. Be concise, highlight the tech stack and what makes it interesting. Do NOT use markdown. Do NOT mention the README or repository directly. Write as if describing a finished product.`,
          },
          {
            role: "user",
            content: `Repository name: ${repoName}\n\nREADME content:\n${readmeContent}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      console.error(`Groq API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content?.trim() ?? null;

    // Cache the result
    if (summary) {
      summaryCache.set(repoName, summary);
    }

    return summary;
  } catch (error) {
    console.error("Groq API call failed:", error);
    return null;
  }
}
