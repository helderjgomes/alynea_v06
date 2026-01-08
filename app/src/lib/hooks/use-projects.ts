'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

interface UseProjectsOptions {
    status?: Project['status'];
}

interface UseProjectsReturn {
    projects: Project[];
    isLoading: boolean;
    error: Error | null;
    addProject: (project: ProjectInsert) => Promise<Project | null>;
    updateProject: (id: string, updates: ProjectUpdate) => Promise<Project | null>;
    deleteProject: (id: string) => Promise<boolean>;
    refetch: () => Promise<void>;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const supabase = createClient();

    const fetchProjects = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
                .from('projects')
                .select('*')
                .order('sort_order', { ascending: true });

            if (options.status) {
                query = query.eq('status', options.status);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setProjects((data as Project[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        } finally {
            setIsLoading(false);
        }
    }, [options.status, supabase]);

    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    React.useEffect(() => {
        const channel = supabase
            .channel('projects-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setProjects((prev) => [...prev, payload.new as Project]);
                    } else if (payload.eventType === 'UPDATE') {
                        setProjects((prev) =>
                            prev.map((p) =>
                                p.id === (payload.new as Project).id ? (payload.new as Project) : p
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setProjects((prev) =>
                            prev.filter((p) => p.id !== (payload.old as { id: string }).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const addProject = async (projectData: ProjectInsert): Promise<Project | null> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error: insertError } = await (supabase as any)
                .from('projects')
                .insert(projectData)
                .select()
                .single();

            if (insertError) throw insertError;

            const newProject = data as Project;
            setProjects((prev) => [...prev, newProject]);
            return newProject;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add project'));
            return null;
        }
    };

    const updateProject = async (id: string, updates: ProjectUpdate): Promise<Project | null> => {
        try {
            const previousProject = projects.find((p) => p.id === id);
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? { ...p, ...updates } as Project : p))
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error: updateError } = await (supabase as any)
                .from('projects')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                if (previousProject) {
                    setProjects((prev) => prev.map((p) => (p.id === id ? previousProject : p)));
                }
                throw updateError;
            }

            return data as Project;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update project'));
            return null;
        }
    };

    const deleteProject = async (id: string): Promise<boolean> => {
        try {
            const previousProject = projects.find((p) => p.id === id);
            setProjects((prev) => prev.filter((p) => p.id !== id));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: deleteError } = await (supabase as any)
                .from('projects')
                .delete()
                .eq('id', id);

            if (deleteError) {
                if (previousProject) {
                    setProjects((prev) => [...prev, previousProject]);
                }
                throw deleteError;
            }

            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete project'));
            return false;
        }
    };

    return {
        projects,
        isLoading,
        error,
        addProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects,
    };
}
