/**
 * Alynea Database Types
 * 
 * Auto-generated from Supabase schema
 * Last updated: 2026-01-08
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELED: 'canceled',
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
} as const;
export type TaskPriority = 1 | 2 | 3 | 4;

export const DueDateType = {
  NONE: 'none',
  DATE: 'date',
  DATETIME: 'datetime',
} as const;
export type DueDateType = typeof DueDateType[keyof typeof DueDateType];

export const ProjectStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  ON_HOLD: 'on_hold',
} as const;
export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectView = {
  LIST: 'list',
  BOARD: 'board',
  CALENDAR: 'calendar',
  TIMELINE: 'timeline',
} as const;
export type ProjectView = typeof ProjectView[keyof typeof ProjectView];

export const ObjectiveStatus = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
} as const;
export type ObjectiveStatus = typeof ObjectiveStatus[keyof typeof ObjectiveStatus];

export const WorkspaceRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;
export type WorkspaceRole = typeof WorkspaceRole[keyof typeof WorkspaceRole];

export const ReviewType = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;
export type ReviewType = typeof ReviewType[keyof typeof ReviewType];

export const PreferenceLevel = {
  ALLOWED: 'allowed',
  PREFERRED: 'preferred',
  AVOID: 'avoid',
} as const;
export type PreferenceLevel = typeof PreferenceLevel[keyof typeof PreferenceLevel];

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  updated_at: string | null;
}

export interface UserProfile {
  user_id: string;
  email: string;
  full_name: string | null;
  timezone: string;
  locale: string;
  start_of_week: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// TASK MANAGEMENT
// =============================================================================

export interface Task {
  id: string;
  workspace_id: string;
  project_id: string | null;
  section_id: string | null;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_type: DueDateType;
  due_date: string | null;
  due_datetime: string | null;
  start_type: DueDateType;
  start_date: string | null;
  start_datetime: string | null;
  completed_at: string | null;
  assignee_member_id: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  blocking_task_id: string;
  blocked_task_id: string;
  workspace_id: string;
  dependency_type: string;
}

export interface Label {
  id: string;
  workspace_id: string;
  name: string;
  color: string | null;
  created_at: string;
}

export interface TaskLabel {
  task_id: string;
  label_id: string;
  workspace_id: string;
}

// =============================================================================
// PROJECT ORGANIZATION
// =============================================================================

export interface Project {
  id: string;
  workspace_id: string;
  folder_id: string | null;
  area_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  default_view: ProjectView;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  project_id: string;
  workspace_id: string;
  name: string;
  sort_order: number;
  is_archived: boolean;
}

export interface ProjectFolder {
  id: string;
  workspace_id: string;
  name: string;
  color: string | null;
  sort_order: number;
  created_at: string;
}

export interface Area {
  id: string;
  workspace_id: string;
  name: string;
  color: string | null;
  icon: string | null;
  order_key: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// TIME BLOCKING & SCHEDULING
// =============================================================================

export interface Timeblock {
  id: string;
  workspace_id: string;
  area_id: string | null;
  start_time: string;
  end_time: string;
  label: string | null;
  is_locked: boolean;
  source: string;
  created_at: string;
}

export interface TimeblockTask {
  timeblock_id: string;
  task_id: string;
  workspace_id: string;
  sort_order: number;
}

export interface TimeMap {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

export interface TimeMapWindow {
  id: string;
  time_map_id: string;
  day_of_week: number; // 0-6 (Sun-Sat)
  start_time_local: string;
  end_time_local: string;
  preference_level: PreferenceLevel;
}

export interface EntityTimeMap {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  time_map_id: string;
}

// =============================================================================
// HABITS & OBJECTIVES
// =============================================================================

export interface Habit {
  id: string;
  workspace_id: string;
  area_id: string | null;
  title: string;
  frequency_type: string;
  target_count_per_period: number;
  created_at: string;
}

export interface HabitCheckin {
  id: string;
  habit_id: string;
  workspace_id: string;
  checkin_date: string;
  value: number;
  created_at: string;
}

export interface Objective {
  id: string;
  workspace_id: string;
  parent_objective_id: string | null;
  area_id: string | null;
  title: string;
  status: ObjectiveStatus;
  target_date: string | null;
  metric_type: string;
  current_value: number;
  target_value: number;
  created_at: string;
  updated_at: string;
}

export interface ObjectiveLink {
  id: string;
  workspace_id: string;
  objective_id: string;
  entity_id: string;
  entity_type: 'task' | 'project' | 'habit';
  contribution_weight: number;
  created_at: string;
}

// =============================================================================
// REVIEWS & PLANNING
// =============================================================================

export interface Review {
  id: string;
  workspace_id: string;
  period_start: string;
  period_end: string;
  review_type: ReviewType;
  status: string;
  created_at: string;
}

export interface ReviewItem {
  id: string;
  review_id: string;
  entity_type: 'task' | 'project' | 'objective';
  entity_id: string;
  decision: string | null;
  notes: string | null;
  created_at: string;
}

export interface PlanSnapshot {
  id: string;
  workspace_id: string;
  snapshot_date: string;
  content: Record<string, unknown>;
  created_at: string;
}

export interface DecisionLog {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  decision: string;
  reason: string | null;
  decided_by: string | null;
  decided_at: string;
}

// =============================================================================
// FILTERS & VIEWS
// =============================================================================

export interface Filter {
  id: string;
  workspace_id: string;
  name: string;
  query: string;
  color: string | null;
  icon: string | null;
  is_favorite: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ViewOrdering {
  id: string;
  user_id: string | null;
  context_key: string;
  ordered_ids: string[];
  updated_at: string;
}

// =============================================================================
// EXTERNAL INTEGRATIONS
// =============================================================================

export interface ExternalAccount {
  id: string;
  user_id: string;
  provider: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ExternalEventLink {
  id: string;
  workspace_id: string;
  timeblock_id: string | null;
  external_account_id: string;
  external_event_id: string;
  sync_hash: string | null;
  last_synced_at: string | null;
}

export interface RecurrenceRule {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  rrule_string: string;
  next_occurrence: string | null;
  created_at: string;
}

// =============================================================================
// AUDIT
// =============================================================================

export interface AuditLog {
  id: string;
  workspace_id: string | null;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  diff: Record<string, unknown> | null;
  occurred_at: string;
}

// =============================================================================
// JOINED/EXPANDED TYPES (for queries with relations)
// =============================================================================

export interface TaskWithRelations extends Task {
  project?: Project | null;
  section?: Section | null;
  parent_task?: Task | null;
  subtasks?: Task[];
  labels?: Label[];
  assignee?: WorkspaceMember | null;
  dependencies_blocking?: TaskDependency[];
  dependencies_blocked_by?: TaskDependency[];
}

export interface ProjectWithRelations extends Project {
  folder?: ProjectFolder | null;
  area?: Area | null;
  sections?: Section[];
  tasks?: Task[];
}

export interface TimeblockWithTasks extends Timeblock {
  area?: Area | null;
  tasks?: {
    sort_order: number;
    task: Task;
  }[];
}

export interface HabitWithCheckins extends Habit {
  area?: Area | null;
  checkins?: HabitCheckin[];
  current_streak?: number;
}

export interface ObjectiveWithLinks extends Objective {
  area?: Area | null;
  parent?: Objective | null;
  children?: Objective[];
  links?: {
    entity_type: string;
    entity_id: string;
    contribution_weight: number;
  }[];
}

// =============================================================================
// INSERT TYPES (for creating new records)
// =============================================================================

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type HabitInsert = Omit<Habit, 'id' | 'created_at'>;
export type ObjectiveInsert = Omit<Objective, 'id' | 'created_at' | 'updated_at'>;
export type TimeblockInsert = Omit<Timeblock, 'id' | 'created_at'>;
export type LabelInsert = Omit<Label, 'id' | 'created_at'>;
export type AreaInsert = Omit<Area, 'id' | 'created_at' | 'updated_at'>;
export type FilterInsert = Omit<Filter, 'id' | 'created_at' | 'updated_at'>;

// =============================================================================
// UPDATE TYPES (for partial updates)
// =============================================================================

export type TaskUpdate = Partial<Omit<Task, 'id' | 'workspace_id' | 'created_at'>>;
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'workspace_id' | 'created_at'>>;
export type HabitUpdate = Partial<Omit<Habit, 'id' | 'workspace_id' | 'created_at'>>;
export type ObjectiveUpdate = Partial<Omit<Objective, 'id' | 'workspace_id' | 'created_at'>>;
export type TimeblockUpdate = Partial<Omit<Timeblock, 'id' | 'workspace_id' | 'created_at'>>;

// =============================================================================
// DATABASE TYPE (for Supabase client)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: Workspace;
        Insert: Omit<Workspace, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Workspace, 'id'>>;
      };
      workspace_members: {
        Row: WorkspaceMember;
        Insert: Omit<WorkspaceMember, 'id' | 'joined_at'>;
        Update: Partial<Omit<WorkspaceMember, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'>;
        Update: Partial<Profile>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'user_id'>>;
      };
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: TaskUpdate;
      };
      task_dependencies: {
        Row: TaskDependency;
        Insert: TaskDependency;
        Update: Partial<TaskDependency>;
      };
      task_labels: {
        Row: TaskLabel;
        Insert: TaskLabel;
        Update: Partial<TaskLabel>;
      };
      labels: {
        Row: Label;
        Insert: LabelInsert;
        Update: Partial<Omit<Label, 'id' | 'workspace_id'>>;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      sections: {
        Row: Section;
        Insert: Omit<Section, 'id'>;
        Update: Partial<Omit<Section, 'id' | 'project_id' | 'workspace_id'>>;
      };
      project_folders: {
        Row: ProjectFolder;
        Insert: Omit<ProjectFolder, 'id' | 'created_at'>;
        Update: Partial<Omit<ProjectFolder, 'id' | 'workspace_id'>>;
      };
      areas: {
        Row: Area;
        Insert: AreaInsert;
        Update: Partial<Omit<Area, 'id' | 'workspace_id'>>;
      };
      timeblocks: {
        Row: Timeblock;
        Insert: TimeblockInsert;
        Update: TimeblockUpdate;
      };
      timeblock_tasks: {
        Row: TimeblockTask;
        Insert: TimeblockTask;
        Update: Partial<TimeblockTask>;
      };
      time_maps: {
        Row: TimeMap;
        Insert: Omit<TimeMap, 'id' | 'created_at'>;
        Update: Partial<Omit<TimeMap, 'id' | 'workspace_id'>>;
      };
      time_map_windows: {
        Row: TimeMapWindow;
        Insert: Omit<TimeMapWindow, 'id'>;
        Update: Partial<Omit<TimeMapWindow, 'id' | 'time_map_id'>>;
      };
      entity_time_maps: {
        Row: EntityTimeMap;
        Insert: Omit<EntityTimeMap, 'id'>;
        Update: Partial<EntityTimeMap>;
      };
      habits: {
        Row: Habit;
        Insert: HabitInsert;
        Update: HabitUpdate;
      };
      habit_checkins: {
        Row: HabitCheckin;
        Insert: Omit<HabitCheckin, 'id' | 'created_at'>;
        Update: Partial<Omit<HabitCheckin, 'id'>>;
      };
      objectives: {
        Row: Objective;
        Insert: ObjectiveInsert;
        Update: ObjectiveUpdate;
      };
      objective_links: {
        Row: ObjectiveLink;
        Insert: Omit<ObjectiveLink, 'id' | 'created_at'>;
        Update: Partial<ObjectiveLink>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'workspace_id'>>;
      };
      review_items: {
        Row: ReviewItem;
        Insert: Omit<ReviewItem, 'id' | 'created_at'>;
        Update: Partial<Omit<ReviewItem, 'id' | 'review_id'>>;
      };
      plan_snapshots: {
        Row: PlanSnapshot;
        Insert: Omit<PlanSnapshot, 'id' | 'created_at'>;
        Update: Partial<PlanSnapshot>;
      };
      decision_logs: {
        Row: DecisionLog;
        Insert: Omit<DecisionLog, 'id' | 'decided_at'>;
        Update: Partial<DecisionLog>;
      };
      filters: {
        Row: Filter;
        Insert: FilterInsert;
        Update: Partial<Omit<Filter, 'id' | 'workspace_id'>>;
      };
      view_orderings: {
        Row: ViewOrdering;
        Insert: Omit<ViewOrdering, 'id' | 'updated_at'>;
        Update: Partial<Omit<ViewOrdering, 'id'>>;
      };
      external_accounts: {
        Row: ExternalAccount;
        Insert: Omit<ExternalAccount, 'id' | 'created_at'>;
        Update: Partial<Omit<ExternalAccount, 'id' | 'user_id'>>;
      };
      external_event_links: {
        Row: ExternalEventLink;
        Insert: Omit<ExternalEventLink, 'id'>;
        Update: Partial<ExternalEventLink>;
      };
      recurrence_rules: {
        Row: RecurrenceRule;
        Insert: Omit<RecurrenceRule, 'id' | 'created_at'>;
        Update: Partial<Omit<RecurrenceRule, 'id'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'occurred_at'>;
        Update: never;
      };
    };
    Functions: {
      is_workspace_member: {
        Args: { _workspace_id: string };
        Returns: boolean;
      };
      create_workspace_for_user: {
        Args: { workspace_name?: string };
        Returns: string;
      };
    };
  };
}
