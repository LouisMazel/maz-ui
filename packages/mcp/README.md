# Maz-UI MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to the Maz-UI component library documentation. This server enables AI agents to help developers with Vue.js/Nuxt.js component implementation, usage examples, and best practices.

- [Maz-UI MCP Server](#maz-ui-mcp-server)
  - [Features](#features)
  - [AI Assistant Configuration](#ai-assistant-configuration)
    - [Claude Code](#claude-code)
    - [Claude Desktop](#claude-desktop)
    - [Cursor IDE](#cursor-ide)
    - [Windsurf](#windsurf)
    - [Visual Studio Code (Copilot)](#visual-studio-code-copilot)
    - [Cline](#cline)
  - [Available Tools](#available-tools)
    - [Search Tools](#search-tools)
    - [List Tools](#list-tools)
  - [Available Resources](#available-resources)
    - [Core Resources](#core-resources)
  - [Development](#development)
    - [Server Architecture](#server-architecture)
    - [Running Tests](#running-tests)
    - [Type Checking](#type-checking)
    - [Debugging with MCP Inspector](#debugging-with-mcp-inspector)
  - [License](#license)
  - [Support](#support)

## Features

- **50+ Vue Components** - Complete documentation for all Maz-UI components
- **11 Comprehensive Guides** - Installation, theming, dark mode, and framework-specific guides
- **14 Vue Composables** - Reusable composition functions with usage examples
- **5 Vue Directives** - Custom directives for enhanced functionality
- **4 Vue Plugins** - Toast, dialog, AOS animations, and wait overlay plugins
- **20+ Utility Helpers** - Date formatting, currency handling, string manipulation, and more
- **Real-time Search** - Smart search across all documentation types
- **TypeScript Support** - Full type safety and IntelliSense integration

## AI Assistant Configuration

### Claude Code

1. Run the following command:

   ```bash
   claude mcp add maz-ui npx @maz-ui/mcp --scope (project | local | user)
   ```

2. Will add the following to your `~/.mcp.json` (for project scope):

   ```json
   {
     "mcpServers": {
       "maz-ui": {
         "type": "stdio",
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

3. Restart Claude code to apply the new configuration.

### Claude Desktop

1. Open Claude desktop and navigate to Settings.

2. Under the Developer tab, tap Edit Config to open the configuration file.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "maz-ui": {
         "type": "stdio",
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

4. Save the configuration file and restart Claude desktop.

5. From the new chat screen, you should see a hammer (MCP) icon appear with the new MCP server available.

### Cursor IDE

1. Open Cursor and create a .cursor directory in your project root if it doesn't exist.

2. Create a .cursor/mcp.json file if it doesn't exist and open it.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "maz-ui": {
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

4. Save the configuration file.

5. Open Cursor and navigate to Settings/MCP. You should see a green active status after the server is successfully connected.

### Windsurf

1. Open Windsurf and navigate to the Cascade assistant.

2. Tap on the hammer (MCP) icon, then Configure to open the configuration file.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "maz-ui": {
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

4. Save the configuration file and reload by tapping Refresh in the Cascade assistant.

5. You should see a green active status after the server is successfully connected.

### Visual Studio Code (Copilot)

1. Open VS Code and create a .vscode directory in your project root if it doesn't exist.

2. Create a .vscode/mcp.json file if it doesn't exist and open it.

3. Add the following configuration:

   ```json
   {
     "servers": {
       "maz-ui": {
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

4. Save the configuration file.

5. Open Copilot chat and switch to "Agent" mode. You should see a tool icon that you can tap to confirm the MCP tools are available. Once you begin using the server, you will be prompted to enter your personal access token. Enter the token that you created earlier.

### Cline

1. Open the Cline extension in VS Code and tap the MCP Servers icon.

2. Tap Configure MCP Servers to open the configuration file.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "maz-ui": {
         "command": "npx",
         "args": ["@maz-ui/mcp"]
       }
     }
   }
   ```

4. Save the configuration file. Cline should automatically reload the configuration.

5. You should see a green active status after the server is successfully connected.

## Available Tools

The MCP server provides the following tools that AI assistants can use:

### Search Tools

- **`search_components`** - Search components by name or functionality

  ```txt
  Parameters: { query: string }
  Example: "button", "input", "date picker"
  ```

- **`search_documentation`** - Search across all documentation types

  ```txt
  Parameters: { query: string }
  Example: "theme", "validation", "accessibility"
  ```

### List Tools

- **`get_getting_started`** - Get the getting started guide
- **`list_all_components`** - Get a complete list of available components
- **`list_guides`** - List all installation and usage guides
- **`list_composables`** - List all Vue composables
- **`list_directives`** - List all Vue directives
- **`list_plugins`** - List all Vue plugins
- **`list_helpers`** - List all utility helpers

## Available Resources

The server exposes documentation through MCP resources with the following URI patterns:

### Core Resources

- **`maz-ui://overview`** - Complete library overview and introduction
- **`maz-ui://component/{ComponentName}`** - Individual component documentation
  - Examples: `maz-ui://component/MazBtn`, `maz-ui://component/MazInput`
- **`maz-ui://guide/{guideName}`** - Setup and usage guides
  - Examples: `maz-ui://guide/getting-started`, `maz-ui://guide/vue`, `maz-ui://guide/nuxt`
- **`maz-ui://composable/{composableName}`** - Vue composable documentation
  - Examples: `maz-ui://composable/use-toast`, `maz-ui://composable/use-dialog`
- **`maz-ui://directive/{directiveName}`** - Vue directive documentation
  - Examples: `maz-ui://directive/tooltip`, `maz-ui://directive/click-outside`
- **`maz-ui://plugin/{pluginName}`** - Vue plugin documentation
  - Examples: `maz-ui://plugin/toast`, `maz-ui://plugin/dialog`
- **`maz-ui://helper/{helperName}`** - Utility helper documentation
  - Examples: `maz-ui://helper/currency`, `maz-ui://helper/date`

## Development

### Server Architecture

The MCP server is built with:

- **TypeScript** - Full type safety
- **STDIO Transport** - MCP 2025 specification compliance
- **Custom DocumentationService** - Combines manual and generated docs

### Running Tests

```bash
pnpm test:unit
```

### Type Checking

```bash
pnpm typecheck
```

### Debugging with MCP Inspector

1. Install the MCP Inspector:

   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. Start the server:

   ```bash
   pnpm dev
   ```

3. Run the inspector:

   ```bash
    pnpm dev:inspector
   ```

4. Configure
   - Transport Type: `STDIO`
   - Command: `tsx`
   - Args: `src/mcp.ts`

## License

This project is licensed under the MIT License - see the main Maz-UI repository for details.

## Support

- **Documentation**: [https://maz-ui.com](https://maz-ui.com)
- **Issues**: [GitHub Issues](https://github.com/LouisMazel/maz-ui/issues)
