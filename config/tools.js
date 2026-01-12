/**
 * Tool Configuration for @sesonet/freelo-mcp-server
 *
 * This file defines which tools are enabled and their categories.
 * Tools are divided into:
 * - READ_ONLY: Always available, safe operations
 * - EDIT: Only available when FREELO_READONLY is not set
 */

export const TOOL_CONFIG = {
  // Read-only tools - always enabled (19 tools)
  READ_ONLY: [
    // Projects (4)
    'get_projects',
    'get_all_projects',
    'get_project_details',
    'get_project_workers',

    // Tasks (5)
    'get_all_tasks',
    'get_task_details',
    'get_task_description',
    'get_finished_tasks',
    'get_public_link',

    // Tasklists (2)
    'get_project_tasklists',
    'get_tasklist_details',

    // Subtasks (1)
    'get_subtasks',

    // Comments (1)
    'get_all_comments',

    // Notes (1)
    'get_note',

    // Users (2)
    'get_users',
    'get_assignable_workers',

    // Time tracking (1)
    'get_work_reports',

    // Search (2)
    'search_elasticsearch',
    'get_tasks_by_filter_uuid',

    // States (1)
    'get_all_states'
  ],

  // Edit tools - only available without --readonly (13 tools)
  EDIT: [
    // Tasks (6)
    'create_task',
    'create_task_from_template',
    'edit_task',
    'update_task_description',
    'finish_task',
    'activate_task',

    // Subtasks (1)
    'create_subtask',

    // Notes (2)
    'create_note',
    'update_note',

    // Time tracking (4)
    'create_work_report',
    'update_work_report',
    'start_time_tracking',
    'stop_time_tracking'
  ],

  // Explicitly excluded tools (destructive, admin, premium)
  EXCLUDED: [
    // Destructive
    'delete_task',
    'delete_project',
    'delete_note',
    'delete_work_report',
    'delete_public_link',
    'delete_task_reminder',
    'delete_custom_field',
    'delete_pinned_item',
    'delete_total_time_estimate',
    'delete_user_time_estimate',
    'delete_field_value',
    'delete_out_of_office',

    // Archive/Remove
    'archive_project',
    'remove_workers',
    'remove_workers_by_emails',

    // Admin operations
    'create_project',
    'create_project_from_template',
    'activate_project',
    'create_tasklist',
    'create_tasklist_from_template',
    'invite_users_by_email',
    'invite_users_by_ids',
    'set_out_of_office',
    'get_out_of_office',
    'move_task',
    'create_task_reminder',

    // Premium (Custom Fields)
    'get_custom_field_types',
    'create_custom_field',
    'rename_custom_field',
    'restore_custom_field',
    'get_custom_fields_by_project',
    'add_or_edit_field_value',
    'add_or_edit_enum_value',
    'get_enum_options',
    'create_enum_option',
    'set_total_time_estimate',
    'set_user_time_estimate',

    // Invoices
    'get_issued_invoices',
    'get_invoice_detail',
    'download_invoice_reports',
    'mark_as_invoiced',

    // Notifications
    'get_all_notifications',
    'mark_notification_read',
    'mark_notification_unread',

    // Pinned items
    'get_pinned_items',
    'pin_item',

    // Events
    'get_events',

    // Files
    'get_all_files',
    'upload_file',
    'download_file',

    // Labels
    'find_available_labels',
    'create_task_labels',
    'delete_task_labels',

    // Filters
    'get_custom_filters'
  ]
};

/**
 * Check if a tool is enabled based on current mode
 * @param {string} toolName - Name of the tool (without freelo_ prefix)
 * @param {boolean} readonlyMode - Whether readonly mode is active
 * @returns {boolean}
 */
export function isToolEnabled(toolName, readonlyMode = false) {
  // Check if in READ_ONLY list
  if (TOOL_CONFIG.READ_ONLY.includes(toolName)) {
    return true;
  }

  // Check if in EDIT list and not in readonly mode
  if (TOOL_CONFIG.EDIT.includes(toolName) && !readonlyMode) {
    return true;
  }

  return false;
}

/**
 * Get all enabled tools for current mode
 * @param {boolean} readonlyMode - Whether readonly mode is active
 * @returns {string[]}
 */
export function getEnabledTools(readonlyMode = false) {
  if (readonlyMode) {
    return [...TOOL_CONFIG.READ_ONLY];
  }
  return [...TOOL_CONFIG.READ_ONLY, ...TOOL_CONFIG.EDIT];
}

/**
 * Check if readonly mode is enabled
 * @returns {boolean}
 */
export function isReadonlyMode() {
  return process.env.FREELO_READONLY === 'true' ||
         process.argv.includes('--readonly') ||
         process.argv.includes('-r');
}
