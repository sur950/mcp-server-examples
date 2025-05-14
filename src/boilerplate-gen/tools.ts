import fs from "fs-extra";
import path from "path";
import { z } from "zod";
import { BoilerplateConfig, boilerplateConfigs, Framework } from "./config.js";
import {
  capitalize,
  fileExists,
  getBasePath,
  makeZodRaw,
  setBasePath,
  writeFile,
} from "./utils.js";

export const generateBoilerplateTool = {
  name: "create_boilerplate",
  description:
    "Generate production-ready boilerplate codebase for selected framework",
  schema: makeZodRaw({
    framework: z
      .enum(["nestjs", "springboot"])
      .describe("Framework to scaffold"),
  }),
  handler: async ({ framework }: { framework: Framework }) => {
    try {
      const config: BoilerplateConfig = boilerplateConfigs[framework];
      const cwd = process.cwd();
      const createdPaths: string[] = [];
      const rootPath = path.join(cwd, framework.toLowerCase());
      await fs.ensureDir(rootPath);
      setBasePath(rootPath);

      // Step 1: Create folders
      for (const folder of Object.keys(config.folderResponsibilities)) {
        const fullPath = path.join(rootPath, folder);
        await fs.ensureDir(fullPath);
        createdPaths.push(fullPath);
      }

      // Step 2: Create files with placeholder descriptions
      for (const [relPath, comment] of Object.entries(config.fileTemplates)) {
        const fullPath = path.join(rootPath, relPath);
        await fs.ensureDir(path.dirname(fullPath));
        const content = `// ${comment}\n\n`;
        await fs.writeFile(fullPath, content, "utf-8");
        createdPaths.push(fullPath);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `✅ ${framework} boilerplate generated at ${rootPath} with ${createdPaths.length} folders/files.`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error generating boilerplate: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};

export const listSupportedFrameworksTool = {
  name: "list_supported_frameworks",
  description: "Lists all available frameworks for boilerplate generation",
  schema: makeZodRaw({}),
  handler: async () => ({
    content: [
      {
        type: "text" as const,
        text: Object.keys(boilerplateConfigs)
          .map((fw) => `- ${fw}`)
          .join("\n"),
      },
    ],
  }),
};

export const getFrameworkDetailsTool = {
  name: "get_framework_details",
  description: "Shows full boilerplate config for selected framework",
  schema: makeZodRaw({
    framework: z.enum(["nestjs", "springboot"]),
  }),
  handler: async ({ framework }: { framework: Framework }) => {
    const config = boilerplateConfigs[framework];
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(config, null, 2),
        },
      ],
    };
  },
};

export const addFeatureTool = {
  name: "add_feature",
  description: "Add a new API feature/module to the boilerplate",
  schema: makeZodRaw({
    framework: z
      .enum(["nestjs", "springboot"])
      .describe("Framework to add module to"),
    moduleName: z.string().min(1).describe("Name of the Module to add"),
  }),
  handler: async ({
    framework,
    moduleName,
  }: {
    framework: Framework;
    moduleName: string;
  }) => {
    const logs: string[] = [];
    try {
      const appName = getBasePath();

      if (framework === "nestjs") {
        const base = `${appName}/src/api/${moduleName}`;
        const files = {
          [`${base}/${moduleName}.controller.ts`]: `// TODO: Define REST endpoints for ${moduleName}`,
          [`${base}/${moduleName}.service.ts`]: `// Service for ${moduleName}`,
          [`${base}/${moduleName}.module.ts`]: `// Module for ${moduleName}`,
          [`${base}/${moduleName}.transform.ts`]: `// Transformer for ${moduleName}`,
          [`${base}/dto/sample.dto.ts`]: `// Sample DTO for ${moduleName}`,
        };
        for (const [filePath, content] of Object.entries(files)) {
          if (await fileExists(filePath)) {
            logs.push(`⚠️ Skipped (already exists): ${filePath}`);
          } else {
            await writeFile(filePath, content);
            logs.push(`✅ Created: ${filePath}`);
          }
        }
      } else if (framework === "springboot") {
        const className = capitalize(moduleName);
        const base = `${appName}/main/java/com/example/${moduleName}`;
        const files = {
          [`${base}/controller/${className}Controller.java`]: `// Controller for ${moduleName}`,
          [`${base}/service/${moduleName}Service.java`]: `// Service for ${moduleName}`,
          [`${base}/dto/sampleDTO.java`]: `// Sample DTO for ${moduleName}`,
          [`${base}/repository/${moduleName}Repository.java`]: `// Repository for ${moduleName}`,
        };
        for (const [filePath, content] of Object.entries(files)) {
          if (await fileExists(filePath)) {
            logs.push(`⚠️ Skipped (already exists): ${filePath}`);
          } else {
            await writeFile(filePath, content);
            logs.push(`✅ Created: ${filePath}`);
          }
        }
      }

      return {
        content: [{ type: "text" as const, text: logs.join("\n") }],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error adding feature: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};

export const addQueueTool = {
  name: "add_new_queue",
  description: "Add a structured background queue for the selected framework",
  schema: makeZodRaw({
    framework: z
      .enum(["nestjs", "springboot"])
      .describe("Framework to add queue to"),
    queueName: z.string().min(1).describe("Name of the queue"),
  }),
  handler: async ({
    framework,
    queueName,
  }: {
    framework: Framework;
    queueName: string;
  }) => {
    const logs: string[] = [];
    try {
      const appName = getBasePath();

      if (framework === "nestjs") {
        const queueDir = `${appName}/src/background/queues/${queueName}`;
        const files = [
          {
            path: `${queueDir}/${queueName}-queue.events.ts`,
            content: `// Events for ${queueName} queue`,
          },
          {
            path: `${queueDir}/${queueName}-queue.module.ts`,
            content: `// Module for ${queueName} queue`,
          },
          {
            path: `${queueDir}/${queueName}-queue.service.ts`,
            content: `// Service logic for ${queueName} queue`,
          },
          {
            path: `${queueDir}/${queueName}.processor.ts`,
            content: `// Processor to consume jobs for ${queueName}`,
          },
          {
            path: `${queueDir}/${queueName}.queue.ts`,
            content: `// Queue publisher for ${queueName}`,
          },
        ];

        for (const file of files) {
          await writeFile(file.path, file.content);
          logs.push(`✅ Created: ${file.path}`);
        }
      } else if (framework === "springboot") {
        const basePath = `${appName}/main/java/com/example/background/${queueName}`;
        const filePath = `${basePath}/${capitalize(queueName)}Listener.java`;
        const content = `// Background queue listener for ${queueName}`;
        await writeFile(filePath, content);
        logs.push(`✅ Created: ${filePath}`);
      }

      return {
        content: [{ type: "text" as const, text: logs.join("\n") }],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error adding queue: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};
