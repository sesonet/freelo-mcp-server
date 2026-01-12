/**
 * Subtasks Tools
 * Handles subtask-related operations
 *
 * Enabled tools (2):
 * - freelo_get_subtasks (readonly)
 * - freelo_create_subtask (edit)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { SubtaskSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerSubtasksTools(server, readonlyMode = false) {
  // freelo_get_subtasks - readonly
  if (isToolEnabled('get_subtasks', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_subtasks',
      'Fetches all subtasks belonging to a parent task. Returns subtasks with their names, statuses, and assignments.',
      {
        taskId: z.string().describe('Parent task ID (e.g., "25368707"). Get from freelo_get_all_tasks.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/task/${taskId}/subtasks`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_subtasks:', error);
          throw new Error(`Failed to fetch subtasks: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(SubtaskSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_create_subtask - edit only
  if (isToolEnabled('create_subtask', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_create_subtask',
      'Creates a subtask under an existing task. Subtasks help break down complex tasks into smaller pieces.',
      {
        taskId: z.string().describe('Parent task ID (e.g., "25368707"). Get from freelo_get_all_tasks.'),
        subtaskData: z.object({
          name: z.string().describe('Subtask name'),
          description: z.string().optional().describe('Optional description'),
          worker: z.number().optional().describe('User ID to assign subtask to'),
          dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)')
        }).describe('Subtask data')
      },
      async ({ taskId, subtaskData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);

          const apiData = { ...subtaskData };
          if (subtaskData.description) {
            apiData.comment = { content: subtaskData.description };
            delete apiData.description;
          }
          if (subtaskData.dueDate) {
            apiData.due_date = subtaskData.dueDate;
            delete apiData.dueDate;
          }

          const response = await apiClient.post(`/task/${taskId}/subtasks`, apiData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_create_subtask:', error);
          throw new Error(`Failed to create subtask: ${error.message}`);
        }
      },
      {
        outputSchema: SubtaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }
}
