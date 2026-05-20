/**
 * Gemini 2.5 Flash service — generates project descriptions from README content.
 * Uses Google Generative Language API (REST).
 * 
 * Note: Gemini 2.5 Flash uses "thinking" tokens by default.
 * We set thinkingBudget to 0 for simple text generation to avoid
 * output truncation from internal reasoning consuming the token budget.
 */

import { marked } from "marked";
import { convert } from "html-to-text";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// In-memory cache
const descriptionCache = new Map<string, string>();

/**
 * Convert Markdown README content to HTML using marked, and then
 * to clean plain text using html-to-text. Collapses redundant newlines.
 */
async function cleanReadmeContent(content: string): Promise<string> {
  if (!content) return "";
  try {
    const html = await marked.parse(content);
    const cleanText = convert(html, {
      wordwrap: false,
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", format: "skip" },
      ],
    });
    return cleanText.replace(/\n{3,}/g, "\n\n").trim();
  } catch (error) {
    console.error("Failed to clean README content:", error);
    return content;
  }
}

/**
 * Generate a concise 2-sentence portfolio description from a README.
 * Used for project cards on the homepage.
 */
export async function generateProjectDescription(
  readmeContent: string,
  repoName: string
): Promise<string | null> {
  if (descriptionCache.has(repoName)) {
    return descriptionCache.get(repoName)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const cleanedReadme = await cleanReadmeContent(readmeContent);

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional portfolio writer. Given a GitHub repository README, write a compelling 2-sentence description for a developer portfolio card. Be concise, highlight the tech stack and what makes it interesting. Do NOT use markdown. Do NOT mention the README or repository directly. Write as if describing a finished product.\n\nRepository name: ${repoName}\n\nREADME content:\n${cleanedReadme}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      console.error(`Gemini API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;

    if (text) {
      descriptionCache.set(repoName, text);
    }

    return text;
  } catch (error) {
    console.error("Gemini description call failed:", error);
    return null;
  }
}

/**
 * Generate a full 4-5 sentence description for a project detail page.
 */
export async function generateFullDescription(
  readmeContent: string,
  repoName: string
): Promise<string | null> {
  const cacheKey = `full_${repoName}`;
  if (descriptionCache.has(cacheKey)) {
    return descriptionCache.get(cacheKey)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const cleanedReadme = await cleanReadmeContent(readmeContent);

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional portfolio writer. Given a GitHub repository README, write a detailed 4-5 sentence description for a project showcase page. Cover: what the project does, the technology stack used, key features, and what problem it solves. Write in a professional but engaging tone. Do NOT use markdown formatting. Do NOT mention the README directly.\n\nRepository name: ${repoName}\n\nREADME content:\n${cleanedReadme}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      console.error(`Gemini full desc error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;

    if (text) {
      descriptionCache.set(cacheKey, text);
    }

    return text;
  } catch (error) {
    console.error("Gemini full description failed:", error);
    return null;
  }
}

/**
 * Generate a LinkedIn post suggestion for a project.
 * Uses separate API key to avoid rate limits.
 */
export async function generateLinkedInPost(
  readmeContent: string,
  repoName: string,
  repoUrl: string,
  language: string | null,
  homepage: string | null
): Promise<string | null> {
  const cacheKey = `linkedin_${repoName}`;
  if (descriptionCache.has(cacheKey)) {
    return descriptionCache.get(cacheKey)!;
  }

  const apiKey = process.env.GEMINI_API_KEY_LINKEDIN;
  if (!apiKey) return null;

  const cleanedReadme = await cleanReadmeContent(readmeContent);

  try {
    const liveDemo = homepage ? `\nLive demo: ${homepage}` : "";
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a LinkedIn content strategist for a software developer. Write a professional, engaging LinkedIn post announcing/showcasing this project. The post should:

1. Start with an attention-grabbing hook (use an emoji)
2. Explain what the project does in 2-3 sentences
3. Highlight the tech stack and key technical achievements
4. Include a call-to-action (try it out, give feedback, star the repo)
5. End with 5-7 relevant hashtags

Keep it under 250 words. Professional but not boring. Sound authentic, not like AI.

Project: ${repoName}
Language: ${language || "Multiple"}
GitHub: ${repoUrl}${liveDemo}

README content:
${cleanedReadme}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      console.error(`Gemini LinkedIn error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;

    if (text) {
      descriptionCache.set(cacheKey, text);
    }

    return text;
  } catch (error) {
    console.error("Gemini LinkedIn post failed:", error);
    return null;
  }
}
