# Installation Guide

Complete setup instructions for @sesonet/freelo-mcp-server on all supported MCP clients.

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Freelo Account** - [Sign up](https://www.freelo.io/)
3. **Freelo API Key** - Get from Settings > API in Freelo

## Installation Methods

### Global Installation (Recommended)

```bash
npm install -g @sesonet/freelo-mcp-server
```

### Local Installation

```bash
npm install @sesonet/freelo-mcp-server
```

### Using npx (No Installation)

```bash
npx @sesonet/freelo-mcp-server
```

## Client Setup

### Claude Code (CLI)

1. Run `/mcp` command in Claude Code to manage MCP servers, or edit config directly:
   - **Windows**: `%USERPROFILE%\.claude.json`
   - **macOS/Linux**: `~/.claude.json`

2. Add to the root-level `mcpServers` object:
```json
{
  "mcpServers": {
    "freelo": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@sesonet/freelo-mcp-server"],
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

3. Restart Claude Code and verify with `/mcp` command

### Claude Desktop (Anthropic)

1. Find config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/claude/claude_desktop_config.json`

2. Add configuration:
```json
{
  "mcpServers": {
    "freelo": {
      "command": "npx",
      "args": ["-y", "@sesonet/freelo-mcp-server", "--readonly"],
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key"
      }
    }
  }
}
```

3. Restart Claude Desktop

### Cursor

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add:
```json
{
  "mcp.servers": {
    "freelo": {
      "command": "npx",
      "args": ["-y", "@sesonet/freelo-mcp-server"],
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key"
      }
    }
  }
}
```

5. Restart Cursor

### VS Code with Claude Extension

1. Install "Claude for VS Code" extension
2. Open VS Code Settings (Cmd/Ctrl + ,)
3. Search for "Claude MCP"
4. Add server in `settings.json`:
```json
{
  "claude.mcpServers": {
    "freelo": {
      "command": "npx",
      "args": ["-y", "@sesonet/freelo-mcp-server"],
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Windsurf

1. Open Windsurf Settings
2. Navigate to AI > MCP Servers
3. Add configuration:
```json
{
  "freelo": {
    "command": "npx",
    "args": ["-y", "@sesonet/freelo-mcp-server"],
    "env": {
      "FREELO_EMAIL": "your@email.com",
      "FREELO_API_KEY": "your-api-key"
    }
  }
}
```

### Continue.dev

Add to `~/.continue/config.json`:
```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "@sesonet/freelo-mcp-server"]
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
