Install the MCP server:
bashCopy# Clone the repository
git clone https://github.com/yourusername/bright-data-mcp.git
cd bright-data-mcp

# Install dependencies and build
npm install
npm run build

Configure Claude Desktop to use your MCP server:
In Claude Desktop settings, add the following to your claude_desktop_config.json:
jsonCopy{
  "mcpServers": {
    "bright-data": {
      "command": "node",
      "args": ["/path/to/bright-data-mcp/build/index.js"],
      "env": {
        "BRIGHT_DATA_AUTH": "your-bright-data-auth-string"
      }
    }
  }
}

Test your integration with prompts like:

"Navigate to example.com and take a screenshot"
"Fill out the login form on mywebsite.com"
"Search for product information on an e-commerce site"
