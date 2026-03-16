import "server-only";
import { toolRegistry } from "@penntools/core/tools";
import resourcesData from "../data/resources.json";

interface StaticResource {
  id: string;
  title: string;
  url: string;
  description: string;
  intent: string;
  semanticTags: string[];
}

function formatEntry(
  title: string,
  url: string,
  description: string,
  intent: string,
  tags: string[],
  index: number
): string {
  return [
    `${index + 1}. **${title}**`,
    `   URL: ${url}`,
    `   What it does: ${description}`,
    `   When to suggest it: ${intent}`,
    `   Keywords: ${tags.join(", ")}`,
  ].join("\n");
}

export function buildResourceContext(): string {
  const staticSection = (resourcesData.resources as StaticResource[]).map((r, i) =>
    formatEntry(r.title, r.url, r.description, r.intent, r.semanticTags, i)
  );

  const toolSection = toolRegistry.listManifests().map((m, i) =>
    formatEntry(
      m.title,
      `/tools/${m.id}`,
      m.description,
      `Use the ${m.title} tool: ${m.description}`,
      [m.id, m.title.toLowerCase()],
      i
    )
  );

  const parts: string[] = [];

  if (staticSection.length > 0) {
    parts.push(
      "## Penn Resources\n" +
        "Official University of Pennsylvania services and portals:\n\n" +
        staticSection.join("\n\n")
    );
  }

  if (toolSection.length > 0) {
    parts.push(
      "## AskPenn Tools\n" +
        "Interactive tools built into this application. Recommend the URL so the user can navigate there:\n\n" +
        toolSection.join("\n\n")
    );
  }

  return parts.join("\n\n");
}
