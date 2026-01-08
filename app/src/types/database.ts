export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_archived: boolean | null
          name: string
          order_key: number | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          order_key?: number | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          order_key?: number | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          diff: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          occurred_at: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          diff?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          occurred_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          diff?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          occurred_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_logs: {
        Row: {
          decided_at: string | null
          decided_by: string | null
          decision: string
          entity_id: string
          entity_type: string
          id: string
          reason: string | null
          workspace_id: string
        }
        Insert: {
          decided_at?: string | null
          decided_by?: string | null
          decision: string
          entity_id: string
          entity_type: string
          id?: string
          reason?: string | null
          workspace_id: string
        }
        Update: {
          decided_at?: string | null
          decided_by?: string | null
          decision?: string
          entity_id?: string
          entity_type?: string
          id?: string
          reason?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_time_maps: {
        Row: {
          entity_id: string
          entity_type: string
          id: string
          time_map_id: string
          workspace_id: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          id?: string
          time_map_id: string
          workspace_id: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          id?: string
          time_map_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_time_maps_time_map_id_fkey"
            columns: ["time_map_id"]
            isOneToOne: false
            referencedRelation: "time_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_time_maps_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      external_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          provider: string
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      external_event_links: {
        Row: {
          external_account_id: string
          external_event_id: string
          id: string
          last_synced_at: string | null
          sync_hash: string | null
          timeblock_id: string | null
          workspace_id: string
        }
        Insert: {
          external_account_id: string
          external_event_id: string
          id?: string
          last_synced_at?: string | null
          sync_hash?: string | null
          timeblock_id?: string | null
          workspace_id: string
        }
        Update: {
          external_account_id?: string
          external_event_id?: string
          id?: string
          last_synced_at?: string | null
          sync_hash?: string | null
          timeblock_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_event_links_external_account_id_fkey"
            columns: ["external_account_id"]
            isOneToOne: false
            referencedRelation: "external_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_event_links_timeblock_id_fkey"
            columns: ["timeblock_id"]
            isOneToOne: false
            referencedRelation: "timeblocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_event_links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      filters: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_favorite: boolean | null
          name: string
          position: number | null
          query: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          position?: number | null
          query: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          position?: number | null
          query?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filters_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_checkins: {
        Row: {
          checkin_date: string
          created_at: string | null
          habit_id: string
          id: string
          value: number | null
          workspace_id: string
        }
        Insert: {
          checkin_date: string
          created_at?: string | null
          habit_id: string
          id?: string
          value?: number | null
          workspace_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string | null
          habit_id?: string
          id?: string
          value?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_checkins_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_checkins_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          area_id: string | null
          created_at: string | null
          frequency_type: string | null
          id: string
          target_count_per_period: number | null
          title: string
          workspace_id: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          frequency_type?: string | null
          id?: string
          target_count_per_period?: number | null
          title: string
          workspace_id: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          frequency_type?: string | null
          id?: string
          target_count_per_period?: number | null
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habits_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_f2c0c8a2: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      labels: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      objective_links: {
        Row: {
          contribution_weight: number | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          objective_id: string
          workspace_id: string
        }
        Insert: {
          contribution_weight?: number | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          objective_id: string
          workspace_id: string
        }
        Update: {
          contribution_weight?: number | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          objective_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "objective_links_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objective_links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      objectives: {
        Row: {
          area_id: string | null
          created_at: string | null
          current_value: number | null
          id: string
          metric_type: string | null
          parent_objective_id: string | null
          status: string | null
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_type?: string | null
          parent_objective_id?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_type?: string | null
          parent_objective_id?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "objectives_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objectives_parent_objective_id_fkey"
            columns: ["parent_objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objectives_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_snapshots: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          snapshot_date: string | null
          workspace_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          snapshot_date?: string | null
          workspace_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          snapshot_date?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_snapshots_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_folders: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_folders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_id: string | null
          created_at: string | null
          default_view: string | null
          description: string | null
          folder_id: string | null
          id: string
          name: string
          sort_order: number | null
          status: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          default_view?: string | null
          description?: string | null
          folder_id?: string | null
          id?: string
          name: string
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          default_view?: string | null
          description?: string | null
          folder_id?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "project_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      recurrence_rules: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          next_occurrence: string | null
          rrule_string: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          next_occurrence?: string | null
          rrule_string: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          next_occurrence?: string | null
          rrule_string?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurrence_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_items: {
        Row: {
          created_at: string | null
          decision: string | null
          entity_id: string
          entity_type: string
          id: string
          notes: string | null
          review_id: string
        }
        Insert: {
          created_at?: string | null
          decision?: string | null
          entity_id: string
          entity_type: string
          id?: string
          notes?: string | null
          review_id: string
        }
        Update: {
          created_at?: string | null
          decision?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          notes?: string | null
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_items_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          review_type: string
          status: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          review_type: string
          status?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          review_type?: string
          status?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          id: string
          is_archived: boolean | null
          name: string
          project_id: string
          sort_order: number | null
          workspace_id: string
        }
        Insert: {
          id?: string
          is_archived?: boolean | null
          name: string
          project_id: string
          sort_order?: number | null
          workspace_id: string
        }
        Update: {
          id?: string
          is_archived?: boolean | null
          name?: string
          project_id?: string
          sort_order?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          blocked_task_id: string
          blocking_task_id: string
          dependency_type: string | null
          workspace_id: string
        }
        Insert: {
          blocked_task_id: string
          blocking_task_id: string
          dependency_type?: string | null
          workspace_id: string
        }
        Update: {
          blocked_task_id?: string
          blocking_task_id?: string
          dependency_type?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_blocked_task_id_fkey"
            columns: ["blocked_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_blocking_task_id_fkey"
            columns: ["blocking_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_labels: {
        Row: {
          label_id: string
          task_id: string
          workspace_id: string
        }
        Insert: {
          label_id: string
          task_id: string
          workspace_id: string
        }
        Update: {
          label_id?: string
          task_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_labels_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_labels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_member_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          due_datetime: string | null
          due_type: string | null
          duration_minutes: number | null
          id: string
          parent_task_id: string | null
          priority: number | null
          project_id: string | null
          section_id: string | null
          start_date: string | null
          start_datetime: string | null
          start_type: string | null
          status: string | null
          title: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assignee_member_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_datetime?: string | null
          due_type?: string | null
          duration_minutes?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: number | null
          project_id?: string | null
          section_id?: string | null
          start_date?: string | null
          start_datetime?: string | null
          start_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assignee_member_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_datetime?: string | null
          due_type?: string | null
          duration_minutes?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: number | null
          project_id?: string | null
          section_id?: string | null
          start_date?: string | null
          start_datetime?: string | null
          start_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_member_id_fkey"
            columns: ["assignee_member_id"]
            isOneToOne: false
            referencedRelation: "workspace_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_map_windows: {
        Row: {
          day_of_week: number
          end_time_local: string
          id: string
          preference_level: string | null
          start_time_local: string
          time_map_id: string
        }
        Insert: {
          day_of_week: number
          end_time_local: string
          id?: string
          preference_level?: string | null
          start_time_local: string
          time_map_id: string
        }
        Update: {
          day_of_week?: number
          end_time_local?: string
          id?: string
          preference_level?: string | null
          start_time_local?: string
          time_map_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_map_windows_time_map_id_fkey"
            columns: ["time_map_id"]
            isOneToOne: false
            referencedRelation: "time_maps"
            referencedColumns: ["id"]
          },
        ]
      }
      time_maps: {
        Row: {
          created_at: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_maps_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      timeblock_tasks: {
        Row: {
          sort_order: number | null
          task_id: string
          timeblock_id: string
          workspace_id: string
        }
        Insert: {
          sort_order?: number | null
          task_id: string
          timeblock_id: string
          workspace_id: string
        }
        Update: {
          sort_order?: number | null
          task_id?: string
          timeblock_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeblock_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeblock_tasks_timeblock_id_fkey"
            columns: ["timeblock_id"]
            isOneToOne: false
            referencedRelation: "timeblocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeblock_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      timeblocks: {
        Row: {
          area_id: string | null
          created_at: string | null
          end_time: string
          id: string
          is_locked: boolean | null
          label: string | null
          source: string | null
          start_time: string
          workspace_id: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          is_locked?: boolean | null
          label?: string | null
          source?: string | null
          start_time: string
          workspace_id: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          is_locked?: boolean | null
          label?: string | null
          source?: string | null
          start_time?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeblocks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeblocks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          locale: string | null
          start_of_week: string | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          locale?: string | null
          start_of_week?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          locale?: string | null
          start_of_week?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      view_orderings: {
        Row: {
          context_key: string
          id: string
          ordered_ids: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context_key: string
          id?: string
          ordered_ids: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context_key?: string
          id?: string
          ordered_ids?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_workspace_for_user: {
        Args: { workspace_name?: string }
        Returns: string
      }
      is_workspace_member: { Args: { _workspace_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
