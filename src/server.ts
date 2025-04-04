import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { BrowserContext } from "./context.js";
import { navigation, interaction, snapshot } from "./tools/index.js";
import { pageContent } from "./resources/content.js";

import type { Tool } from "./tools/tool.js";
import type { Resource } from "./resources/resource.js";

type ServerOptions = {
  name: string;
  version: string;
  cdpEndpoint: string;
};

export function createBrightDataServer(options: ServerOptions): Server {
  const { name, version, cdpEndpoint } = options;
  
  // Create tools and resources
  const tools: Tool[] = [
    ...navigation,
    ...interaction,
    ...snapshot
  ];
  
  const resources: Resource[] = [
    pageContent
  ];
  
  // Create browser context
  const context = new BrowserContext({ cdpEndpoint });
  
  // Create MCP server
  const server = new Server({ name, version }, {
    capabilities: {
      tools: {},
      resources: {}
    }
  });

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map(tool => tool.schema) };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = tools.find(tool => tool.schema.name === request.params.name);
    if (!tool) {
      return {
        content: [{ type: 'text', text: `Tool "${request.params.name}" not found` }],
        isError: true
      };
    }

    try {
      return await tool.handle(context, request.params.arguments);
    } catch (error) {
      return {
        content: [{ type: 'text', text: String(error) }],
        isError: true
      };
    }
  });

  // Handle resource listing
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: resources.map(resource => resource.schema) };
  });

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, async request => {
    const resource = resources.find(resource => resource.schema.uri === request.params.uri);
    if (!resource) {
      return { contents: [] };
    }

    try {
      const contents = await resource.read(context, request.params.uri);
      return { contents };
    } catch (error) {
      console.error(`Error reading resource: ${error}`);
      return { contents: [] };
    }
  });

  // Handle server close
  const originalClose = server.close.bind(server);
  server.close = async () => {
    await originalClose();
    await context.close();
  };

  return server;
}