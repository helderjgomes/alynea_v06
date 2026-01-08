/**
 * Database types generated from Supabase schema
 * 
 * To regenerate, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            tasks: {
                Row: {
                    id: string
                    workspace_id: string
                    project_id: string | null
                    section_id: string | null
                    parent_task_id: string | null
                    title: string
                    description: string | null
                    status: 'todo' | 'in_progress' | 'done' | 'canceled'
                    priority: 1 | 2 | 3 | 4
                    due_type: 'none' | 'date' | 'datetime'
                    due_date: string | null
                    due_datetime: string | null
                    start_type: 'none' | 'date' | 'datetime'
                    start_date: string | null
                    start_datetime: string | null
                    completed_at: string | null
                    assignee_member_id: string | null
                    duration_minutes: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    project_id?: string | null
                    section_id?: string | null
                    parent_task_id?: string | null
                    title: string
                    description?: string | null
                    status?: 'todo' | 'in_progress' | 'done' | 'canceled'
                    priority?: 1 | 2 | 3 | 4
                    due_type?: 'none' | 'date' | 'datetime'
                    due_date?: string | null
                    due_datetime?: string | null
                    start_type?: 'none' | 'date' | 'datetime'
                    start_date?: string | null
                    start_datetime?: string | null
                    completed_at?: string | null
                    assignee_member_id?: string | null
                    duration_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    project_id?: string | null
                    section_id?: string | null
                    parent_task_id?: string | null
                    title?: string
                    description?: string | null
                    status?: 'todo' | 'in_progress' | 'done' | 'canceled'
                    priority?: 1 | 2 | 3 | 4
                    due_type?: 'none' | 'date' | 'datetime'
                    due_date?: string | null
                    due_datetime?: string | null
                    start_type?: 'none' | 'date' | 'datetime'
                    start_date?: string | null
                    start_datetime?: string | null
                    completed_at?: string | null
                    assignee_member_id?: string | null
                    duration_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    workspace_id: string
                    folder_id: string | null
                    name: string
                    description: string | null
                    status: 'active' | 'archived' | 'on_hold'
                    default_view: 'list' | 'board' | 'calendar' | 'timeline'
                    sort_order: number
                    area_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    folder_id?: string | null
                    name: string
                    description?: string | null
                    status?: 'active' | 'archived' | 'on_hold'
                    default_view?: 'list' | 'board' | 'calendar' | 'timeline'
                    sort_order?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    folder_id?: string | null
                    name?: string
                    description?: string | null
                    status?: 'active' | 'archived' | 'on_hold'
                    default_view?: 'list' | 'board' | 'calendar' | 'timeline'
                    sort_order?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            areas: {
                Row: {
                    id: string
                    workspace_id: string
                    name: string
                    color: string | null
                    icon: string | null
                    order_key: number
                    is_archived: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    name: string
                    color?: string | null
                    icon?: string | null
                    order_key?: number
                    is_archived?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    name?: string
                    color?: string | null
                    icon?: string | null
                    order_key?: number
                    is_archived?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            habits: {
                Row: {
                    id: string
                    workspace_id: string
                    name: string
                    description: string | null
                    is_active: boolean
                    sort_order: number
                    area_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    name: string
                    description?: string | null
                    is_active?: boolean
                    sort_order?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    name?: string
                    description?: string | null
                    is_active?: boolean
                    sort_order?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            objectives: {
                Row: {
                    id: string
                    workspace_id: string
                    parent_objective_id: string | null
                    title: string
                    status: 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'canceled'
                    target_date: string | null
                    metric_type: 'binary' | 'numeric'
                    current_value: number
                    target_value: number
                    area_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    parent_objective_id?: string | null
                    title: string
                    status?: 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'canceled'
                    target_date?: string | null
                    metric_type?: 'binary' | 'numeric'
                    current_value?: number
                    target_value?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    parent_objective_id?: string | null
                    title?: string
                    status?: 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'canceled'
                    target_date?: string | null
                    metric_type?: 'binary' | 'numeric'
                    current_value?: number
                    target_value?: number
                    area_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            labels: {
                Row: {
                    id: string
                    workspace_id: string
                    name: string
                    color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    name: string
                    color: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    name?: string
                    color?: string
                    created_at?: string
                }
            }
            timeblocks: {
                Row: {
                    id: string
                    workspace_id: string
                    start_time: string
                    end_time: string
                    label: string | null
                    is_locked: boolean
                    source: 'manual' | 'external'
                    area_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    start_time: string
                    end_time: string
                    label?: string | null
                    is_locked?: boolean
                    source?: 'manual' | 'external'
                    area_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    start_time?: string
                    end_time?: string
                    label?: string | null
                    is_locked?: boolean
                    source?: 'manual' | 'external'
                    area_id?: string | null
                    created_at?: string
                }
            }
            filters: {
                Row: {
                    id: string
                    workspace_id: string
                    name: string
                    query: string
                    color: string | null
                    icon: string | null
                    is_favorite: boolean
                    position: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    name: string
                    query: string
                    color?: string | null
                    icon?: string | null
                    is_favorite?: boolean
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    name?: string
                    query?: string
                    color?: string | null
                    icon?: string | null
                    is_favorite?: boolean
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
