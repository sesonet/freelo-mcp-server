/**
 * States Tools
 * Handles task state-related operations
 *
 * Enabled tools (1):
 * - freelo_get_all_states (readonly)
 */

import { z } from 'zod';
import { createApiClient } from '../utils/apiClient.js';
import { registerToolWithMetadata } from '../utils/registerToolWithMetadata.js';
import { createArrayResponseSchema } from '../utils/schemas.js';
import { isToolEnabled } from '../config/tools.js';

export function registerStatesTools(server, readonlyMode = false) {
  // freelo_get_all_states - readonly
  if (isToolEnabled('get_all_states', readonlyMode)) {
    registerToolWithMetadata(
      server,
      'freelo_get_all_states',
      'Fetches all available task states in Freelo. States represent task lifecycle (1=active, 2=finished). Essential for state_id filters.',
      {},
      async () => {
        try {
          const auth = {
            email: process.env.FREELO_EMAIL,
            apiKey: process.env.FREELO_API_KEY,
            userAgent: process.env.FREELO_USER_AGENT
          };
          const apiClient = createApiClient(auth);
          const response = await apiClient.get('/states');
          return {
            content: [{ type: 'text', text: JSON.stringify(response.data) }],
            structuredContent: response.data
          };
        } catch (error) {
          console.error('Error in freelo_get_all_states:', error);
          throw new Error(`Failed to fetch states: ${error.message}`);
        }
      },
      {
        outputSchema: createArrayResponseSchema(z.object({ id: z.number(), name: z.string() })),
        annotations: { readOnlyHint: true }
      }
    );
  }
}
