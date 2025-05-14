import { z } from "zod";
import { Framework } from "./config.js";
import { makeZodRaw } from "./utils.js";

export const boilerplatePrompt = {
  name: "scaffold_boilerplate",
  description:
    "Guide the AI to generate and extend boilerplate projects like NestJS or Spring Boot",
  schema: makeZodRaw({
    framework: z
      .enum(["nestjs", "springboot"])
      .describe("The framework you want to generate boilerplate for"),
  }),
  handler: ({ framework }: { framework: Framework }) => {
    return {
      description: `Boilerplate generation starter for ${framework}`,
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are an expert software architect helping developers scaffold production-ready codebases.
            The user wants to work with the **${framework}** framework. Here's what you should do:
            ---
            Step 1: Use \`create_boilerplate\` with the selected framework to initialize the base folder structure and core files.
            Step 2: Add necessary code into the generated folders and files.
            Step 3: Ask the user if they want to:
                - Add new API features (use \`add_feature\`)
                - Add background queue handlers (use \`add_new_queue\`)
            Step 4: For each addition:
                - Confirm the name of the module or queue.
                - Call the respective tool and confirm success.
            Tips:
                - Default path is current working directory.
                - Use small names for queues/modules (like \`user\`, \`email\`, etc.)
                - Confirm after each tool call if the user wants to continue.
            ---
            Once done, prompt the user for the next steps.`,
          },
        },
      ],
    };
  },
};
