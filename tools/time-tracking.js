/**
 * Time Tracking Tools
 * Handles time tracking operations
 *
 * Enabled tools (2):
 * - freelo_start_time_tracking (edit)
 * - freelo_stop_time_tracking (edit)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { WorkReportSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerTimeTrackingTools(server, readonlyMode = false) {
  // freelo_start_time_tracking - edit only
  if (isToolEnabled('start_time_tracking', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_start_time_tracking',
      'Starts real-time time tracking for a task. Creates an active timer that runs until stopped with freelo_stop_time_tracking.',
      {
        taskId: z.string().optional().describe('Optional task ID to track time for. If not provided, tracks general work time.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const params = taskId ? { task_id: taskId } : {};
          const response = await apiClient.post('/timetracking/start', null, { params });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_start_time_tracking:', error);
          throw new Error(`Failed to start time tracking: ${error.message}`);
        }
      },
      {
        outputSchema: WorkReportSchema,
        annotations: { idempotentHint: false }
      }
    );
  }

  // freelo_stop_time_tracking - edit only
  if (isToolEnabled('stop_time_tracking', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_stop_time_tracking',
      'Stops the currently active time tracking session. Calculates elapsed time and automatically creates a work report.',
      {},
      async () => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post('/timetracking/stop');
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_stop_time_tracking:', error);
          throw new Error(`Failed to stop time tracking: ${error.message}`);
        }
      },
      {
        outputSchema: WorkReportSchema,
        annotations: { idempotentHint: false }
      }
    );
  }
}
