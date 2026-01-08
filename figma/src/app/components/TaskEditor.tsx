import { useState } from 'react';
import { X, Flag, Plus, Paperclip, Hash, Bell, MapPin } from 'lucide-react';
import { ProjectDropdown } from './ProjectDropdown';
import { DatePicker } from './DatePicker';
import { DeadlinePicker } from './DeadlinePicker';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
  subtasks?: Subtask[];
  comments?: Comment[];
}

interface TaskEditorProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function TaskEditor({ task, onClose, onSave }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [project, setProject] = useState(task?.project || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>(
    task?.priority || ''
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [comments, setComments] = useState<Comment[]>(task?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showDeadline, setShowDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');

  if (!task) return null;

  const handleSave = () => {
    onSave({
      ...task,
      title,
      notes,
      dueDate: dueDate || undefined,
      project: project || undefined,
      priority: priority || undefined,
      subtasks,
      comments,
    });
    onClose();
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: '',
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const handleUpdateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, title } : st)));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'JD',
      timestamp: 'Just now',
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const priorityOptions = [
    { value: 'low', label: 'P3', color: '#86868B' },
    { value: 'medium', label: 'P2', color: '#F6BD16' },
    { value: 'high', label: 'P1', color: '#FF3B30' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2 text-[13px] text-[#86868B]">
            {project && (
              <>
                <Hash size={14} strokeWidth={2} />
                <span>{project}</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-black/[0.06] flex items-center justify-center transition-colors"
          >
            <X size={16} strokeWidth={2} className="text-[#86868B]" />
          </button>
        </div>

        {/* Two-column layout */}
        <div className="flex">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Task Title */}
            <div className="flex items-start gap-2.5">
              <button
                onClick={() => {
                  /* toggle task completion */
                }}
                className="mt-[2px] flex-shrink-0"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    task.completed
                      ? 'bg-[#007AFF] border-[#007AFF]'
                      : 'border-[#D1D1D6] hover:border-[#007AFF]/50'
                  }`}
                >
                  {task.completed && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="flex-1 text-[20px] text-[#1D1D1F] placeholder-[#C7C7CC] border-none outline-none bg-transparent font-medium"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full text-[14px] text-[#1D1D1F] placeholder-[#86868B] border-none outline-none bg-transparent resize-none leading-relaxed"
              />
            </div>

            {/* Subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className="flex-shrink-0"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                          subtask.completed
                            ? 'bg-[#007AFF] border-[#007AFF]'
                            : 'border-[#D1D1D6] hover:border-[#007AFF]/50'
                        }`}
                      >
                        {subtask.completed && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.5 6L5 8.5L9.5 3.5"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) =>
                        handleUpdateSubtask(subtask.id, e.target.value)
                      }
                      placeholder="Subtask"
                      className={`flex-1 text-[14px] border-none outline-none bg-transparent ${
                        subtask.completed
                          ? 'text-[#86868B] line-through'
                          : 'text-[#1D1D1F]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Button */}
            <button
              onClick={handleAddSubtask}
              className="flex items-center gap-2 text-[13px] text-[#86868B] hover:text-[#1D1D1F] transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
              <span>Add sub-task</span>
            </button>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="space-y-3 pt-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5B8FF9] flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
                      {comment.author}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium text-[#1D1D1F]">
                          {comment.author}
                        </span>
                        <span className="text-[11px] text-[#86868B]">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#1D1D1F] leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div className="flex gap-2.5 pt-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5B8FF9] flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
                JD
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#F5F5F4] rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                  placeholder="Comment"
                  className="flex-1 text-[14px] text-[#1D1D1F] placeholder-[#86868B] border-none outline-none bg-transparent"
                />
                <button className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                  <Paperclip size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Properties */}
          <div className="w-56 border-l border-black/[0.06] bg-[#FAFAF9] p-3 space-y-3 overflow-y-auto max-h-[70vh]">
            {/* Project */}
            <div>
              <label className="text-[11px] text-[#86868B] mb-1.5 block">
                Project
              </label>
              <ProjectDropdown value={project} onChange={setProject} />
            </div>

            {/* Date */}
            <div>
              <label className="text-[11px] text-[#86868B] mb-1.5 block">Date</label>
              <DatePicker value={dueDate} onChange={setDueDate} />
            </div>

            {/* Deadline */}
            <DeadlinePicker value={deadline} onChange={setDeadline} />

            {/* Priority */}
            <div>
              <label className="text-[11px] text-[#86868B] mb-1.5 block">
                Priority
              </label>
              <div className="space-y-1">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() =>
                      setPriority(priority === p.value ? '' : (p.value as any))
                    }
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-all flex items-center gap-1.5 ${
                      priority === p.value
                        ? 'bg-white text-[#1D1D1F]'
                        : 'text-[#86868B] hover:bg-black/[0.04]'
                    }`}
                  >
                    <Flag
                      size={12}
                      strokeWidth={2}
                      style={{ color: priority === p.value ? p.color : 'currentColor' }}
                      fill={
                        priority === p.value && p.value === 'high' ? p.color : 'none'
                      }
                    />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Labels */}
            <button className="w-full text-left px-2.5 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-all flex items-center justify-between">
              <span>Labels</span>
              <Plus size={12} strokeWidth={2} />
            </button>

            {/* Reminders */}
            <button className="w-full text-left px-2.5 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-all flex items-center justify-between">
              <span>Reminders</span>
              <Plus size={12} strokeWidth={2} />
            </button>

            {/* Location */}
            <button className="w-full text-left px-2.5 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-all flex items-center justify-between">
              <span>Location</span>
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-black/[0.06] bg-[#FAFAF9]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-[13px] text-[#1D1D1F] hover:bg-black/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md text-[13px] bg-[#007AFF] text-white hover:bg-[#0051D5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}