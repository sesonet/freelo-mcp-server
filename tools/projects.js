/**
 * Projects Tools
 * Handles project-related read operations
 *
 * Enabled tools (4):
 * - freelo_get_projects (readonly)
 * - freelo_get_all_projects (readonly)
 * - freelo_get_project_details (readonly)
 * - freelo_get_project_workers (readonly)
 *
 * Excluded: create_project, archive_project, activate_project, delete_project
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { formatResponse } from '../utils/responseFormatter.js';
import { handleToolError } from '../utils/errorHandler.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { ProjectSchema, ProjectDetailedSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerProjectsTools(server, readonlyMode = false) {
  // freelo_get_projects - readonly
  if (isToolEnabled('get_projects', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_projects',
      'Fetches your own active projects in Freelo. Returns only projects that you own. For all accessible projects, use freelo_get_all_projects.',
      {},
      async () => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/projects');
          return formatResponse(response.data);
        } catch (error) {
          return handleToolError(error, 'freelo_get_projects');
        }
      },
      {
        outputSchema: createArrayResponseSchema(ProjectSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_all_projects - readonly
  if (isToolEnabled('get_all_projects', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_all_projects',
      'Fetches all projects in Freelo - both owned and shared. Supports pagination.',
      {},
      async () => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/all-projects');
          return formatResponse(response.data);
        } catch (error) {
          return handleToolError(error, 'freelo_get_all_projects');
        }
      },
      {
        outputSchema: createArrayResponseSchema(ProjectSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_project_details - readonly
  if (isToolEnabled('get_project_details', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_project_details',
      'Fetches detailed information about a specific project including workers, tasklists, and settings.',
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
          const response = await apiClient.get(`/project/${projectId}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          return handleToolError(error, 'freelo_get_project_details', { projectId });
        }
      },
      {
        outputSchema: ProjectDetailedSchema,
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_project_workers - readonly
  if (isToolEnabled('get_project_workers', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_project_workers',
      'Fetches all workers (team members) assigned to a specific project.',
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
          const response = await apiClient.get(`/project/${projectId}/workers`);
          return formatResponse(response.data);
        } catch (error) {
          return handleToolError(error, 'freelo_get_project_workers', { projectId });
        }
      },
      {
        annotations: { readOnlyHint: true }
      }
    );
  }
}
