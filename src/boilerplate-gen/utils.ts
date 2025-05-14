import path from "path";
import fs from "fs-extra";
import { stat } from "fs/promises";
import { ZodRawShape } from "zod";

export const makeZodRaw = <T extends ZodRawShape>(schema: T): T => schema;

export const writeFile = async (relativePath: string, content: string) => {
  const fullPath = path.resolve(process.cwd(), relativePath);
  await fs.ensureFile(fullPath);
  await fs.writeFile(fullPath, content, "utf-8");
};

export function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Boilerplate Repo Path
let basePath: string | null = null;
export const setBasePath = (root: string) => (basePath = root);
export const getBasePath = () => {
  if (!basePath) {
    throw new Error("Boilerplate not initialized.");
  }
  return basePath;
};

/**
 * Checks whether the given file or directory exists.
 * @param path - The file or directory path
 * @returns true if it exists, false otherwise
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err; // Re-throw unexpected errors
  }
}
