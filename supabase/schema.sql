


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."check_area_workspace_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    area_ws UUID;
BEGIN
    IF NEW.area_id IS NOT NULL THEN
        SELECT workspace_id INTO area_ws FROM public.areas WHERE id = NEW.area_id;
        
        IF area_ws != NEW.workspace_id THEN
            RAISE EXCEPTION 'Workspace mismatch: Entity workspace (%) does not match Area workspace (%)', NEW.workspace_id, area_ws;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_area_workspace_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_dependency_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    blocking_ws UUID;
    blocked_ws UUID;
BEGIN
    SELECT workspace_id INTO blocking_ws FROM public.tasks WHERE id = NEW.blocking_task_id;
    SELECT workspace_id INTO blocked_ws FROM public.tasks WHERE id = NEW.blocked_task_id;
    
    IF NEW.workspace_id != blocking_ws OR NEW.workspace_id != blocked_ws THEN
        RAISE EXCEPTION 'Workspace mismatch: Dependency workspace must match both Task workspaces';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_dependency_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_entity_time_map_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    tm_ws UUID;
    entity_ws UUID;
BEGIN
    SELECT workspace_id INTO tm_ws FROM public.time_maps WHERE id = NEW.time_map_id;
    
    IF tm_ws != NEW.workspace_id THEN
        RAISE EXCEPTION 'Workspace mismatch: EntityTimeMap vs TimeMap';
    END IF;

    IF NEW.entity_type = 'task' THEN
        SELECT workspace_id INTO entity_ws FROM public.tasks WHERE id = NEW.entity_id;
    ELSIF NEW.entity_type = 'project' THEN
        SELECT workspace_id INTO entity_ws FROM public.projects WHERE id = NEW.entity_id;
    ELSIF NEW.entity_type = 'habit' THEN
         SELECT workspace_id INTO entity_ws FROM public.habits WHERE id = NEW.entity_id;
    ELSE
         -- Just warn or fail? Fail for strictness.
         RAISE EXCEPTION 'Unknown entity type for time map: %', NEW.entity_type;
    END IF;

    IF entity_ws != NEW.workspace_id THEN
        RAISE EXCEPTION 'Workspace mismatch: EntityTimeMap vs Entity';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_entity_time_map_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_habit_checkin_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    habit_ws UUID;
BEGIN
    SELECT workspace_id INTO habit_ws FROM public.habits WHERE id = NEW.habit_id;
    
    IF NEW.workspace_id != habit_ws THEN
        RAISE EXCEPTION 'Workspace mismatch: Checkin workspace must match Habit workspace';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_habit_checkin_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_review_item_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    rev_ws UUID;
    entity_ws UUID;
BEGIN
    SELECT workspace_id INTO rev_ws FROM public.reviews WHERE id = NEW.review_id;
    
    IF NEW.entity_type = 'task' THEN
        SELECT workspace_id INTO entity_ws FROM public.tasks WHERE id = NEW.entity_id;
    ELSIF NEW.entity_type = 'project' THEN
        SELECT workspace_id INTO entity_ws FROM public.projects WHERE id = NEW.entity_id;
    ELSIF NEW.entity_type = 'objective' THEN
        SELECT workspace_id INTO entity_ws FROM public.objectives WHERE id = NEW.entity_id;
    END IF;

    IF entity_ws != rev_ws THEN
        RAISE EXCEPTION 'Workspace mismatch: Review Item vs Entity';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_review_item_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_section_workspace_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (SELECT workspace_id FROM public.projects WHERE id = NEW.project_id) != NEW.workspace_id THEN
        RAISE EXCEPTION 'Workspace mismatch: Section must belong to same workspace as Project';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_section_workspace_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_task_label_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    task_ws UUID;
    label_ws UUID;
BEGIN
    SELECT workspace_id INTO task_ws FROM public.tasks WHERE id = NEW.task_id;
    SELECT workspace_id INTO label_ws FROM public.labels WHERE id = NEW.label_id;
    
    -- Auto-fill if null (Convenience)
    IF NEW.workspace_id IS NULL THEN
        NEW.workspace_id := task_ws;
    END IF;

    -- Strict Checks
    IF NEW.workspace_id != task_ws THEN
        RAISE EXCEPTION 'Workspace mismatch: TaskLabel (%) vs Task (%)', NEW.workspace_id, task_ws;
    END IF;
    
    IF NEW.workspace_id != label_ws THEN
        RAISE EXCEPTION 'Workspace mismatch: TaskLabel (%) vs Label (%)', NEW.workspace_id, label_ws;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_task_label_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_task_workspace_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    proj_workspace UUID;
    sec_workspace UUID;
    sec_project UUID;
    assignee_workspace UUID;
