/**
 * Search Tools
 * Handles search-related operations
 *
 * Enabled tools (2):
 * - freelo_search_elasticsearch (readonly)
 * - freelo_get_tasks_by_filter_uuid (readonly)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { TaskSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerSearchTools(server, readonlyMode = false) {
  // freelo_search_elasticsearch - readonly
  if (isToolEnabled('search_elasticsearch', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_search_elasticsearch',
      'Performs full-text search across Freelo using Elasticsearch. Searches tasks, subtasks, projects, tasklists, files, and comments.',
      {
        searchData: z.object({
          search_query: z.string().describe('Search query text'),
          projects_ids: z.array(z.number()).optional().describe('Filter by project IDs'),
          tasklists_ids: z.array(z.number()).optional().describe('Filter by tasklist IDs'),
          tasks_ids: z.array(z.number()).optional().describe('Filter within specific task IDs'),
          authors_ids: z.array(z.number()).optional().describe('Filter by author user IDs'),
          workers_ids: z.array(z.number()).optional().describe('Filter by assigned worker IDs'),
          state_ids: z.array(z.string()).optional().describe('Filter by states (active, finished, archived, template)'),
          entity_type: z.enum(['task', 'subtask', 'project', 'tasklist', 'file', 'comment']).optional().describe('Filter by entity type'),
          page: z.number().optional().describe('Page number (starts at 0)'),
          limit: z.number().optional().describe('Maximum results per page')
        }).describe('Search data with query and filters')
      },
      async ({ searchData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post('/search', searchData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_search_elasticsearch:', error);
          throw new Error(`Failed to search: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(z.any()),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_tasks_by_filter_uuid - readonly
  if (isToolEnabled('get_tasks_by_filter_uuid', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_tasks_by_filter_uuid',
      'Fetches tasks using a custom filter UUID. Custom filters are pre-configured task searches with multiple criteria.',
      {
        uuid: z.string().describe('UUID of the custom filter')
      },
      async ({ uuid }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/dashboard/custom-filter/by-uuid/${uuid}/tasks`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_tasks_by_filter_uuid:', error);
          throw new Error(`Failed to fetch tasks by filter: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(TaskSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }
}
