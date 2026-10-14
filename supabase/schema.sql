-- ==============================================================================
-- TASKFLOW STUDIO - SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- ==============================================================================
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(30) DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_name VARCHAR(100) DEFAULT 'Alex Chen',
    assignee_avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    due_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for public demo access (or authenticated users)
-- In production, replace with: USING (auth.uid() = user_id)
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to projects" ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read access to tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete to tasks" ON public.tasks FOR ALL USING (true);

CREATE POLICY "Allow public read access to activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert to activity_logs" ON public.activity_logs FOR ALL USING (true);

-- Enable Supabase Realtime for live kanban updates across multiple tabs
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- SEED DATA (Sample Projects and Tasks for instant evaluation)
DO $$
DECLARE
    default_proj_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- Check if project already exists
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE id = default_proj_id) THEN
        INSERT INTO public.projects (id, title, description, color)
        VALUES (
            default_proj_id,
            'TaskFlow V2.0 Core Platform',
            'Full-stack dynamic sprint management suite with real-time analytics & automated reporting',
            '#6366f1'
        );

        INSERT INTO public.tasks (project_id, title, description, status, priority, assignee_name, due_date, order_index)
        VALUES
        (default_proj_id, 'Design Responsive CSS Design System', 'Establish HSL color palette, typography scale, glassmorphism cards, and fluid grid layouts.', 'done', 'high', 'Elena Vance', CURRENT_DATE - 3, 0),
        (default_proj_id, 'Setup React Router & State Flow', 'Implement unidirectional dataflow, context-based project switching, and custom hooks for board management.', 'done', 'urgent', 'Marcus Brody', CURRENT_DATE - 1, 1),
        (default_proj_id, 'Configure Supabase Realtime Sync', 'Connect PostgreSQL tables with instant websocket updates across collaborative clients.', 'in_progress', 'urgent', 'Elena Vance', CURRENT_DATE + 2, 0),
        (default_proj_id, 'Build PHP Executive Audit Engine', 'Develop server-side report generator API with digest verification and printable executive summary.', 'in_progress', 'high', 'Alex Chen', CURRENT_DATE + 3, 1),
        (default_proj_id, 'Implement Drag & Drop Kanban Reordering', 'Support smooth status transitions between Todo, In Progress, Review, and Done.', 'todo', 'medium', 'Marcus Brody', CURRENT_DATE + 5, 0),
        (default_proj_id, 'End-to-End Git Repository Setup', 'Organize clean commit history, write comprehensive README.md, and document deployment architecture.', 'review', 'medium', 'Alex Chen', CURRENT_DATE + 4, 0);

        INSERT INTO public.activity_logs (project_id, action, details)
        VALUES
        (default_proj_id, 'PROJECT_INITIALIZED', 'Project "TaskFlow V2.0 Core Platform" created with Supabase Postgres schema.'),
        (default_proj_id, 'TASK_COMPLETED', 'Design Responsive CSS Design System marked as Completed.'),
        (default_proj_id, 'TASK_UPDATED', 'Configure Supabase Realtime Sync moved to In Progress.');
    END IF;
END $$;
