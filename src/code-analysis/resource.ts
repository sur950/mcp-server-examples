import { getRepoRoot, getRepoStructure } from "./utils";

export const repoSchema = {
  name: "repo-schema",
  schema: "schema://main",
  handler: async () => {
    const repoRoot = getRepoRoot();
    if (!repoRoot) {
      return {
        contents: [
          {
            uri: "schema://main",
            text: "❌ Repository not initialized.",
          },
        ],
        isError: true,
      };
    }

    const summary = await getRepoStructure(repoRoot, "", 5);
    return {
      contents: [
        {
          uri: "schema://main",
          text: summary,
        },
      ],
    };
  },
};