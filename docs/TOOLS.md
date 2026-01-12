# Tools Reference

Complete list of all 33 tools available in @sesonet/freelo-mcp-server.

## Overview

| Mode | Tools Available |
|------|-----------------|
| Readonly (`--readonly`) | 20 tools |
| Full (default) | 33 tools |

## Projects (4 tools)

### freelo_get_projects
**Mode:** readonly
Fetches your own active projects in Freelo.

### freelo_get_all_projects
**Mode:** readonly
Fetches all projects - both owned and shared.

### freelo_get_project_details
**Mode:** readonly
Fetches detailed information about a specific project.

**Parameters:**
- `projectId` (string, required) - Project ID

### freelo_get_project_workers
**Mode:** readonly
Fetches all workers assigned to a specific project.

**Parameters:**
- `projectId` (string, required) - Project ID

## Tasks (11 tools)

### freelo_get_all_tasks
**Mode:** readonly
Fetches all tasks across all projects with filtering.

**Parameters:**
- `filters` (object, optional)
  - `search_query` - Fulltext search
  - `state_id` - 1=active, 2=finished
  - `projects_ids` - Filter by project IDs
  - `tasklists_ids` - Filter by tasklist IDs
  - `order_by` - Sort field
  - `order` - asc/desc
  - `with_label` / `without_label` - Label filters
  - `due_date_range` - Date range filter
  - `worker_id` - Filter by assignee
  - `p` - Page number

### freelo_get_task_details
**Mode:** readonly
Fetches complete details about a specific task.

**Parameters:**
- `taskId` (string, required) - Task ID

### freelo_get_task_description
**Mode:** readonly
Fetches only the description of a task.

**Parameters:**
- `taskId` (string, required) - Task ID

### freelo_get_finished_tasks
**Mode:** readonly
Fetches completed tasks from a specific tasklist.

**Parameters:**
- `tasklistId` (string, required) - Tasklist ID
- `search_query` (string, optional) - Search filter

### freelo_get_public_link
**Mode:** readonly
Generates or retrieves a public sharing link for a task.

**Parameters:**
- `taskId` (string, required) - Task ID

### freelo_create_task
**Mode:** edit
Creates a new task in a specific tasklist.

**Parameters:**
- `projectId` (string, required) - Project ID
- `tasklistId` (string, required) - Tasklist ID
- `taskData` (object, required)
  - `name` (string, required) - Task name
  - `description` (string, optional) - Description
  - `worker` (number, optional) - Assigned user ID
  - `dueDate` (string, optional) - Due date (YYYY-MM-DD)

### freelo_create_task_from_template
**Mode:** edit
Creates a new task from an existing template.

**Parameters:**
- `templateId` (string, required) - Template task ID
- `projectId` (string, required) - Target project ID
- `tasklistId` (string, required) - Target tasklist ID

### freelo_edit_task
**Mode:** edit
Updates an existing task.

**Parameters:**
- `taskId` (string, required) - Task ID
- `taskData` (object, required)
  - `name` (string, optional) - New name
  - `worker` (number, optional) - New assignee
  - `dueDate` (string, optional) - New due date
  - `priority` (number, optional) - Priority level

### freelo_update_task_description
**Mode:** edit
Updates only the description of a task.

**Parameters:**
- `taskId` (string, required) - Task ID
- `description` (string, required) - New description

### freelo_finish_task
**Mode:** edit
Marks a task as finished/completed.

**Parameters:**
- `taskId` (string, required) - Task ID

### freelo_activate_task
**Mode:** edit
Reactivates a finished task.

**Parameters:**
- `taskId` (string, required) - Task ID

## Tasklists (2 tools)

### freelo_get_project_tasklists
**Mode:** readonly
Fetches all tasklists within a project.

**Parameters:**
- `projectId` (string, required) - Project ID

### freelo_get_tasklist_details
**Mode:** readonly
Fetches detailed information about a specific tasklist.

**Parameters:**
- `tasklistId` (string, required) - Tasklist ID

## Subtasks (2 tools)

### freelo_get_subtasks
**Mode:** readonly
Fetches all subtasks belonging to a parent task.

**Parameters:**
- `taskId` (string, required) - Parent task ID

### freelo_create_subtask
**Mode:** edit
Creates a subtask under an existing task.

