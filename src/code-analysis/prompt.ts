import { z } from "zod";
import { makeZodRaw } from "./utils.js";

export const analyzeCodeRepository = {
  name: "analyze_code_repository",
  schema: makeZodRaw({
    codebase_path: z
      .string()
      .trim()
      .min(1, "Codebase path must contain at least 1 character")
      .max(5000, "Codebase path must be less than 5000 characters")
      .describe("Absolute path to the code repository"),
  }),
  description: "Analyze a code repository and answer questions about it.",
  handler: ({ codebase_path }: { codebase_path: string }) => {
    return {
      description: `Codebase analysis starter for ${codebase_path}`,
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are an AI code analysis assistant operating within the MCP server "code-analysis".
            The target codebase is at: **${codebase_path}**
            Your task is to analyze it and answer user questions using these tools only:
            
            1. \`initialize_repository(path)\` - Initialize repo.
            2. \`get_repo_info()\` - Verify initialization.
            3. \`get_repo_structure(subPath?, depth?)\` - Explore directory tree.
            4. \`read_file(filePath)\` - Read source files.
            
            ## Instructions:
            - Begin by initializing the repo and verifying it.
            - Read files like README, config, or entrypoints for overview.
            - Explore directories relevant to the user's query.
            - Use \`<investigation_log>\` to track reasoning steps and tool calls.
            - Be precise and evidence-based. Avoid guessing.
            - Use brief summaries (under 1000 characters) unless asked for detail.
            - When ready, ask the user for their specific question.
            
            Do not assume access to any tool not listed above.`,
          },
        },
      ],
    };
  },
};
