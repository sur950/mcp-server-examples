import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  initiRepoTool,
  getRepoInfoTool,
  getRepoStructureTool,
  readFileTool,
} from "./tools.js";
import { analyzeCodeRepository } from "./prompt.js";
import { repoSchema } from "./resource.js";

export const createCodeAnalysisMcpServer = async () => {
  console.warn("🚀 Creating code-analysis MCP server");
  const server = new McpServer({
    name: "code-analysis",
    version: "1.0.0",
  });

  // Register tools
  console.warn("🔧 Registering code analysis tools...");
  server.tool(
    initiRepoTool.name,
    initiRepoTool.description,
    initiRepoTool.schema,
    initiRepoTool.handler
  );
  server.tool(
    getRepoInfoTool.name,
    getRepoInfoTool.description,
    getRepoInfoTool.schema,
    getRepoInfoTool.handler
  );
  server.tool(
    getRepoStructureTool.name,
    getRepoStructureTool.description,
    getRepoStructureTool.schema,
    getRepoStructureTool.handler
  );
  server.tool(
    readFileTool.name,
    readFileTool.description,
    readFileTool.schema,
    readFileTool.handler
  );

  // Register prompt
  console.warn("🧠 Registering code analysis prompts...");
  server.prompt(
    analyzeCodeRepository.name,
    analyzeCodeRepository.description,
    analyzeCodeRepository.schema,
    analyzeCodeRepository.handler
  );

  // Register Resources
  console.warn("📦 Registering code analysis resources...");
  server.resource(repoSchema.name, repoSchema.schema, repoSchema.handler);

  return server;
};
