/**
 * @sesonet/freelo-mcp-server
 *
 * MCP Server for Freelo API with:
 * - Reduced toolset (32 tools instead of 98)
 * - Readonly mode (--readonly flag)
 * - Audit logging
 *
 * Fork of karlost/FreeloMCP
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { isReadonlyMode, getEnabledTools } from './config/tools.js';
import { isAuditEnabled, getAuditLogPath } from './utils/auditLogger.js';

// Load environment variables
dotenv.config();

// Check readonly mode
const READONLY_MODE = isReadonlyMode();

// Log to stderr (stdout is reserved for MCP protocol)
function log(level, message) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${level}] ${message}`);
}

// Validate environment variables
if (!process.env.FREELO_EMAIL || !process.env.FREELO_API_KEY) {
  log('WARN', 'FREELO_EMAIL or FREELO_API_KEY not set. Tools will fail without credentials.');
}

// Import tool registrations - only needed categories
import { registerProjectsTools } from './tools/projects.js';
import { registerTasksTools } from './tools/tasks.js';
import { registerTasklistsTools } from './tools/tasklists.js';
import { registerSubtasksTools } from './tools/subtasks.js';
import { registerCommentsTools } from './tools/comments.js';
import { registerUsersTools } from './tools/users.js';
import { registerTimeTrackingTools } from './tools/time-tracking.js';
import { registerWorkReportsTools } from './tools/work-reports.js';
import { registerNotesTools } from './tools/notes.js';
import { registerStatesTools } from './tools/states.js';
import { registerSearchTools } from './tools/search.js';

// Function to initialize the server and register tools
export function initializeMcpServer() {
  const enabledTools = getEnabledTools(READONLY_MODE);

  log('INFO', `@sesonet/freelo-mcp-server v1.0.0 starting...`);
  log('INFO', `Mode: ${READONLY_MODE ? 'READONLY' : 'FULL'} (${enabledTools.length} tools)`);
  log('INFO', `Audit: ${isAuditEnabled() ? `enabled (${getAuditLogPath()})` : 'disabled'}`);

  const server = new McpServer({
    name: '@sesonet/freelo-mcp-server',
    version: '1.0.0',
    description: 'MCP Server for Freelo API - readonly mode, audit logging, reduced toolset'
  });

  // Register tool categories with readonly filter
  registerProjectsTools(server, READONLY_MODE);
  registerTasksTools(server, READONLY_MODE);
  registerTasklistsTools(server, READONLY_MODE);
  registerSubtasksTools(server, READONLY_MODE);
  registerCommentsTools(server, READONLY_MODE);
  registerUsersTools(server, READONLY_MODE);
  registerTimeTrackingTools(server, READONLY_MODE);
  registerWorkReportsTools(server, READONLY_MODE);
  registerNotesTools(server, READONLY_MODE);
  registerStatesTools(server, READONLY_MODE);
  registerSearchTools(server, READONLY_MODE);

  log('INFO', 'Server ready');

  return server;
}

// Function to start stdio server (for bin/npx usage)
export async function startStdioServer() {
  const serverInstance = initializeMcpServer();
  const transport = new StdioServerTransport();

  try {
    await serverInstance.connect(transport);
  } catch (error) {
    log('ERROR', `Failed to start MCP server: ${error.message}`);
    process.exit(1);
  }
}

// Auto-start when run directly
const isImported = new Error().stack?.includes('mcp-server-sse.js') ||
                   new Error().stack?.includes('mcp-server-http.js');

if (!isImported) {
  startStdioServer();
}
