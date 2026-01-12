# @sesonet/freelo-mcp-server

MCP (Model Context Protocol) server for [Freelo](https://www.freelo.io/) project management API.

**Key Features:**
- **33 curated tools** (reduced from 98 in original)
- **Readonly mode** by default (`--readonly` flag)
- **Audit logging** (JSONL + optional webhook)
- **All MCP clients supported** (Claude Code, Cursor, VS Code, etc.)

Fork of [karlost/FreeloMCP](https://github.com/karlost/FreeloMCP).

## Quick Start

```bash
# Install globally
npm install -g @sesonet/freelo-mcp-server

# Set credentials
export FREELO_EMAIL="your@email.com"
export FREELO_API_KEY="your-api-key"

# Run in readonly mode (default)
freelo-mcp-server

# Run with edit capabilities
freelo-mcp-server --full
```

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed setup for all clients
- [Tools Reference](docs/TOOLS.md) - Complete list of available tools
- [Configuration](docs/CONFIGURATION.md) - Environment variables and options

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| Projects | 4 | List, details, workers |
| Tasks | 11 | CRUD, finish, activate, templates |
| Tasklists | 2 | List, details |
| Subtasks | 2 | List, create |
| Comments | 1 | List all comments |
| Notes | 3 | Get, create, update |
| Users | 2 | List, assignable workers |
| Time Tracking | 2 | Start, stop timer |
| Work Reports | 3 | List, create, update |
| Search | 2 | Elasticsearch, custom filters |
| States | 1 | List task states |

**Total: 33 tools** (20 readonly + 13 edit)

## Modes

### Readonly Mode (Default)
```bash
freelo-mcp-server --readonly
# or
FREELO_READONLY=true freelo-mcp-server
```
Only 20 read-only tools available. Safe for browsing and reporting.

### Full Mode
```bash
freelo-mcp-server --full
# or without --readonly flag
```
All 33 tools available including create, update, and finish operations.

## Audit Logging

All tool calls are logged to `audit.jsonl`:

```json
{"timestamp":"2025-01-12T10:30:00.000Z","tool":"freelo_get_projects","params":{},"status":"success","durationMs":245}
```

Configure via environment:
```bash
FREELO_AUDIT_LOG=./logs/audit.jsonl  # Log file path
FREELO_AUDIT_WEBHOOK=https://...      # Optional webhook URL
FREELO_AUDIT_ENABLED=false            # Disable logging
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FREELO_EMAIL` | Yes | Freelo account email |
| `FREELO_API_KEY` | Yes | Freelo API key |
| `FREELO_USER_AGENT` | No | Custom User-Agent |
| `FREELO_READONLY` | No | Enable readonly mode |
| `FREELO_AUDIT_LOG` | No | Audit log path |
| `FREELO_AUDIT_WEBHOOK` | No | Webhook URL |
| `FREELO_AUDIT_ENABLED` | No | Enable/disable audit |

## Client Configuration

### Claude Code (CLI)

```json
{
  "mcpServers": {
    "freelo": {
      "command": "freelo-mcp-server",
      "args": ["--readonly"],
      "env": {
        "FREELO_EMAIL": "your@email.com",
        "FREELO_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor / VS Code

See [Installation Guide](docs/INSTALLATION.md) for detailed setup.

## License

MIT License - see [LICENSE](LICENSE) for details.

Dual copyright:
- Original: (c) 2024 Chodeec
- Fork: (c) 2025 sesonet