**Parameters:**
- `taskId` (string, required) - Parent task ID
- `subtaskData` (object, required)
  - `name` (string, required) - Subtask name
  - `description` (string, optional) - Description
  - `worker` (number, optional) - Assigned user ID
  - `dueDate` (string, optional) - Due date

## Comments (1 tool)

### freelo_get_all_comments
**Mode:** readonly
Fetches all comments across projects with filtering.

**Parameters:**
- `filters` (object, optional)
  - `projects_ids` - Filter by project IDs
  - `type` - all, task, document, file, link
  - `order_by` - date_add, date_edited_at
  - `order` - asc, desc
  - `p` - Page number

## Notes (3 tools)

### freelo_get_note
**Mode:** readonly
Fetches a specific note by ID.

**Parameters:**
- `noteId` (string, required) - Note ID

### freelo_create_note
**Mode:** edit
Creates a new note in a project.

**Parameters:**
- `projectId` (string, required) - Project ID
- `noteData` (object, required)
  - `name` (string, required) - Title
  - `content` (string, required) - Content

### freelo_update_note
**Mode:** edit
Updates an existing note.

**Parameters:**
- `noteId` (string, required) - Note ID
- `noteData` (object, required)
  - `name` (string, optional) - New title
  - `content` (string, optional) - New content

## Users (2 tools)

### freelo_get_users
**Mode:** readonly
Fetches all users in the Freelo workspace.

### freelo_get_assignable_workers
**Mode:** readonly
Fetches users who can be assigned to tasks in a specific tasklist.

**Parameters:**
- `projectId` (string, required) - Project ID
- `tasklistId` (string, required) - Tasklist ID

## Time Tracking (2 tools)

### freelo_start_time_tracking
**Mode:** edit
Starts real-time time tracking for a task.

**Parameters:**
- `taskId` (string, optional) - Task ID (general tracking if omitted)

### freelo_stop_time_tracking
**Mode:** edit
Stops the currently active time tracking session.

## Work Reports (3 tools)

### freelo_get_work_reports
**Mode:** readonly
Fetches work reports (time entries) with filtering.

**Parameters:**
- `filters` (object, optional)
  - `projects_ids` - Filter by project IDs
  - `users_ids` - Filter by user IDs
  - `tasks_labels` - Filter by labels
  - `date_reported_range` - Date range filter

### freelo_create_work_report
**Mode:** edit
Creates a new work report (time entry) for a task.

**Parameters:**
- `taskId` (string, required) - Task ID
- `reportData` (object, required)
  - `minutes` (number, required) - Minutes worked
  - `date` (string, required) - Date (YYYY-MM-DD)
  - `description` (string, optional) - Description

### freelo_update_work_report
**Mode:** edit
Updates an existing work report.

**Parameters:**
- `workReportId` (string, required) - Work report ID
- `reportData` (object, required)
  - `minutes` (number, optional) - Updated minutes
  - `date` (string, optional) - Updated date
  - `description` (string, optional) - Updated description

## Search (2 tools)

### freelo_search_elasticsearch
**Mode:** readonly
Performs full-text search across Freelo.

**Parameters:**
- `searchData` (object, required)
  - `search_query` (string, required) - Search text
  - `projects_ids` - Filter by projects
  - `tasklists_ids` - Filter by tasklists
  - `entity_type` - task, subtask, project, etc.
  - `page` - Page number
  - `limit` - Results per page

### freelo_get_tasks_by_filter_uuid
**Mode:** readonly
Fetches tasks using a custom filter UUID.

**Parameters:**
- `uuid` (string, required) - Custom filter UUID

## States (1 tool)

### freelo_get_all_states
**Mode:** readonly
Fetches all available task states.

---

## Summary

| Category | Readonly | Edit | Total |
|----------|----------|------|-------|
| Projects | 4 | 0 | 4 |
| Tasks | 5 | 6 | 11 |
| Tasklists | 2 | 0 | 2 |
| Subtasks | 1 | 1 | 2 |
| Comments | 1 | 0 | 1 |
| Notes | 1 | 2 | 3 |
| Users | 2 | 0 | 2 |
| Time Tracking | 0 | 2 | 2 |
| Work Reports | 1 | 2 | 3 |
| Search | 2 | 0 | 2 |
| States | 1 | 0 | 1 |
| **Total** | **20** | **13** | **33** |
