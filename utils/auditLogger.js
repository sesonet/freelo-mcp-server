/**
 * Audit Logger for @sesonet/freelo-mcp-server
 *
 * Logs all tool calls to JSONL file and optionally to webhook.
 *
 * Configuration via environment variables:
 * - FREELO_AUDIT_LOG: Path to JSONL log file (default: ./audit.jsonl)
 * - FREELO_AUDIT_WEBHOOK: Optional webhook URL for real-time notifications
 * - FREELO_AUDIT_ENABLED: Set to 'false' to disable logging (default: true)
 */

import fs from 'fs';
import path from 'path';

// Configuration
const AUDIT_ENABLED = process.env.FREELO_AUDIT_ENABLED !== 'false';
const AUDIT_LOG_PATH = process.env.FREELO_AUDIT_LOG || './audit.jsonl';
const AUDIT_WEBHOOK = process.env.FREELO_AUDIT_WEBHOOK;

/**
 * Ensure log directory exists
 */
function ensureLogDirectory() {
  const dir = path.dirname(AUDIT_LOG_PATH);
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Log entry to JSONL file
 * @param {Object} entry - Log entry object
 */
function writeToFile(entry) {
  try {
    ensureLogDirectory();
    const line = JSON.stringify(entry) + '\n';
    fs.appendFileSync(AUDIT_LOG_PATH, line, 'utf8');
  } catch (error) {
    console.error(`[AUDIT] Failed to write to log file: ${error.message}`);
  }
}

/**
 * Send entry to webhook (fire and forget)
 * @param {Object} entry - Log entry object
 */
async function sendToWebhook(entry) {
  if (!AUDIT_WEBHOOK) return;

  try {
    const response = await fetch(AUDIT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '@sesonet/freelo-mcp-server'
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      console.error(`[AUDIT] Webhook returned ${response.status}`);
    }
  } catch (error) {
    console.error(`[AUDIT] Failed to send to webhook: ${error.message}`);
  }
}

/**
 * Create audit log entry
 * @param {string} toolName - Name of the tool called
 * @param {Object} params - Tool parameters (sanitized)
 * @param {string} status - 'success' or 'error'
 * @param {number} durationMs - Execution duration in milliseconds
 * @param {string} [errorMessage] - Error message if status is 'error'
 * @returns {Object} Log entry
 */
function createLogEntry(toolName, params, status, durationMs, errorMessage = null) {
  return {
    timestamp: new Date().toISOString(),
    tool: toolName,
    params: sanitizeParams(params),
    status,
    durationMs,
    ...(errorMessage && { error: errorMessage })
  };
}

/**
 * Sanitize parameters to remove sensitive data
 * @param {Object} params - Original parameters
 * @returns {Object} Sanitized parameters
 */
function sanitizeParams(params) {
  if (!params || typeof params !== 'object') return params;

  const sanitized = { ...params };

  // List of sensitive field names to redact
  const sensitiveFields = ['password', 'secret', 'token', 'apiKey', 'api_key'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveFields.some(f => key.toLowerCase().includes(f.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeParams(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Log a tool call
 * @param {string} toolName - Name of the tool
 * @param {Object} params - Tool parameters
 * @param {string} status - 'success' or 'error'
 * @param {number} durationMs - Execution duration
 * @param {string} [errorMessage] - Error message if failed
 */
export function logToolCall(toolName, params, status, durationMs, errorMessage = null) {
  if (!AUDIT_ENABLED) return;

  const entry = createLogEntry(toolName, params, status, durationMs, errorMessage);

  // Write to file synchronously for reliability
  writeToFile(entry);

  // Send to webhook asynchronously (fire and forget)
  sendToWebhook(entry);
}

/**
 * Wrapper to measure and log tool execution
 * @param {string} toolName - Name of the tool
 * @param {Object} params - Tool parameters
 * @param {Function} handler - Async tool handler function
 * @returns {Promise<any>} Tool result
 */
export async function withAuditLogging(toolName, params, handler) {
  const startTime = Date.now();

  try {
    const result = await handler();
    const durationMs = Date.now() - startTime;
    logToolCall(toolName, params, 'success', durationMs);
    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logToolCall(toolName, params, 'error', durationMs, error.message);
    throw error;
  }
}

/**
 * Check if audit logging is enabled
 * @returns {boolean}
 */
export function isAuditEnabled() {
  return AUDIT_ENABLED;
}

/**
 * Get audit log path
 * @returns {string}
 */
export function getAuditLogPath() {
  return AUDIT_LOG_PATH;
}
