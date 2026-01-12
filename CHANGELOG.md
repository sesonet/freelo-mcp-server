# Changelog

All notable changes to @sesonet/freelo-mcp-server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-01-12

### Added
- **Readonly mode** - Safe default with 20 read-only tools
- **Audit logging** - JSONL format with optional webhook support
- **Tool annotations** - `readOnlyHint`, `idempotentHint` for MCP clients
- Comprehensive English documentation (README, INSTALLATION, TOOLS, CONFIGURATION)

### Changed
- **Reduced toolset** - From 98 to 33 essential tools
- **Renamed all tools** - Added `freelo_` prefix for clarity
- **Refactored architecture** - Extracted tools from monolithic core.js into category files
- Sensitive data sanitization in audit logs (API keys, passwords)

### Removed
- REST API server (server.js, controllers/, routes/, middleware/)
- HTTP and SSE transports (mcp-server-http.js, mcp-server-sse.js)
- Unused tools: custom-fields, events, files, filters, invoices, labels, notifications, pinned-items
- Test suite and dev tooling (tests/, babel, jest configs)
- Legacy documentation

### Notes
- This is a fork of [karlost/FreeloMCP](https://github.com/karlost/FreeloMCP) v2.4.0
- Focus on safety and simplicity for LLM integration

## Links

- [GitHub Repository](https://github.com/sesonet/freelo-mcp-server)
- [Freelo API Documentation](https://freelo.io/api/v1/)