BEGIN
    -- 1. Project Alignment
    IF NEW.project_id IS NOT NULL THEN
        SELECT workspace_id INTO proj_workspace FROM public.projects WHERE id = NEW.project_id;
        IF proj_workspace != NEW.workspace_id THEN
            RAISE EXCEPTION 'Workspace mismatch: Task workspace (%) does not match Project workspace (%)', NEW.workspace_id, proj_workspace;
        END IF;
    END IF;

    -- 2. Section Alignment
    IF NEW.section_id IS NOT NULL THEN
        SELECT workspace_id, project_id INTO sec_workspace, sec_project 
        FROM public.sections WHERE id = NEW.section_id;
        
        IF sec_workspace != NEW.workspace_id THEN
            RAISE EXCEPTION 'Workspace mismatch: Task workspace (%) does not match Section workspace (%)', NEW.workspace_id, sec_workspace;
        END IF;
        
        IF NEW.project_id IS NOT NULL AND sec_project != NEW.project_id THEN
             RAISE EXCEPTION 'Hierarchy mismatch: Section (%) belongs to Project (%) but Task is in Project (%)', NEW.section_id, sec_project, NEW.project_id;
        END IF;
    END IF;

    -- 3. Assignee Alignment
    IF NEW.assignee_member_id IS NOT NULL THEN
        SELECT workspace_id INTO assignee_workspace FROM public.workspace_members WHERE id = NEW.assignee_member_id;
        IF assignee_workspace != NEW.workspace_id THEN
             RAISE EXCEPTION 'Workspace mismatch: Task workspace (%) does not match Assignee workspace (%)', NEW.workspace_id, assignee_workspace;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_task_workspace_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_timeblock_task_alignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    tb_workspace UUID;
    t_workspace UUID;
BEGIN
    SELECT workspace_id INTO tb_workspace FROM public.timeblocks WHERE id = NEW.timeblock_id;
    SELECT workspace_id INTO t_workspace FROM public.tasks WHERE id = NEW.task_id;
    
    -- Auto-fill
    IF NEW.workspace_id IS NULL THEN
        NEW.workspace_id := tb_workspace;
    END IF;

    IF NEW.workspace_id != tb_workspace THEN
         RAISE EXCEPTION 'Workspace mismatch: Link (%) vs Timeblock (%)', NEW.workspace_id, tb_workspace;
    END IF;
    
    IF NEW.workspace_id != t_workspace THEN
         RAISE EXCEPTION 'Workspace mismatch: Link (%) vs Task (%)', NEW.workspace_id, t_workspace;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_timeblock_task_alignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_workspace_for_user"("workspace_name" "text" DEFAULT 'Personal Workspace'::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    new_workspace_id UUID;
    workspace_slug TEXT;
    user_id_val UUID;
BEGIN
    user_id_val := auth.uid();
    
    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;

    -- Generate unique slug
    workspace_slug := 'personal-' || substring(user_id_val::text from 1 for 8) || '-' || floor(random() * 1000)::text;

    -- Create workspace
    INSERT INTO public.workspaces (name, slug)
    VALUES (workspace_name, workspace_slug)
    RETURNING id INTO new_workspace_id;

    -- Create membership
    INSERT INTO public.workspace_members (workspace_id, user_id, role)
    VALUES (new_workspace_id, user_id_val, 'owner');

    RETURN new_workspace_id;
END;
$$;


