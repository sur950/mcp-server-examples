import path from "path";
import fs from "fs/promises";
import { existsSync, lstatSync, readdirSync, statSync } from "fs";
import ignore from "ignore";
import { detectLanguageByExtension } from "./file-types";
import { ZodRawShape } from "zod";
import { fileURLToPath } from "url";

export const makeZodRaw = <T extends ZodRawShape>(schema: T): T => schema;

// Utility function to check if a path is a file
export function isPathAllowed(filePath: string, roots: string[]): boolean {
  const resolvedFilePath = path.resolve(filePath);

  return roots.some((root) => {
    if (root.startsWith("file://")) {
      const rootPath = fileURLToPath(root);
      const resolvedRootPath = path.resolve(rootPath);
      return resolvedFilePath.startsWith(resolvedRootPath);
    }
    return false;
  });
}

// Root Repo Path
let repoRoot: string | null = null;
export const setRepoRoot = (root: string) => (repoRoot = root);
export const clearRepoRoot = () => (repoRoot = null);
export const getRepoRoot = () => {
  if (!repoRoot) {
    throw new Error("Repository not initialized.");
  }
  return repoRoot;
};

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_LINES = 1000;
let ig: ReturnType<typeof ignore>;

// ---------- Repo Initialization ----------
export async function initRepo(repoPath: string) {
  const resolved = path.resolve(repoPath);
  if (!existsSync(resolved)) throw new Error("Path does not exist.");
  if (!lstatSync(resolved).isDirectory())
    throw new Error("Path is not a directory.");

  const gitignorePath = path.join(resolved, ".gitignore");
  ig = ignore();
  ig.add([".git", "node_modules", "__pycache__"]);

  if (existsSync(gitignorePath)) {
    const content = await fs.readFile(gitignorePath, "utf-8");
    ig.add(
      content.split("\n").filter((line) => line.trim() && !line.startsWith("#"))
    );
  }

  return {
    repoRoot: resolved,
    message: `Initialized repository at ${resolved}\n${
      existsSync(gitignorePath) ? ".gitignore loaded." : "No .gitignore found."
    }`,
  };
}

// ---------- Repo Info ----------
export function getRepoInfo(repoRoot: string): string {
  const gitignorePath = path.join(repoRoot, ".gitignore");
  return `Repository Info:
    - Path: ${repoRoot}
    - Exists: ${existsSync(repoRoot)}
    - Is Directory: ${lstatSync(repoRoot).isDirectory()}
    - .gitignore: ${existsSync(gitignorePath) ? "present" : "not found"}`;
}

// ---------- File Structure ----------
export async function getRepoStructure(
  repoRoot: string,
  subPath: string,
  depth: number,
  maxChildren = 100
): Promise<string> {
  const lines: string[] = [];
  const resolvedPath = path.resolve(repoRoot, subPath);

  if (!resolvedPath.startsWith(repoRoot)) {
    throw new Error("Invalid path access outside repo");
  }

  const formatSize = (bytes: number): string => {
    const units = ["B", "KB", "MB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  const walk = (dir: string, level: number) => {
    if (level > depth) return;

    const entries = readdirSync(dir, { withFileTypes: true });
    let children = 0;

    for (const entry of entries) {
      if (children >= maxChildren) {
        lines.push(`${"  ".repeat(level)}... (max children reached)`);
        break;
      }

      const relPath = path.relative(repoRoot, path.join(dir, entry.name));
      if (ig.ignores(relPath)) continue;

      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        lines.push(`${"  ".repeat(level)}📁 ${entry.name}/`);
        walk(entryPath, level + 1);
      } else if (entry.isFile()) {
        const size = formatSize(statSync(entryPath).size);
        lines.push(`${"  ".repeat(level)}📄 ${entry.name} (${size})`);
      }

      children++;
    }
  };

  lines.push(`📂 ${path.relative(repoRoot, resolvedPath) || "."}/`);
  walk(resolvedPath, 1);
  return lines.join("\n");
}

// ---------- File Reader ----------
export async function readFileSafe(repoRoot: string, relativePath: string) {
  const fullPath = path.resolve(repoRoot, relativePath);

  if (!fullPath.startsWith(repoRoot)) {
    return {
      content: [
        { type: "text" as const, text: "Invalid path traversal detected." },
      ],
      isError: true,
    };
  }

  if (!existsSync(fullPath)) {
    return {
      content: [{ type: "text" as const, text: "File not found." }],
      isError: true,
    };
  }

  const stats = statSync(fullPath);
  if (stats.size > MAX_FILE_SIZE) {
    return {
      content: [
        { type: "text" as const, text: `File too large (${stats.size} bytes)` },
      ],
      isError: true,
    };
  }

  const raw = await fs.readFile(fullPath, "utf-8");
  const lines = raw.split("\n").slice(0, MAX_LINES);
  const truncated = raw.split("\n").length > MAX_LINES;
  const ext = path.extname(fullPath).toLowerCase();
  const lang = detectLanguageByExtension(ext);

  return {
    content: [
      {
        type: "text" as const,
        text: `File: ${relativePath}\nLanguage: ${lang}\nLines: ${
          lines.length
        }\n\n${lines.join("\n")}${truncated ? "\n\n[truncated]" : ""}`,
      },
    ],
  };
}
