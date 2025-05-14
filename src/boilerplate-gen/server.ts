import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  generateBoilerplateTool,
  listSupportedFrameworksTool,
  getFrameworkDetailsTool,
  addFeatureTool,
  addQueueTool,
} from "./tools.js";
import { boilerplatePrompt } from "./prompt.js";

export const createBoilerplateGenServer = async () => {
  console.warn("🚀 Creating boilerplate-gen MCP server");
  const server = new McpServer({
    name: "boilerplate-gen",
    version: "1.0.0",
  });

  console.warn("🔧 Registering boilerplate tools...");
  server.tool(
    generateBoilerplateTool.name,
    generateBoilerplateTool.description,
    generateBoilerplateTool.schema,
    generateBoilerplateTool.handler
  );
  server.tool(
    listSupportedFrameworksTool.name,
    listSupportedFrameworksTool.description,
    listSupportedFrameworksTool.schema,
    listSupportedFrameworksTool.handler
  );
  server.tool(
    getFrameworkDetailsTool.name,
    getFrameworkDetailsTool.description,
    getFrameworkDetailsTool.schema,
    getFrameworkDetailsTool.handler
  );
  server.tool(
    addFeatureTool.name,
    addFeatureTool.description,
    addFeatureTool.schema,
    addFeatureTool.handler
  );
  server.tool(
    addQueueTool.name,
    addQueueTool.description,
    addQueueTool.schema,
    addQueueTool.handler
  );

  console.warn("🧠 Registering boilerplate prompts...");
  server.prompt(
    boilerplatePrompt.name,
    boilerplatePrompt.description,
    boilerplatePrompt.schema,
    boilerplatePrompt.handler
  );

  return server;
};
