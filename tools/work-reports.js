/**
 * Work Reports Tools
 * Handles work report (time tracking entries) operations
 *
 * Enabled tools (3):
 * - freelo_get_work_reports (readonly)
 * - freelo_create_work_report (edit)
 * - freelo_update_work_report (edit)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { WorkReportSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerWorkReportsTools(server, readonlyMode = false) {
  // freelo_get_work_reports - readonly
  if (isToolEnabled('get_work_reports', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_work_reports',
      'Fetches work reports (time entries) with filtering. Essential for billing, productivity analysis, and project reporting.',
      {
        filters: z.object({
          projects_ids: z.array(z.string()).optional().describe('Filter by project IDs'),
          users_ids: z.array(z.string()).optional().describe('Filter by user IDs'),
          tasks_labels: z.array(z.string()).optional().describe('Filter by task labels'),
          date_reported_range: z.object({
            date_from: z.string().describe('Start date YYYY-MM-DD'),
            date_to: z.string().describe('End date YYYY-MM-DD')
          }).optional().describe('Filter by date range')
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
          const response = await apiClient.get('/work-reports', { params: filters });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_work_reports:', error);
          throw new Error(`Failed to fetch work reports: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(WorkReportSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_create_work_report - edit only
  if (isToolEnabled('create_work_report', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_create_work_report',
      'Creates a new work report (time entry) for a task. Use after completing work for timesheet entry.',
      {
        taskId: z.string().describe('Task ID. Get from freelo_get_all_tasks.'),
        reportData: z.object({
          minutes: z.number().describe('Minutes worked (e.g., 120 for 2 hours)'),
          date: z.string().describe('Date of work YYYY-MM-DD'),
          description: z.string().optional().describe('Description of work performed')
        }).describe('Work report data')
      },
      async ({ taskId, reportData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/task/${taskId}/work-reports`, reportData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_create_work_report:', error);
          throw new Error(`Failed to create work report: ${error.message}`);
        }
      },
      {
        outputSchema: WorkReportSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_update_work_report - edit only
  if (isToolEnabled('update_work_report', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_update_work_report',
      'Updates an existing work report. Use to correct time entries or add descriptions.',
      {
        workReportId: z.string().describe('Work report ID. Get from freelo_get_work_reports.'),
        reportData: z.object({
          minutes: z.number().optional().describe('Updated minutes worked'),
          date: z.string().optional().describe('Updated date YYYY-MM-DD'),
          description: z.string().optional().describe('Updated description')
        }).describe('Updated data - only include fields to change')
      },
      async ({ workReportId, reportData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/work-reports/${workReportId}`, reportData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_update_work_report:', error);
          throw new Error(`Failed to update work report: ${error.message}`);
        }
      },
      {
        outputSchema: WorkReportSchema,
        annotations: { idempotentHint: true }
      }
    );
  }
}
