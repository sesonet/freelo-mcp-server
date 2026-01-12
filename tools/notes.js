/**
 * Notes Tools
 * Handles note-related operations
 *
 * Enabled tools (3):
 * - freelo_get_note (readonly)
 * - freelo_create_note (edit)
 * - freelo_update_note (edit)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { NoteSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerNotesTools(server, readonlyMode = false) {
  // freelo_get_note - readonly
  if (isToolEnabled('get_note', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_note',
      'Fetches a specific note by ID, including title, content, and metadata. Notes are standalone documents for project documentation.',
      {
        noteId: z.string().describe('Note ID (e.g., "12345"). Get from project details or search.')
      },
      async ({ noteId }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get(`/note/${noteId}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_note:', error);
          throw new Error(`Failed to fetch note: ${error.message}`);
        }
      },
      {
        outputSchema: NoteSchema,
        annotations: { readOnlyHint: true }
      }
    );
  }

  // freelo_create_note - edit only
  if (isToolEnabled('create_note', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_create_note',
      'Creates a new note in a project. Notes are standalone documents for project documentation, meeting minutes, or specifications.',
      {
        projectId: z.string().describe('Project ID (e.g., "197352"). Get from freelo_get_projects.'),
        noteData: z.object({
          name: z.string().describe('Title of the note'),
          content: z.string().describe('Content (plain text or markdown)')
        }).describe('Note data')
      },
      async ({ projectId, noteData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/project/${projectId}/note`, noteData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_create_note:', error);
          throw new Error(`Failed to create note: ${error.message}`);
        }
      },
      {
        outputSchema: NoteSchema,
        annotations: { idempotentHint: true }
      }
    );
  }

  // freelo_update_note - edit only
  if (isToolEnabled('update_note', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_update_note',
      'Updates an existing note\'s title or content. All fields are optional - only provide what needs to change.',
      {
        noteId: z.string().describe('Note ID (e.g., "12345"). Get from freelo_get_note.'),
        noteData: z.object({
          name: z.string().optional().describe('Updated title'),
          content: z.string().optional().describe('Updated content')
        }).describe('Updated note data - only include fields to change')
      },
      async ({ noteId, noteData }) => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.post(`/note/${noteId}`, noteData);
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_update_note:', error);
          throw new Error(`Failed to update note: ${error.message}`);
        }
      },
      {
        outputSchema: NoteSchema,
        annotations: { idempotentHint: true }
      }
    );
  }
}
