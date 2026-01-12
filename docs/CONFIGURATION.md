# Configuration

Complete configuration reference for @sesonet/freelo-mcp-server.

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `FREELO_EMAIL` | Freelo account email | `user@example.com` |
| `FREELO_API_KEY` | Freelo API key | `abc123...` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `FREELO_USER_AGENT` | `@sesonet/freelo-mcp-server` | Custom User-Agent header |
| `FREELO_READONLY` | `false` | Enable readonly mode (`true`/`false`) |
| `FREELO_AUDIT_ENABLED` | `true` | Enable audit logging |
| `FREELO_AUDIT_LOG` | `./audit.jsonl` | Path to audit log file |
| `FREELO_AUDIT_WEBHOOK` | - | Webhook URL for audit events |

## Command Line Arguments

```bash
freelo-mcp-server [options]
```

| Argument | Description |
|----------|-------------|
| `--readonly`, `-r` | Enable readonly mode (20 tools) |
| `--full` | Disable readonly mode (33 tools) |
| `--help`, `-h` | Show help |
| `--version`, `-v` | Show version |

## Modes

### Readonly Mode

Enables only 20 safe, read-only tools. Recommended for:
- Browsing projects and tasks
- Generating reports
- Read-only integrations
- Testing and development

```bash
# Via command line
freelo-mcp-server --readonly

# Via environment
FREELO_READONLY=true freelo-mcp-server
```

### Full Mode

Enables all 33 tools including create, update, and finish operations.

```bash
freelo-mcp-server --full
# or simply
freelo-mcp-server
```

## Audit Logging

### Log File Format (JSONL)

Each line is a JSON object:
```json
{
  "timestamp": "2025-01-12T10:30:00.000Z",
  "tool": "freelo_get_projects",
  "params": {},
  "status": "success",
  "durationMs": 245
}
```

Error entries include error message:
```json
{
  "timestamp": "2025-01-12T10:30:00.000Z",
  "tool": "freelo_create_task",
  "params": {"projectId": "123", "tasklistId": "456"},
  "status": "error",
  "durationMs": 102,
  "error": "Invalid project ID"
}
```

### Webhook Integration

Configure webhook for real-time notifications:

```bash
FREELO_AUDIT_WEBHOOK=https://your-server.com/webhook
```

Webhook receives POST requests with JSON body matching log format.

### Sensitive Data

Parameters containing sensitive fields are automatically redacted:
- `password`
- `secret`
- `token`
- `apiKey` / `api_key`

## .env File

Create `.env` in working directory:

```env
# Required
FREELO_EMAIL=user@example.com
FREELO_API_KEY=your-api-key-here

# Optional
FREELO_READONLY=true
FREELO_USER_AGENT=MyApp/1.0

# Audit
FREELO_AUDIT_ENABLED=true
FREELO_AUDIT_LOG=./logs/freelo-audit.jsonl
FREELO_AUDIT_WEBHOOK=https://hooks.example.com/freelo
```

## MCP Client Configuration

### JSON Schema

```json
{
  "mcpServers": {
    "freelo": {
      "command": "freelo-mcp-server",
      "args": ["--readonly"],
      "env": {
        "FREELO_EMAIL": "user@example.com",
        "FREELO_API_KEY": "your-api-key",
        "FREELO_AUDIT_LOG": "./logs/audit.jsonl"
      }
    }
  }
}
```

### Using npx

```json
{
  "mcpServers": {
    "freelo": {
      "command": "npx",
      "args": ["-y", "@sesonet/freelo-mcp-server", "--readonly"],
      "env": {
        "FREELO_EMAIL": "user@example.com",
        "FREELO_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Security Recommendations

1. **Never commit API keys** - Use environment variables or .env files
2. **Use readonly mode** for read-only use cases
3. **Review audit logs** periodically for unexpected activity
4. **Rotate API keys** if compromised
5. **Limit API key permissions** in Freelo settings if available
