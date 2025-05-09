// Express server + MCP transport setup
import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { createCodeAnalysisMcpServer } from "./code-analysis/server";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(express.json());

// In-memory Map to track sessionId → transport
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  // CASE 1: Reuse known session
  if (sessionId && transports[sessionId]) {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res, req.body);
    return;
  }

  // CASE 2: Initialize new session
  if (!sessionId && isInitializeRequest(req.body)) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log("✅ Initialized new session:", sid);
      },
    });

    // Resgiter all the MCP server's
    const server = await createCodeAnalysisMcpServer();

    try {
      await server.connect(transport);
      console.log("✅ MCP server connected to transport");
    } catch (err) {
      console.error("❌ Failed to connect MCP server:", err);
    }

    // Clean up closed sessions
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log("❌ Session closed:", transport.sessionId);
        delete transports[transport.sessionId];
      }
    };

    // Forward the init request *after a microtask tick*
    setImmediate(() => {
      console.log("📨 Forwarding request to transport.handleRequest");
      transport.handleRequest(req, res, req.body).catch((err) => {
        console.error("❌ handleRequest failed:", err);
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal Server Error",
          },
          id: req.body?.id ?? null,
        });
      });
    });

    return;
  }

  // CASE 3: No valid session found
  res.status(400).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Bad Request: No valid session ID",
    },
    id: req.body?.id ?? null,
  });
});

const handleSessionRequest = async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  const transport = transports[sessionId];
  if (!transport) return res.status(400).send("Invalid or missing session ID");

  await transport.handleRequest(req, res);
};

app.get("/mcp", (req, res, next) => {
  handleSessionRequest(req, res).catch(next); // SSE support
});
app.delete("/mcp", (req, res, next) => {
  handleSessionRequest(req, res).catch(next); // Session termination
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MCP server listening on http://localhost:${PORT}/mcp`);
});