ALTER FUNCTION "public"."create_workspace_for_user"("workspace_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  workspace_id uuid;
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');

  -- 2. Create Default Workspace
  INSERT INTO public.workspaces (name, slug)
  VALUES (
    'Personal Workspace',
    'personal-' || substring(NEW.id::text from 1 for 8) || '-' || floor(random() * 1000)::text
  )
  RETURNING id INTO workspace_id;

  -- 3. Create Membership
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_workspace_member"("_workspace_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_members 
    WHERE workspace_id = _workspace_id 
    AND user_id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."is_workspace_member"("_workspace_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."areas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "color" "text",
    "icon" "text",
    "order_key" bigint DEFAULT 1000,
    "is_archived" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."areas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid",
    "actor_id" "uuid",
    "action" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "diff" "jsonb",
    "occurred_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."decision_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "decision" "text" NOT NULL,
    "reason" "text",
    "decided_at" timestamp with time zone DEFAULT "now"(),
    "decided_by" "uuid"
);


ALTER TABLE "public"."decision_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."entity_time_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "time_map_id" "uuid" NOT NULL
);


ALTER TABLE "public"."entity_time_maps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."external_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "access_token" "text",
    "refresh_token" "text",
    "expires_at" timestamp with time zone,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."external_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."external_event_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "timeblock_id" "uuid",
    "external_account_id" "uuid" NOT NULL,
    "external_event_id" "text" NOT NULL,
    "sync_hash" "text",
    "last_synced_at" timestamp with time zone
);


ALTER TABLE "public"."external_event_links" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."filters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "query" "text" NOT NULL,
    "color" "text",
    "icon" "text",
    "is_favorite" boolean DEFAULT false,
    "position" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."filters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."habit_checkins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "habit_id" "uuid" NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "checkin_date" "date" NOT NULL,
    "value" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."habit_checkins" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."habits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "frequency_type" "text" DEFAULT 'daily'::"text",
    "target_count_per_period" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "area_id" "uuid"
);


ALTER TABLE "public"."habits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."labels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "color" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."labels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."objective_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "objective_id" "uuid" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "contribution_weight" numeric DEFAULT 1.0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."objective_links" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."objectives" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "parent_objective_id" "uuid",
    "title" "text" NOT NULL,
    "status" "text" DEFAULT 'on_track'::"text",
    "target_date" "date",
    "metric_type" "text" DEFAULT 'binary'::"text",
    "current_value" numeric DEFAULT 0,
    "target_value" numeric DEFAULT 100,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "area_id" "uuid",
    CONSTRAINT "check_objective_status" CHECK (("status" = ANY (ARRAY['on_track'::"text", 'at_risk'::"text", 'off_track'::"text", 'completed'::"text", 'canceled'::"text"])))
);


ALTER TABLE "public"."objectives" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plan_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "snapshot_date" timestamp with time zone DEFAULT "now"(),
    "content" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."plan_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_folders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "color" "text",
    "sort_order" bigint DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_folders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "folder_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'active'::"text",
    "default_view" "text" DEFAULT 'list'::"text",
    "sort_order" bigint DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "area_id" "uuid",
    CONSTRAINT "check_project_default_view" CHECK (("default_view" = ANY (ARRAY['list'::"text", 'board'::"text", 'calendar'::"text", 'timeline'::"text"]))),
    CONSTRAINT "projects_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'archived'::"text", 'on_hold'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recurrence_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "rrule_string" "text" NOT NULL,
    "next_occurrence" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recurrence_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "review_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "decision" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."review_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "period_start" "date" NOT NULL,
    "period_end" "date" NOT NULL,
    "review_type" "text" NOT NULL,
    "status" "text" DEFAULT 'in_progress'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_review_type_check" CHECK (("review_type" = ANY (ARRAY['weekly'::"text", 'monthly'::"text"])))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "sort_order" bigint DEFAULT 0,
    "is_archived" boolean DEFAULT false
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_dependencies" (
    "blocking_task_id" "uuid" NOT NULL,
    "blocked_task_id" "uuid" NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "dependency_type" "text" DEFAULT 'finish_to_start'::"text",
    CONSTRAINT "task_dependencies_check" CHECK (("blocking_task_id" <> "blocked_task_id"))
);


ALTER TABLE "public"."task_dependencies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_labels" (
    "task_id" "uuid" NOT NULL,
    "label_id" "uuid" NOT NULL,
    "workspace_id" "uuid" NOT NULL
);


