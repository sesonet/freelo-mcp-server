/**
 * Tasks Tools
 * Handles task-related operations
 *
 * Enabled tools (11):
 * - freelo_get_all_tasks (readonly)
 * - freelo_get_task_details (readonly)
 * - freelo_get_task_description (readonly)
 * - freelo_get_finished_tasks (readonly)
 * - freelo_get_public_link (readonly)
 * - freelo_create_task (edit)
 * - freelo_create_task_from_template (edit)
 * - freelo_edit_task (edit)
 * - freelo_update_task_description (edit)
 * - freelo_finish_task (edit)
 * - freelo_activate_task (edit)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { TaskSchema, TaskDetailedSchema, createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerTasksTools(server, readonlyMode = false) {
  // freelo_get_all_tasks - readonly
  if (isToolEnabled('get_all_tasks', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_all_tasks',
      'Fetches all tasks across all projects with filtering. Supports search, project/tasklist filter, label filter, date ranges, worker assignment, and pagination.',
      {
        filters: z.object({
          search_query: z.string().optional().describe('Fulltext search in task names'),
          state_id: z.number().optional().describe('Task state: 1=active, 2=finished'),
          projects_ids: z.array(z.number()).optional().describe('Filter by project IDs'),
          tasklists_ids: z.array(z.number()).optional().describe('Filter by tasklist IDs'),
          order_by: z.enum(['priority', 'name', 'date_add', 'date_edited_at']).optional().describe('Sort field'),
          order: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
          with_label: z.string().optional().describe('Include only tasks with this label'),
          without_label: z.string().optional().describe('Exclude tasks with this label'),
          no_due_date: z.boolean().optional().describe('Only tasks without due date'),
          due_date_range: z.object({
            date_from: z.string().describe('Start date YYYY-MM-DD'),
            date_to: z.string().describe('End date YYYY-MM-DD')
          }).optional().describe('Filter by due date range'),
          worker_id: z.number().optional().describe('Filter by assigned worker ID'),
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
          const response = await apiClient.get('/all-tasks', { params: filters });

          let data = response.data;
          if (data && data.data && data.data.tasks) {
            data = data.data.tasks;
          }

          return {
            content: [{ type: 'text', text: JSON.stringify(data) }],
            structuredContent: data
          };
        } catch (error) {
          console.error('Error in freelo_get_all_tasks:', error);
          throw new Error(`Failed to fetch tasks: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(TaskSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_task_details - readonly
  if (isToolEnabled('get_task_details', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_task_details',
      'Fetches complete details about a specific task including name, description, assignees, due date, priority, status, labels, and metadata. Use after finding tasks with freelo_get_all_tasks.',
      {
        taskId: z.string().describe('Task ID (e.g., "25368707"). Get from freelo_get_all_tasks.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/task/${taskId}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_task_details:', error);
          throw new Error(`Failed to fetch task details: ${error.message}`);
        }
      },
      {
        outputSchema: TaskDetailedSchema,
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_task_description - readonly
  if (isToolEnabled('get_task_description', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_task_description',
      'Fetches only the description content of a task. More lightweight than freelo_get_task_details when you only need the description text.',
      {
        taskId: z.string().describe('Task ID (e.g., "25368707"). Get from freelo_get_all_tasks.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/task/${taskId}/description`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_task_description:', error);
          throw new Error(`Failed to fetch task description: ${error.message}`);
        }
      },
      {
        outputSchema: TaskDetailedSchema,
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_finished_tasks - readonly
  if (isToolEnabled('get_finished_tasks', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_finished_tasks',
      'Fetches completed/finished tasks from a specific tasklist. For finished tasks across all projects, use freelo_get_all_tasks with state_id=2.',
      {
        tasklistId: z.string().describe('Tasklist ID (e.g., "12345"). Get from freelo_get_project_tasklists.'),
        search_query: z.string().optional().describe('Optional fulltext search to filter task names')
      },
      async ({ tasklistId, search_query }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const params = search_query ? { search_query } : {};
          const response = await apiClient.get(`/tasklist/${tasklistId}/finished-tasks`, { params });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_finished_tasks:', error);
          throw new Error(`Failed to fetch finished tasks: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(TaskSchema),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_get_public_link - readonly
  if (isToolEnabled('get_public_link', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_public_link',
      'Generates or retrieves a public sharing link for a task. Anyone with this link can view task details without logging in.',
      {
        taskId: z.string().describe('Task ID (e.g., "25368707"). Get from freelo_get_all_tasks.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/public-link/task/${taskId}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_public_link:', error);
          throw new Error(`Failed to get public link: ${error.message}`);
        }
      },
      {
        outputSchema: z.object({ url: z.string().url() }),
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_create_task - edit only
  if (isToolEnabled('create_task', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_create_task',
      'Creates a new task in a specific tasklist. Task is created in active state.',
      {
        projectId: z.string().describe('Project ID. Get from freelo_get_projects.'),
        tasklistId: z.string().describe('Tasklist ID. Get from freelo_get_project_tasklists.'),
        taskData: z.object({
          name: z.string().describe('Task name (required)'),
          description: z.string().optional().describe('Task description (markdown)'),
          worker: z.number().optional().describe('Assigned worker ID'),
          dueDate: z.string().optional().describe('Due date YYYY-MM-DD')
        }).describe('Task data')
      },
      async ({ projectId, tasklistId, taskData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);

          const apiData = { ...taskData };
          if (taskData.description) {
            apiData.comment = { content: taskData.description };
            delete apiData.description;
          }
          if (taskData.dueDate) {
            apiData.due_date = taskData.dueDate;
            delete apiData.dueDate;
          }

          const response = await apiClient.post(`/project/${projectId}/tasklist/${tasklistId}/tasks`, apiData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_create_task:', error);
          throw new Error(`Failed to create task: ${error.message}`);
        }
      },
      {
        outputSchema: TaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_create_task_from_template - edit only
  if (isToolEnabled('create_task_from_template', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_create_task_from_template',
      'Creates a new task based on an existing template task. The new task inherits the template\'s name, description, and structure.',
      {
        templateId: z.string().describe('Template task ID. Get from template projects.'),
        projectId: z.string().describe('Target project ID. Get from freelo_get_projects.'),
        tasklistId: z.string().describe('Target tasklist ID. Get from freelo_get_project_tasklists.')
      },
      async ({ templateId, projectId, tasklistId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/task/create-from-template/${templateId}`, {
            project_id: projectId,
            tasklist_id: tasklistId
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_create_task_from_template:', error);
          throw new Error(`Failed to create task from template: ${error.message}`);
        }
      },
      {
        outputSchema: TaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_edit_task - edit only
  if (isToolEnabled('edit_task', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_edit_task',
      'Updates an existing task. Can modify name, assignment, due date, or priority. For description updates, use freelo_update_task_description.',
      {
        taskId: z.string().describe('Task ID to update. Get from freelo_get_all_tasks.'),
        taskData: z.object({
          name: z.string().optional().describe('New task name'),
          worker: z.number().optional().describe('User ID to assign task to'),
          dueDate: z.string().optional().describe('New due date (YYYY-MM-DD)'),
          priority: z.number().optional().describe('Task priority (higher = more important)')
        }).describe('Task update data - only include fields to change')
      },
      async ({ taskId, taskData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);

          const apiData = { ...taskData };
          if (taskData.dueDate) {
            apiData.due_date = taskData.dueDate;
            delete apiData.dueDate;
          }

          const response = await apiClient.post(`/task/${taskId}`, apiData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_edit_task:', error);
          throw new Error(`Failed to edit task: ${error.message}`);
        }
      },
      {
        outputSchema: TaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_update_task_description - edit only
  if (isToolEnabled('update_task_description', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_update_task_description',
      'Updates only the description of a task. Supports plain text or markdown. Previous description is replaced completely.',
      {
        taskId: z.string().describe('Task ID. Get from freelo_get_all_tasks.'),
        description: z.string().describe('New description content (markdown supported). Use empty string to clear.')
      },
      async ({ taskId, description }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/task/${taskId}/description`, { content: description });
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_update_task_description:', error);
          throw new Error(`Failed to update task description: ${error.message}`);
        }
      },
      {
        outputSchema: TaskDetailedSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_finish_task - edit only
  if (isToolEnabled('finish_task', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_finish_task',
      'Marks a task as finished/completed. Task is moved to finished state, preserving all data. Can be reactivated with freelo_activate_task.',
      {
        taskId: z.string().describe('Task ID to mark as finished. Get from freelo_get_all_tasks.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/task/${taskId}/finish`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_finish_task:', error);
          throw new Error(`Failed to finish task: ${error.message}`);
        }
      },
      {
        outputSchema: TaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_activate_task - edit only
  if (isToolEnabled('activate_task', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_activate_task',
      'Reactivates a finished task, moving it back to active state. Use when a completed task needs to be reopened.',
      {
        taskId: z.string().describe('Task ID to reactivate. Must be a finished task.')
      },
      async ({ taskId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/task/${taskId}/activate`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_activate_task:', error);
          throw new Error(`Failed to activate task: ${error.message}`);
        }
      },
      {
        outputSchema: TaskSchema,
        annotations: { idempotentHint: true }
      }
    );
  }
}
