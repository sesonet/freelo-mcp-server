# Installation Guide

Complete setup instructions for @sesonet/freelo-mcp-server on all supported MCP clients.

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Freelo Account** - [Sign up](https://www.freelo.io/)
3. **Freelo API Key** - Get from Settings > API in Freelo

## Installation Methods

### Global Installation from GitHub (Recommended)

```bash
npm install -g github:sesonet/freelo-mcp-server
```

This installs the `freelo-mcp-server` command globally.

### Local Installation from GitHub

```bash
npm install github:sesonet/freelo-mcp-server
```

> **Note**: This package is not published to npm registry. Install from GitHub.

## Client Setup

### Claude Code (CLI)

1. Install globally first:
```bash
npm install -g github:sesonet/freelo-mcp-server
```

2. Run `/mcp` command in Claude Code to manage MCP servers, or edit config directly:
   - **Windows**: `%USERPROFILE%\.claude.json`
   - **macOS/Linux**: `~/.claude.json`

3. Add to the root-level `mcpServers` object:
```json
{
  "mcpServers": {
    "freelo": {
      "type": "stdio",
      "command": "freelo-mcp-server",
      "args": [],
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key",
        "FREELO_READONLY": "true"
      }
    }
  }
}
```

> **Note**: The `mcpServers` section is at the root level of `.claude.json`, not inside `.claude/.mcp.json`.

4. Restart Claude Code and verify with `/mcp` command

### Claude Desktop (Anthropic)

1. Install globally: `npm install -g github:sesonet/freelo-mcp-server`

2. Find config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/claude/claude_desktop_config.json`

3. Add configuration:
```json
{
  "mcpServers": {
    "freelo": {
      "command": "freelo-mcp-server",
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key",
        "FREELO_READONLY": "true"
      }
    }
  }
}
```

4. Restart Claude Desktop

### Cursor

1. Install globally: `npm install -g github:sesonet/freelo-mcp-server`
2. Open Cursor Settings (Cmd/Ctrl + ,)
3. Search for "MCP"
4. Click "Edit in settings.json"
5. Add:
```json
{
  "mcp.servers": {
    "freelo": {
      "command": "freelo-mcp-server",
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key",
        "FREELO_READONLY": "true"
      }
    }
  }
}
```

6. Restart Cursor

### VS Code with Claude Extension

1. Install globally: `npm install -g github:sesonet/freelo-mcp-server`
2. Install "Claude for VS Code" extension
3. Open VS Code Settings (Cmd/Ctrl + ,)
4. Search for "Claude MCP"
5. Add server in `settings.json`:
```json
{
  "claude.mcpServers": {
    "freelo": {
      "command": "freelo-mcp-server",
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key",
        "FREELO_READONLY": "true"
      }
    }
  }
}
```

### Windsurf

1. Install globally: `npm install -g github:sesonet/freelo-mcp-server`
2. Open Windsurf Settings
3. Navigate to AI > MCP Servers
4. Add configuration:
```json
{
  "freelo": {
    "command": "freelo-mcp-server",
    "env": {
      "FREELO_EMAIL": "your@email.com",
      "FREELO_API_KEY": "your-api-key",
      "FREELO_READONLY": "true"
    }
  }
}
```

### Continue.dev

1. Install globally: `npm install -g github:sesonet/freelo-mcp-server`
2. Add to `~/.continue/config.json`:
```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "freelo-mcp-server"
        },
        "env": {
          "FREELO_EMAIL": "your@email.com",
          "FREELO_API_KEY": "your-api-key"
        }
      }
    ]
  }
}
```

## Environment Variables

You can also set credentials via environment variables instead of config:

### Unix/macOS
```bash
export FREELO_EMAIL="your@email.com"
export FREELO_API_KEY="your-api-key"
export FREELO_READONLY="true"
```

Add to `~/.bashrc` or `~/.zshrc` for persistence.

### Windows
```cmd
set FREELO_EMAIL=your@email.com
set FREELO_API_KEY=your-api-key
set FREELO_READONLY=true
```

Or use System Properties > Environment Variables for persistence.

### Using .env File

Create `.env` in working directory:
```
FREELO_EMAIL=your@email.com
FREELO_API_KEY=your-api-key
FREELO_READONLY=true
```

## Verification

After setup, verify the server is working:

```bash
# Direct test
freelo-mcp-server --help

# Or with npx
npx @sesonet/freelo-mcp-server --help
```

In your MCP client, try:
- "List my Freelo projects"
- "Show all tasks"

## Troubleshooting

### "Command not found"
```bash
# Ensure global npm bin is in PATH
npm config get prefix
# Add to PATH: <prefix>/bin (Unix) or <prefix> (Windows)
```

### "Invalid credentials"
- Verify email and API key in Freelo Settings > API
- Check for typos in configuration
- Ensure no extra spaces in values

### "Connection refused"
- Check if Node.js is installed: `node --version`
- Verify npm packages: `npm list -g @sesonet/freelo-mcp-server`

### "Tools not appearing"
- Restart your MCP client after configuration changes
- Check client logs for MCP server errors
- Verify JSON syntax in configuration files

## Support

- Issues: [GitHub Issues](https://github.com/sesonet/freelo-mcp-server/issues)
- Freelo API: [Official Documentation](https://freelo.io/api/v1/)
