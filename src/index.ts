import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createBrightDataServer } from "./server.js";

// Get Bright Data credentials from environment variables
const AUTH = process.env.BRIGHT_DATA_AUTH || '';
if (!AUTH) {
  console.error("BRIGHT_DATA_AUTH environment variable must be set");
  process.exit(1);
}

const SBR_CDP = `wss://${AUTH}@brd.superproxy.io:9222`;

async function main() {
  const server = createBrightDataServer({
    name: "bright-data-browser",
    version: "1.0.0",
    cdpEndpoint: SBR_CDP
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bright Data MCP Server running");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});