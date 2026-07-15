---
title: Model Context Protocol (MCP)
description: Connect Maz-UI with AI assistants using Model Context Protocol - Get intelligent help with components, guides, composables, directives, plugins, and helpers
head:
  - - meta
    - name: keywords
      content: mcp, model context protocol, ai assistant, claude, cline, maz-ui integration, ai development
---

# {{ $frontmatter.title }}

---

<NpmBadge package="@maz-ui/mcp" />

Connect your AI assistant directly to Maz-UI's documentation and get intelligent help with components, composables, directives, plugins, helpers, and best practices.

---

- [{{ $frontmatter.title }}](#-frontmattertitle-)
  - [What is MCP?](#what-is-mcp)
  - [AI Assistant Configuration](#ai-assistant-configuration)
    - [Claude Code](#claude-code)
    - [Claude Desktop](#claude-desktop)
    - [Cursor IDE](#cursor-ide)
    - [Windsurf](#windsurf)
    - [Visual Studio Code (Copilot)](#visual-studio-code-copilot)
    - [Cline](#cline)
  - [Available Resources](#available-resources)

## What is MCP?

Think of MCP (Model Context Protocol) as a **smart bridge** between your AI assistant and Maz-UI. It's like giving your AI assistant a direct phone line to all of Maz-UI's documentation!

Instead of asking *"How do I use MazBtn?"* and getting generic answers or answers based on old documentation, your AI can now:
- 🔍 **Search** through all 50+ Maz-UI components and others
- 📖 **Read** the exact documentation for any component, composables, directives, plugins, helpers, and best practices
- 💡 **Suggest** the best way to implement your needs
- 🛠️ **Help** with implementation examples

::: tip Maz-UI provides a free MCP server with access to:

- 50+ Vue components documentation
- 14+ composables and utilities
- 11 comprehensive guides
- 5 directives and 4 plugins
- 20+ helper functions

:::

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

## Available Resources

Your AI assistant now has access to:

| Resource Type | Count | Description |
|---------------|-------|-------------|
| **Components** | 50+ | All Vue components with props, events, and examples |
| **Guides** | 11 | Installation, theming, migration, and best practices |
| **Composables** | 14+ | Reusable Vue composition functions |
| **Directives** | 5 | Vue directives for enhanced functionality |
| **Plugins** | 4 | Toast, dialog, AOS, and wait overlay systems |
| **Helpers** | 20+ | Utility functions for common tasks |

::: warning 🔒 Security Note
The MCP server provides read-only access to documentation. No sensitive data is transmitted or stored.
:::

Happy coding with AI-powered Maz-UI assistance! 🚀✨
