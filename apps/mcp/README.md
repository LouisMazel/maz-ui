# Maz-UI MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to the Maz-UI component library documentation. This server enables AI agents to help developers with Vue.js/Nuxt.js component implementation, usage examples, and best practices.

## 🌟 Features

- **50+ Vue Components** - Complete documentation for all Maz-UI components
- **11 Comprehensive Guides** - Installation, theming, dark mode, and framework-specific guides
- **14 Vue Composables** - Reusable composition functions with usage examples
- **5 Vue Directives** - Custom directives for enhanced functionality
- **4 Vue Plugins** - Toast, dialog, AOS animations, and wait overlay plugins
- **20+ Utility Helpers** - Date formatting, currency handling, string manipulation, and more
- **Real-time Search** - Smart search across all documentation types
- **TypeScript Support** - Full type safety and IntelliSense integration

## 📊 Documentation Coverage

| Type        | Count | Description                                         |
| ----------- | ----- | --------------------------------------------------- |
| Components  | 50+   | MazBtn, MazInput, MazSelect, MazDatePicker, etc.    |
| Guides      | 11    | Getting Started, Vue, Nuxt, Themes, Dark Mode, etc. |
| Composables | 14    | useToast, useDialog, useFormValidator, etc.         |
| Directives  | 5     | v-tooltip, v-click-outside, v-lazy-img, etc.        |
| Plugins     | 4     | Toast, Dialog, AOS, Wait Overlay                    |
| Helpers     | 20+   | Currency, Date, String utilities, etc.              |

## 🚀 Quick Start

### For Production Use

Add this configuration to your AI assistant's MCP settings:

```json
{
  "maz-ui": {
    "url": "https://maz-ui.com/mcp"
  }
}
```

### For Local Development

1. Clone the repository and navigate to the MCP server:

```bash
git clone https://github.com/LouisMazel/maz-ui.git
cd maz-ui/apps/mcp
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the server:

```bash
pnpm dev
```

4. Configure your AI assistant to use:

```json
{
  "maz-ui": {
    "url": "http://localhost:3333/mcp"
  }
}
```

## 🤖 AI Assistant Configuration

### Claude Desktop

Add to `~/.config/claude/mcp_servers.json`:

```json
{
  "maz-ui": {
    "url": "https://maz-ui.com/mcp"
  }
}
```

### Cursor IDE

Add to your Cursor settings:

```json
{
  "mcpServers": {
    "maz-ui": {
      "url": "https://maz-ui.com/mcp"
    }
  }
}
```

### Other MCP-Compatible Tools

Most modern MCP-compatible tools support the Streamable HTTP transport (recommended):

```json
{
  "maz-ui": {
    "url": "https://maz-ui.com/mcp"
  }
}
```

**Note**: The server uses the modern Streamable HTTP transport (MCP 2025 specification) for better performance and compatibility.

## 🔧 Available Tools

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

- **`list_all_components`** - Get a complete list of available components
- **`list_guides`** - List all installation and usage guides
- **`list_composables`** - List all Vue composables
- **`list_directives`** - List all Vue directives
- **`list_plugins`** - List all Vue plugins
- **`list_helpers`** - List all utility helpers

### Quick Access Tools

- **`get_getting_started`** - Get the getting started guide (high priority)
- **`get_component_usage`** - Get usage examples for a specific component

  ```txt
  Parameters: { component: string }
  Example: "MazBtn", "maz-input", "MazDatePicker"
  ```

## 📚 Available Resources

The server exposes documentation through MCP resources with the following URI patterns:

### Core Resources

- **`maz-ui://overview`** - Complete library overview and introduction
- **`maz-ui://component/{ComponentName}`** - Individual component documentation
  - Examples: `maz-ui://component/MazBtn`, `maz-ui://component/MazInput`
- **`maz-ui://guide/{guideName}`** - Setup and usage guides
  - Examples: `maz-ui://guide/getting-started`, `maz-ui://guide/vue`, `maz-ui://guide/nuxt`

### Extended Resources

- **`maz-ui://composable/{composableName}`** - Vue composable documentation
  - Examples: `maz-ui://composable/use-toast`, `maz-ui://composable/use-dialog`
- **`maz-ui://directive/{directiveName}`** - Vue directive documentation
  - Examples: `maz-ui://directive/tooltip`, `maz-ui://directive/click-outside`
- **`maz-ui://plugin/{pluginName}`** - Vue plugin documentation
  - Examples: `maz-ui://plugin/toast`, `maz-ui://plugin/dialog`
- **`maz-ui://helper/{helperName}`** - Utility helper documentation
  - Examples: `maz-ui://helper/currency`, `maz-ui://helper/date`

## 💡 Usage Examples

### Getting Started with Maz-UI

Ask your AI assistant:

> "How do I get started with Maz-UI in a Vue project?"

### Finding Components

Ask your AI assistant:

> "What components are available for form inputs?"
> "Show me button components with loading states"

### Implementation Help

Ask your AI assistant:

> "How do I use the MazDatePicker component?"
> "Show me examples of MazBtn with different variants"

### Advanced Usage

Ask your AI assistant:

> "How do I implement dark mode with Maz-UI?"
> "What composables are available for form validation?"

## 🛠️ Development

### Server Architecture

The MCP server is built with:

- **AdonisJS** - Node.js web framework
- **TypeScript** - Full type safety
- **Streamable HTTP Transport** - MCP 2025 specification compliance
- **Custom DocumentationService** - Combines manual and generated docs

### API Endpoints

The server also provides REST API endpoints for debugging:

- `GET /` - Health check with diagnostics
- `GET /api/components` - List all components
- `GET /api/component/:name` - Get component documentation
- `GET /api/guides` - List all guides
- `GET /api/search/:query` - Search documentation

### Running Tests

```bash
pnpm test
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

4. Configure:
   - Transport Type: `Streamable HTTP`
   - URL: `http://localhost:3333/mcp`

## 📄 License

This project is licensed under the MIT License - see the main Maz-UI repository for details.

## 🆘 Support

- **Documentation**: [https://maz-ui.com](https://maz-ui.com)
- **Issues**: [GitHub Issues](https://github.com/LouisMazel/maz-ui/issues)

## 📈 Monitoring

### Health Check

The server provides a health endpoint at `/` that returns:

```json
{
  "status": "healthy",
  "service": "maz-ui-mcp",
  "version": "1.0.0",
  "diagnostics": {
    "totalComponents": 50,
    "totalGuides": 11,
    "totalComposables": 14,
    "totalDirectives": 5,
    "totalPlugins": 4,
    "totalHelpers": 20
  }
}
```
