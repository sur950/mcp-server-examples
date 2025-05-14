# 🤖 Model Context Protocol (MCP) Examples

This repository contains modular MCP agent servers built using the [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).  
Each subdirectory in `src/` is a self-contained MCP server with tools and prompts (e.g., code analysis, summarization, etc.).

> ✨ The root `src/index.ts` dynamically registers and launches all individual servers.

---

## 📦 Structure

```bash
src/
├── index.ts         # Main launcher to register all MCP servers
├── code-analysis/   # Analyzes local code repositories
│   ├── tools.ts     # Tool implementations
│   ├── server.ts    # Registers tools & prompts with MCP
│   ├── utils.ts     # Helper functions (file reading, structure)
│   ├── prompt.ts    # Prompt handler definitions
│   └── README.md    # Module-specific usage docs
...
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Set up local `.env`

```bash
echo "PORT=3000" > .env
```

### 3. Start the MCP server

```bash
npm run dev
```

> The server will run at:
> `http://localhost:3000/mcp`

---

## 🧪 Debugging / Manual Testing

You can test the server using **MCP Inspector**, a UI debugger for MCP-based servers.

### Start the MCP Inspector (in another terminal)

```bash
npm run debug
```

Then open:
👉 `http://127.0.0.1:6274`
and connect to `http://localhost:3000/mcp` using **Streamable HTTP**.

---

## 🧩 Supported MCP Modules

| Folder                                                | Description                                          | Transport        |
| ----------------------------------------------------- | ---------------------------------------------------- | ---------------- |
| [`code-analysis`](./src/code-analysis/README.md)      | Analyze and explore local code repositories          | Streamable HTTP  |
| [`boilerplate-gen`](./src/boilerplate-gen/README.md)  | Generate starter codebases and incrementally add features | STDIO            |
| *(more coming soon)*                                  | ...                                                  | ...              |

---

## 📜 License

```bash
MIT License Copyright (c) 2025 suresh konakanchi

Permission is hereby granted,
free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice
(including the next paragraph) shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
