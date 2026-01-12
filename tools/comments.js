/**
 * Comments Tools
 * Handles comment-related operations
 *
 * Enabled tools (1):
 * - freelo_get_all_comments (readonly)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { CommentSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerCommentsTools(server, readonlyMode = false) {
  // freelo_get_all_comments - readonly
  if (isToolEnabled('get_all_comments', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_all_comments',
      'Fetches all comments across projects with filtering and sorting. Includes discussions on tasks, documents, files, and links.',
      {
        filters: z.object({
          projects_ids: z.array(z.number()).optional().describe('Filter by project IDs'),
          type: z.enum(['all', 'task', 'document', 'file', 'link']).optional().describe('Comment type filter'),
          order_by: z.enum(['date_add', 'date_edited_at']).optional().describe('Sort field'),
          order: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
          p: z.number().optional().describe('Page number (starts at 0)')
        }).optional().describe('Optional filters')
      },
      async ({ filters = {} }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/all-comments', { params: filters });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_all_comments:', error);
          throw new Error(`Failed to fetch comments: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(CommentSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }
}