ALTER TABLE "public"."task_labels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "project_id" "uuid",
    "section_id" "uuid",
    "parent_task_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'todo'::"text",
    "priority" smallint DEFAULT 4,
    "due_type" "text" DEFAULT 'none'::"text",
    "due_date" "date",
    "due_datetime" timestamp with time zone,
    "start_type" "text" DEFAULT 'none'::"text",
    "start_date" "date",
    "start_datetime" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "assignee_member_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "duration_minutes" integer,
    CONSTRAINT "check_due_date_logic" CHECK (((("due_type" = 'none'::"text") AND ("due_date" IS NULL) AND ("due_datetime" IS NULL)) OR (("due_type" = 'date'::"text") AND ("due_date" IS NOT NULL) AND ("due_datetime" IS NULL)) OR (("due_type" = 'datetime'::"text") AND ("due_datetime" IS NOT NULL) AND ("due_date" IS NULL)))),
    CONSTRAINT "check_start_date_logic" CHECK (((("start_type" = 'none'::"text") AND ("start_date" IS NULL) AND ("start_datetime" IS NULL)) OR (("start_type" = 'date'::"text") AND ("start_date" IS NOT NULL) AND ("start_datetime" IS NULL)) OR (("start_type" = 'datetime'::"text") AND ("start_datetime" IS NOT NULL) AND ("start_date" IS NULL)))),
    CONSTRAINT "tasks_due_type_check" CHECK (("due_type" = ANY (ARRAY['none'::"text", 'date'::"text", 'datetime'::"text"]))),
    CONSTRAINT "tasks_duration_minutes_check" CHECK ((("duration_minutes" IS NULL) OR ("duration_minutes" >= 0))),
    CONSTRAINT "tasks_priority_check" CHECK ((("priority" >= 1) AND ("priority" <= 4))),
    CONSTRAINT "tasks_start_type_check" CHECK (("start_type" = ANY (ARRAY['none'::"text", 'date'::"text", 'datetime'::"text"]))),
    CONSTRAINT "tasks_status_check" CHECK (("status" = ANY (ARRAY['todo'::"text", 'in_progress'::"text", 'done'::"text", 'canceled'::"text"])))
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


COMMENT ON COLUMN "public"."tasks"."duration_minutes" IS 'Estimated duration of the task in minutes';



CREATE TABLE IF NOT EXISTS "public"."time_map_windows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "time_map_id" "uuid" NOT NULL,
    "day_of_week" integer NOT NULL,
    "start_time_local" time without time zone NOT NULL,
    "end_time_local" time without time zone NOT NULL,
    "preference_level" "text" DEFAULT 'allowed'::"text",
    CONSTRAINT "time_map_windows_check" CHECK (("end_time_local" > "start_time_local")),
    CONSTRAINT "time_map_windows_day_of_week_check" CHECK ((("day_of_week" >= 0) AND ("day_of_week" <= 6))),
    CONSTRAINT "time_map_windows_preference_level_check" CHECK (("preference_level" = ANY (ARRAY['allowed'::"text", 'preferred'::"text", 'avoid'::"text"])))
);


ALTER TABLE "public"."time_map_windows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."time_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."time_maps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timeblock_tasks" (
    "timeblock_id" "uuid" NOT NULL,
    "task_id" "uuid" NOT NULL,
    "sort_order" bigint DEFAULT 0,
    "workspace_id" "uuid" NOT NULL
);


ALTER TABLE "public"."timeblock_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timeblocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "label" "text",
    "is_locked" boolean DEFAULT false,
    "source" "text" DEFAULT 'manual'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "area_id" "uuid",
    CONSTRAINT "check_timeblock_duration" CHECK (("end_time" > "start_time"))
);


ALTER TABLE "public"."timeblocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "locale" "text" DEFAULT 'en-US'::"text",
    "start_of_week" "text" DEFAULT 'monday'::"text",
    "theme" "text" DEFAULT 'system'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."view_orderings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "context_key" "text" NOT NULL,
    "ordered_ids" "uuid"[] NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."view_orderings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspace_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "workspace_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."workspace_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workspaces" OWNER TO "postgres";


ALTER TABLE ONLY "public"."areas"
    ADD CONSTRAINT "areas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."areas"
    ADD CONSTRAINT "areas_workspace_id_name_key" UNIQUE ("workspace_id", "name");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decision_logs"
    ADD CONSTRAINT "decision_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."entity_time_maps"
    ADD CONSTRAINT "entity_time_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."external_accounts"
    ADD CONSTRAINT "external_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."external_event_links"
    ADD CONSTRAINT "external_event_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."filters"
    ADD CONSTRAINT "filters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."habit_checkins"
    ADD CONSTRAINT "habit_checkins_habit_id_checkin_date_key" UNIQUE ("habit_id", "checkin_date");



