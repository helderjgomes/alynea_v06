import { Folder, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  section?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface Section {
  id: string;
  name: string;
  project: string;
  order: number;
}

interface ProjectsViewProps {
  tasks: Task[];
  sections: Section[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  selectedProject?: string | null;
}

export function ProjectsView({ tasks, sections, onToggle, onTaskClick, selectedProject }: ProjectsViewProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Group tasks by project
  const tasksByProject = tasks
    .filter(task => !task.completed)
    .reduce((acc, task) => {
      const projectName = task.project || 'No Project';
      if (!acc[projectName]) {
        acc[projectName] = [];
      }
      acc[projectName].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

  // Filter to selected project if one is selected
  const projects = selectedProject 
    ? [selectedProject].filter(p => tasksByProject[p])
    : Object.keys(tasksByProject).sort();

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Sections */}
        <div className="space-y-4">
          {projects.map((projectName) => {
            const projectTasks = tasksByProject[projectName];
            const projectSections = sections
              .filter(s => s.project === projectName)
              .sort((a, b) => a.order - b.order);

            return (
              <div key={projectName}>
                {projectSections.length > 0 ? (
                  <>
                    {projectSections.map((section) => {
                      const sectionTasks = projectTasks.filter(t => t.section === section.id);
                      
                      if (sectionTasks.length === 0) return null;

                      const isCollapsed = collapsedSections.has(section.id);

                      return (
                        <div key={section.id} className="bg-white rounded-xl overflow-hidden border border-black/[0.06] mb-4">
                          {/* Section Header */}
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9] hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <ChevronDown
                                  size={16}
                                  strokeWidth={2}
                                  className={`text-[#86868B] transition-transform flex-shrink-0 ${
                                    isCollapsed ? '-rotate-90' : ''
                                  }`}
                                />
                                <div className="text-left">
                                  <h3 className="text-[15px] text-[#1D1D1F] mb-0">
                                    {section.name}
                                  </h3>
                                  <p className="text-[12px] text-[#86868B]">
                                    {projectName}
                                  </p>
                                </div>
                              </div>
                              <div className="text-[13px] text-[#86868B] tabular-nums">
                                {sectionTasks.length} {sectionTasks.length === 1 ? 'task' : 'tasks'}
                              </div>
                            </div>
                          </button>

                          {/* Section Tasks */}
                          {!isCollapsed && (
                            <div>
                              {sectionTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                                  onClick={() => onTaskClick(task.id)}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggle(task.id);
                                    }}
                                    className="mt-[1px] flex-shrink-0"
                                  >
                                    <div className="w-4 h-4 rounded-full border-2 border-[#D1D1D6] hover:border-[#007AFF]/50 transition-all" />
                                  </button>

                                  <div className="flex-1 min-w-0">
                                    <div className="text-[14px] leading-snug text-[#1D1D1F]">
                                      {task.title}
                                    </div>
                                    {task.notes && (
                                      <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                                        {task.notes}
                                      </div>
                                    )}
                                    {task.dueDate && (
                                      <div className="text-[12px] text-[#86868B] mt-1">
                                        Due {task.dueDate}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Tasks without section */}
                    {projectTasks.filter(t => !t.section).length > 0 && (
                      <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06] mb-4">
                        <button
                          onClick={() => toggleSection(`${projectName}-other`)}
                          className="w-full px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9] hover:bg-[#F5F5F4] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <ChevronDown
                                size={16}
                                strokeWidth={2}
                                className={`text-[#86868B] transition-transform flex-shrink-0 ${
                                  collapsedSections.has(`${projectName}-other`) ? '-rotate-90' : ''
                                }`}
                              />
                              <div className="text-left">
                                <h3 className="text-[15px] text-[#1D1D1F] mb-0">
                                  Other
                                </h3>
                                <p className="text-[12px] text-[#86868B]">
                                  {projectName}
                                </p>
                              </div>
                            </div>
                            <div className="text-[13px] text-[#86868B] tabular-nums">
                              {projectTasks.filter(t => !t.section).length} {projectTasks.filter(t => !t.section).length === 1 ? 'task' : 'tasks'}
                            </div>
                          </div>
                        </button>

                        {!collapsedSections.has(`${projectName}-other`) && (
                          <div>
                            {projectTasks.filter(t => !t.section).map((task) => (
                              <div
                                key={task.id}
                                className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                                onClick={() => onTaskClick(task.id)}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle(task.id);
                                  }}
                                  className="mt-[1px] flex-shrink-0"
                                >
                                  <div className="w-4 h-4 rounded-full border-2 border-[#D1D1D6] hover:border-[#007AFF]/50 transition-all" />
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="text-[14px] leading-snug text-[#1D1D1F]">
                                    {task.title}
                                  </div>
                                  {task.notes && (
                                    <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                                      {task.notes}
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div className="text-[12px] text-[#86868B] mt-1">
                                      Due {task.dueDate}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  // No sections - show all tasks in a single card
                  <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06] mb-4">
                    <div className="px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-[15px] text-[#1D1D1F] mb-0">
                            {projectName}
                          </h3>
                          <p className="text-[12px] text-[#86868B]">
                            All tasks
                          </p>
                        </div>
                        <div className="text-[13px] text-[#86868B] tabular-nums">
                          {projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'}
                        </div>
                      </div>
                    </div>

                    <div>
                      {projectTasks.map((task) => (
                        <div
                          key={task.id}
                          className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                          onClick={() => onTaskClick(task.id)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggle(task.id);
                            }}
                            className="mt-[1px] flex-shrink-0"
                          >
                            <div className="w-4 h-4 rounded-full border-2 border-[#D1D1D6] hover:border-[#007AFF]/50 transition-all" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] leading-snug text-[#1D1D1F]">
                              {task.title}
                            </div>
                            {task.notes && (
                              <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                                {task.notes}
                              </div>
                            )}
                            {task.dueDate && (
                              <div className="text-[12px] text-[#86868B] mt-1">
                                Due {task.dueDate}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06] px-4 py-12 text-center">
            <Folder size={32} strokeWidth={1.5} className="text-[#86868B] mx-auto mb-3" />
            <p className="text-[15px] text-[#1D1D1F] mb-1">No projects yet</p>
            <p className="text-[13px] text-[#86868B]">
              Tasks with projects will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}