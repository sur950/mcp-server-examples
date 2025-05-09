// McpServer setup with all tools/resources
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  initiRepoTool,
  getRepoInfoTool,
  getRepoStructureTool,
  readFileTool,
} from "./tools";
import { analyzeCodeRepository } from "./prompt";
import { repoSchema } from "./resource";

export const createCodeAnalysisMcpServer = async () => {
  console.log("🚀 Creating code-analysis MCP server");
  const server = new McpServer({
    name: "code-analysis",
    version: "1.0.0",
  });

  // Register tools
  console.log("🔧 Registering tools...");
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
  console.log("🧠 Registering prompts...");
  server.prompt(
    analyzeCodeRepository.name,
    analyzeCodeRepository.description,
    analyzeCodeRepository.schema,
    analyzeCodeRepository.handler
  );

  // Register Resources
  console.log("📦 Registering resources...");
  server.resource(repoSchema.name, repoSchema.schema, repoSchema.handler);

  return server;
};