ALTER TABLE ONLY "public"."habit_checkins"
    ADD CONSTRAINT "habit_checkins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."habits"
    ADD CONSTRAINT "habits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."labels"
    ADD CONSTRAINT "labels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objective_links"
    ADD CONSTRAINT "objective_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plan_snapshots"
    ADD CONSTRAINT "plan_snapshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_folders"
    ADD CONSTRAINT "project_folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recurrence_rules"
    ADD CONSTRAINT "recurrence_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_items"
    ADD CONSTRAINT "review_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_dependencies"
    ADD CONSTRAINT "task_dependencies_pkey" PRIMARY KEY ("blocking_task_id", "blocked_task_id");



ALTER TABLE ONLY "public"."task_labels"
    ADD CONSTRAINT "task_labels_pkey" PRIMARY KEY ("task_id", "label_id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."time_map_windows"
    ADD CONSTRAINT "time_map_windows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."time_maps"
    ADD CONSTRAINT "time_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timeblock_tasks"
    ADD CONSTRAINT "timeblock_tasks_pkey" PRIMARY KEY ("timeblock_id", "task_id");



ALTER TABLE ONLY "public"."timeblocks"
    ADD CONSTRAINT "timeblocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."view_orderings"
    ADD CONSTRAINT "view_orderings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_workspace_id_user_id_key" UNIQUE ("workspace_id", "user_id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_slug_key" UNIQUE ("slug");



CREATE INDEX "idx_habit_checkins_habit_id_date" ON "public"."habit_checkins" USING "btree" ("habit_id", "checkin_date");



CREATE INDEX "idx_habits_workspace_id" ON "public"."habits" USING "btree" ("workspace_id");



CREATE UNIQUE INDEX "idx_labels_name" ON "public"."labels" USING "btree" ("workspace_id", "lower"("name"));



CREATE INDEX "idx_tasks_workspace_due_date" ON "public"."tasks" USING "btree" ("workspace_id", "due_date");



CREATE INDEX "idx_tasks_workspace_project" ON "public"."tasks" USING "btree" ("workspace_id", "project_id");



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."filters" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "trg_check_area_habit" BEFORE INSERT OR UPDATE ON "public"."habits" FOR EACH ROW EXECUTE FUNCTION "public"."check_area_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_area_objective" BEFORE INSERT OR UPDATE ON "public"."objectives" FOR EACH ROW EXECUTE FUNCTION "public"."check_area_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_area_project" BEFORE INSERT OR UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."check_area_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_area_timeblock" BEFORE INSERT OR UPDATE ON "public"."timeblocks" FOR EACH ROW EXECUTE FUNCTION "public"."check_area_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_dependency_alignment" BEFORE INSERT OR UPDATE ON "public"."task_dependencies" FOR EACH ROW EXECUTE FUNCTION "public"."check_dependency_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_entity_time_map" BEFORE INSERT OR UPDATE ON "public"."entity_time_maps" FOR EACH ROW EXECUTE FUNCTION "public"."check_entity_time_map_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_habit_checkin" BEFORE INSERT OR UPDATE ON "public"."habit_checkins" FOR EACH ROW EXECUTE FUNCTION "public"."check_habit_checkin_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_review_item" BEFORE INSERT OR UPDATE ON "public"."review_items" FOR EACH ROW EXECUTE FUNCTION "public"."check_review_item_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_section_workspace" BEFORE INSERT OR UPDATE ON "public"."sections" FOR EACH ROW EXECUTE FUNCTION "public"."check_section_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_task_label" BEFORE INSERT OR UPDATE ON "public"."task_labels" FOR EACH ROW EXECUTE FUNCTION "public"."check_task_label_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_task_workspace" BEFORE INSERT OR UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."check_task_workspace_alignment"();



CREATE OR REPLACE TRIGGER "trg_check_timeblock_task" BEFORE INSERT OR UPDATE ON "public"."timeblock_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."check_timeblock_task_alignment"();



CREATE OR REPLACE TRIGGER "update_updated_at_areas" BEFORE UPDATE ON "public"."areas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."areas"
    ADD CONSTRAINT "areas_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."decision_logs"
    ADD CONSTRAINT "decision_logs_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."decision_logs"
    ADD CONSTRAINT "decision_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."entity_time_maps"
    ADD CONSTRAINT "entity_time_maps_time_map_id_fkey" FOREIGN KEY ("time_map_id") REFERENCES "public"."time_maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."entity_time_maps"
    ADD CONSTRAINT "entity_time_maps_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."external_accounts"
    ADD CONSTRAINT "external_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."external_event_links"
    ADD CONSTRAINT "external_event_links_external_account_id_fkey" FOREIGN KEY ("external_account_id") REFERENCES "public"."external_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."external_event_links"
    ADD CONSTRAINT "external_event_links_timeblock_id_fkey" FOREIGN KEY ("timeblock_id") REFERENCES "public"."timeblocks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."external_event_links"
    ADD CONSTRAINT "external_event_links_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."filters"
    ADD CONSTRAINT "filters_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."habit_checkins"
    ADD CONSTRAINT "habit_checkins_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."habit_checkins"
    ADD CONSTRAINT "habit_checkins_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."habits"
    ADD CONSTRAINT "habits_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."habits"
    ADD CONSTRAINT "habits_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."labels"
    ADD CONSTRAINT "labels_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objective_links"
    ADD CONSTRAINT "objective_links_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objective_links"
    ADD CONSTRAINT "objective_links_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_parent_objective_id_fkey" FOREIGN KEY ("parent_objective_id") REFERENCES "public"."objectives"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plan_snapshots"
    ADD CONSTRAINT "plan_snapshots_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_folders"
    ADD CONSTRAINT "project_folders_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."project_folders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recurrence_rules"
    ADD CONSTRAINT "recurrence_rules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_items"
    ADD CONSTRAINT "review_items_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_dependencies"
    ADD CONSTRAINT "task_dependencies_blocked_task_id_fkey" FOREIGN KEY ("blocked_task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_dependencies"
    ADD CONSTRAINT "task_dependencies_blocking_task_id_fkey" FOREIGN KEY ("blocking_task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_dependencies"
    ADD CONSTRAINT "task_dependencies_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_labels"
    ADD CONSTRAINT "task_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_labels"
    ADD CONSTRAINT "task_labels_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_labels"
    ADD CONSTRAINT "task_labels_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_assignee_member_id_fkey" FOREIGN KEY ("assignee_member_id") REFERENCES "public"."workspace_members"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."time_map_windows"
    ADD CONSTRAINT "time_map_windows_time_map_id_fkey" FOREIGN KEY ("time_map_id") REFERENCES "public"."time_maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."time_maps"
    ADD CONSTRAINT "time_maps_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timeblock_tasks"
    ADD CONSTRAINT "timeblock_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timeblock_tasks"
    ADD CONSTRAINT "timeblock_tasks_timeblock_id_fkey" FOREIGN KEY ("timeblock_id") REFERENCES "public"."timeblocks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timeblock_tasks"
    ADD CONSTRAINT "timeblock_tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timeblocks"
    ADD CONSTRAINT "timeblocks_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."timeblocks"
    ADD CONSTRAINT "timeblocks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."view_orderings"
    ADD CONSTRAINT "view_orderings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can delete filters in their workspaces" ON "public"."filters" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."workspace_members"
  WHERE (("workspace_members"."workspace_id" = "filters"."workspace_id") AND ("workspace_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert filters in their workspaces" ON "public"."filters" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workspace_members"
  WHERE (("workspace_members"."workspace_id" = "filters"."workspace_id") AND ("workspace_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update filters in their workspaces" ON "public"."filters" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."workspace_members"
  WHERE (("workspace_members"."workspace_id" = "filters"."workspace_id") AND ("workspace_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view filters in their workspaces" ON "public"."filters" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."workspace_members"
  WHERE (("workspace_members"."workspace_id" = "filters"."workspace_id") AND ("workspace_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view tasks in their workspaces" ON "public"."tasks" FOR SELECT USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "access_policy_folders" ON "public"."project_folders" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "access_policy_projects" ON "public"."projects" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "access_policy_sections" ON "public"."sections" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "access_policy_tasks" ON "public"."tasks" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "access_policy_timeblocks" ON "public"."timeblocks" USING ("public"."is_workspace_member"("workspace_id"));



ALTER TABLE "public"."areas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decision_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."entity_time_maps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."external_accounts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "external_accounts_self" ON "public"."external_accounts" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."external_event_links" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."filters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."habit_checkins" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."habits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."labels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."objective_links" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."objectives" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plan_snapshots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_folders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recurrence_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."review_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "self_access" ON "public"."external_accounts" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "self_access" ON "public"."user_profiles" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "self_access" ON "public"."view_orderings" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."task_dependencies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "task_dependencies_delete" ON "public"."task_dependencies" FOR DELETE USING (("workspace_id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



CREATE POLICY "task_dependencies_insert" ON "public"."task_dependencies" FOR INSERT WITH CHECK (("workspace_id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



CREATE POLICY "task_dependencies_select" ON "public"."task_dependencies" FOR SELECT USING (("workspace_id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



CREATE POLICY "task_dependencies_update" ON "public"."task_dependencies" FOR UPDATE USING (("workspace_id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."task_labels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tenant_access" ON "public"."areas" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."audit_logs" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."decision_logs" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."entity_time_maps" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."external_event_links" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."habit_checkins" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."habits" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."labels" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."objective_links" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."objectives" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."plan_snapshots" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."project_folders" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."projects" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."recurrence_rules" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."review_items" USING ((EXISTS ( SELECT 1
   FROM "public"."reviews" "r"
  WHERE (("r"."id" = "review_items"."review_id") AND "public"."is_workspace_member"("r"."workspace_id")))));



CREATE POLICY "tenant_access" ON "public"."reviews" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."sections" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."task_labels" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."tasks" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."time_map_windows" USING ((EXISTS ( SELECT 1
   FROM "public"."time_maps" "tm"
  WHERE (("tm"."id" = "time_map_windows"."time_map_id") AND "public"."is_workspace_member"("tm"."workspace_id")))));



CREATE POLICY "tenant_access" ON "public"."time_maps" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."timeblock_tasks" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "tenant_access" ON "public"."timeblocks" USING ("public"."is_workspace_member"("workspace_id"));



ALTER TABLE "public"."time_map_windows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."time_maps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timeblock_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timeblocks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_profile_self" ON "public"."user_profiles" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."view_orderings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "workspace_create" ON "public"."workspaces" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "workspace_delete" ON "public"."workspaces" FOR DELETE TO "authenticated" USING (("id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE (("workspace_members"."user_id" = "auth"."uid"()) AND ("workspace_members"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



ALTER TABLE "public"."workspace_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "workspace_members_delete" ON "public"."workspace_members" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "workspace_members_insert" ON "public"."workspace_members" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "workspace_members_select" ON "public"."workspace_members" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "workspace_members_update" ON "public"."workspace_members" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "workspace_select" ON "public"."workspaces" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



CREATE POLICY "workspace_update" ON "public"."workspaces" FOR UPDATE TO "authenticated" USING (("id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"())))) WITH CHECK (("id" IN ( SELECT "workspace_members"."workspace_id"
   FROM "public"."workspace_members"
  WHERE ("workspace_members"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."check_area_workspace_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_area_workspace_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_area_workspace_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_dependency_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_dependency_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_dependency_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_entity_time_map_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_entity_time_map_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_entity_time_map_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_habit_checkin_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_habit_checkin_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_habit_checkin_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_review_item_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_review_item_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_review_item_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_section_workspace_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_section_workspace_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_section_workspace_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_task_label_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_task_label_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_task_label_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_task_workspace_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_task_workspace_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_task_workspace_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_timeblock_task_alignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_timeblock_task_alignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_timeblock_task_alignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_workspace_for_user"("workspace_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_workspace_for_user"("workspace_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_workspace_for_user"("workspace_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_workspace_member"("_workspace_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_workspace_member"("_workspace_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_workspace_member"("_workspace_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."areas" TO "anon";
GRANT ALL ON TABLE "public"."areas" TO "authenticated";
GRANT ALL ON TABLE "public"."areas" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."decision_logs" TO "anon";
GRANT ALL ON TABLE "public"."decision_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."decision_logs" TO "service_role";



GRANT ALL ON TABLE "public"."entity_time_maps" TO "anon";
GRANT ALL ON TABLE "public"."entity_time_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."entity_time_maps" TO "service_role";



GRANT ALL ON TABLE "public"."external_accounts" TO "anon";
GRANT ALL ON TABLE "public"."external_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."external_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."external_event_links" TO "anon";
GRANT ALL ON TABLE "public"."external_event_links" TO "authenticated";
GRANT ALL ON TABLE "public"."external_event_links" TO "service_role";



GRANT ALL ON TABLE "public"."filters" TO "anon";
GRANT ALL ON TABLE "public"."filters" TO "authenticated";
GRANT ALL ON TABLE "public"."filters" TO "service_role";



GRANT ALL ON TABLE "public"."habit_checkins" TO "anon";
GRANT ALL ON TABLE "public"."habit_checkins" TO "authenticated";
GRANT ALL ON TABLE "public"."habit_checkins" TO "service_role";



GRANT ALL ON TABLE "public"."habits" TO "anon";
GRANT ALL ON TABLE "public"."habits" TO "authenticated";
GRANT ALL ON TABLE "public"."habits" TO "service_role";



GRANT ALL ON TABLE "public"."labels" TO "anon";
GRANT ALL ON TABLE "public"."labels" TO "authenticated";
GRANT ALL ON TABLE "public"."labels" TO "service_role";



GRANT ALL ON TABLE "public"."objective_links" TO "anon";
GRANT ALL ON TABLE "public"."objective_links" TO "authenticated";
GRANT ALL ON TABLE "public"."objective_links" TO "service_role";



GRANT ALL ON TABLE "public"."objectives" TO "anon";
GRANT ALL ON TABLE "public"."objectives" TO "authenticated";
GRANT ALL ON TABLE "public"."objectives" TO "service_role";



GRANT ALL ON TABLE "public"."plan_snapshots" TO "anon";
GRANT ALL ON TABLE "public"."plan_snapshots" TO "authenticated";
GRANT ALL ON TABLE "public"."plan_snapshots" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project_folders" TO "anon";
GRANT ALL ON TABLE "public"."project_folders" TO "authenticated";
GRANT ALL ON TABLE "public"."project_folders" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."recurrence_rules" TO "anon";
GRANT ALL ON TABLE "public"."recurrence_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."recurrence_rules" TO "service_role";



GRANT ALL ON TABLE "public"."review_items" TO "anon";
GRANT ALL ON TABLE "public"."review_items" TO "authenticated";
GRANT ALL ON TABLE "public"."review_items" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";



GRANT ALL ON TABLE "public"."task_dependencies" TO "anon";
GRANT ALL ON TABLE "public"."task_dependencies" TO "authenticated";
GRANT ALL ON TABLE "public"."task_dependencies" TO "service_role";



GRANT ALL ON TABLE "public"."task_labels" TO "anon";
GRANT ALL ON TABLE "public"."task_labels" TO "authenticated";
GRANT ALL ON TABLE "public"."task_labels" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON TABLE "public"."time_map_windows" TO "anon";
GRANT ALL ON TABLE "public"."time_map_windows" TO "authenticated";
GRANT ALL ON TABLE "public"."time_map_windows" TO "service_role";



GRANT ALL ON TABLE "public"."time_maps" TO "anon";
GRANT ALL ON TABLE "public"."time_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."time_maps" TO "service_role";



GRANT ALL ON TABLE "public"."timeblock_tasks" TO "anon";
GRANT ALL ON TABLE "public"."timeblock_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."timeblock_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."timeblocks" TO "anon";
GRANT ALL ON TABLE "public"."timeblocks" TO "authenticated";
GRANT ALL ON TABLE "public"."timeblocks" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."view_orderings" TO "anon";
GRANT ALL ON TABLE "public"."view_orderings" TO "authenticated";
GRANT ALL ON TABLE "public"."view_orderings" TO "service_role";



GRANT ALL ON TABLE "public"."workspace_members" TO "anon";
GRANT ALL ON TABLE "public"."workspace_members" TO "authenticated";
GRANT ALL ON TABLE "public"."workspace_members" TO "service_role";



GRANT ALL ON TABLE "public"."workspaces" TO "anon";
GRANT ALL ON TABLE "public"."workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."workspaces" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







