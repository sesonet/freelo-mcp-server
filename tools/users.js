/**
 * Users Tools
 * Handles user-related operations
 *
 * Enabled tools (2):
 * - freelo_get_users (readonly)
 * - freelo_get_assignable_workers (readonly)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { UserSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerUsersTools(server, readonlyMode = false) {
  // freelo_get_users - readonly
  if (isToolEnabled('get_users', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_users',
      'Fetches all users in the Freelo workspace. Returns user list with names, emails, IDs, and roles. Essential for getting user IDs before assigning tasks.',
      {},
      async () => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/users');
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_users:', error);
          throw new Error(`Failed to fetch users: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(UserSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_assignable_workers - readonly
  if (isToolEnabled('get_assignable_workers', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_assignable_workers',
      'Fetches users who can be assigned to tasks in a specific tasklist. Use before creating or assigning tasks to ensure the assignee has access.',
      {
        projectId: z.string().describe('Project ID (e.g., "197352"). Get from freelo_get_projects.'),
        tasklistId: z.string().describe('Tasklist ID (e.g., "12345"). Get from freelo_get_project_tasklists.')
      },
      async ({ projectId, tasklistId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/project/${projectId}/tasklist/${tasklistId}/assignable-workers`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_assignable_workers:', error);
          throw new Error(`Failed to fetch assignable workers: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(UserSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }
}
