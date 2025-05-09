import { z } from "zod";
import {
  getRepoInfo,
  getRepoStructure,
  readFileSafe,
  initRepo,
  makeZodRaw,
  setRepoRoot,
  getRepoRoot,
} from "./utils.js";

export const initiRepoTool = {
  name: "init_repo",
  schema: makeZodRaw({
    path: z
      .string()
      .trim()
      .min(1, "Path must contain at least 1 character")
      .max(5000, "Path must be less than 5000 characters")
      .describe("Absolute local path to the code repo (Root level)"),
  }),
  description: "Initialize a code repository for analysis.",
  handler: async ({ path }: { path: string }) => {
    if (!path) {
      return {
        content: [
          { type: "text" as const, text: "❌ Missing 'path' argument." },
        ],
        isError: true,
      };
    }

    try {
      const result = await initRepo(path);
      setRepoRoot(result.repoRoot);
      return { content: [{ type: "text" as const, text: result.message }] };
    } catch (e: any) {
      return {
        content: [
          { type: "text" as const, text: `Initialization error: ${e.message}` },
        ],
        isError: true,
      };
    }
  },
};

export const getRepoInfoTool = {
  name: "get_repo_info",
  schema: makeZodRaw({}),
  description: "Get information about the initialized code repository.",
  handler: async () => {
    const repoRoot = getRepoRoot();
    if (!repoRoot) {
      return {
        content: [
          { type: "text" as const, text: "Repository not initialized." },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: getRepoInfo(repoRoot) }],
    };
  },
};

export const getRepoStructureTool = {
  name: "get_repo_structure",
  schema: makeZodRaw({
    subPath: z.string().optional().describe("Subpath to explore"),
    depth: z.number().optional().describe("Depth of exploration"),
  }),
  description: "Get the structure of the code repository.",
  handler: async ({ subPath, depth }: { subPath?: string; depth?: number }) => {
    const repoRoot = getRepoRoot();
    if (!repoRoot) {
      return {
        content: [
          { type: "text" as const, text: "Repository not initialized." },
        ],
        isError: true,
      };
    }
    if (depth && depth < 1) {
      return {
        content: [
          { type: "text" as const, text: "Depth must be greater than 0" },
        ],
        isError: true,
      };
    }
    if (depth && depth > 5) {
      return {
        content: [{ type: "text" as const, text: "Depth must be less than 5" }],
        isError: true,
      };
    }
    if (subPath && subPath.length < 1) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Subpath must be at least 1 character",
          },
        ],
        isError: true,
      };
    }

    const output = await getRepoStructure(repoRoot, subPath || "", depth || 3);
    return { content: [{ type: "text" as const, text: output }] };
  },
};

export const readFileTool = {
  name: "read_file",
  schema: makeZodRaw({
    filePath: z
      .string()
      .trim()
      .min(1, "filePath must contain at least 1 character")
      .max(5000, "filePath must be less than 5000 characters")
      .describe("Path to the file to read"),
  }),
  description: "Read a file from the code repository.",
  handler: async ({ filePath }: { filePath: string }) => {
    const repoRoot = getRepoRoot();
    if (!repoRoot) {
      return {
        content: [
          { type: "text" as const, text: "Repository not initialized." },
        ],
        isError: true,
      };
    }
    if (!filePath) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Missing 'filePath' argument.",
          },
        ],
        isError: true,
      };
    }

    const output = await readFileSafe(repoRoot, filePath);
    return output;
  },
};
