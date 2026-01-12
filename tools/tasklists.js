/**
 * Tasklists Tools
 * Handles tasklist-related operations
 *
 * Enabled tools (2):
 * - freelo_get_project_tasklists (readonly)
 * - freelo_get_tasklist_details (readonly)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { TasklistSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerTasklistsTools(server, readonlyMode = false) {
  // freelo_get_project_tasklists - readonly
  if (isToolEnabled('get_project_tasklists', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_project_tasklists',
      'Fetches all tasklists within a project. Tasklists organize tasks into logical groups (e.g., "To Do", "In Progress", "Done"). Use after freelo_get_projects to drill down into project structure.',
      {
        projectId: z.string().describe('Project ID (e.g., "197352"). Get from freelo_get_projects.')
      },
      async ({ projectId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/all-tasklists', {
            params: {
              projects_ids: [projectId]
            }
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_project_tasklists:', error);
          throw new Error(`Failed to fetch tasklists: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(TasklistSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_tasklist_details - readonly
  if (isToolEnabled('get_tasklist_details', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_tasklist_details',
      'Fetches detailed information about a specific tasklist including name, description, color, workers, and settings.',
      {
        tasklistId: z.string().describe('Tasklist ID (e.g., "12345"). Get from freelo_get_project_tasklists.')
      },
      async ({ tasklistId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/tasklist/${tasklistId}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_tasklist_details:', error);
          throw new Error(`Failed to fetch tasklist details: ${error.message}`);
        }
      },
      {
        outputSchema: TasklistSchema,
        annotations: { readOnlyHint: true }
      }
    );
  }
}
