import { useState, useRef, useEffect } from 'react';
import { Hash, Check } from 'lucide-react';

interface ProjectDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const projects = [
  { id: 'noni', name: 'Noni', type: 'project' },
  { id: 'okrs', name: 'OKRs', type: 'project' },
  { id: 'pessoal', name: 'Pessoal', type: 'category' },
  { id: 'casa', name: 'Casa', type: 'project' },
  { id: 'financas', name: 'Finanças', type: 'project' },
  { id: 'casasftu', name: 'CasasFTU', type: 'project' },
  { id: 'familia', name: 'Família', type: 'project' },
  { id: 'amigos', name: 'Amigos', type: 'project' },
  { id: 'saude', name: 'Saúde', type: 'project' },
  { id: 'compras', name: 'Compras', type: 'project' },
];

export function ProjectDropdown({ value, onChange }: ProjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProject = projects.find((p) => p.name === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-all flex items-center gap-1.5 bg-white text-[#1D1D1F] hover:bg-black/[0.04]"
      >
        <Hash size={12} strokeWidth={2} className="text-[#86868B]" />
        <span className="flex-1">{value || 'Select project'}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-[#86868B]"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-black/[0.06] z-50 overflow-hidden"
          style={{
            boxShadow:
              '0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Search */}
          <div className="p-2 border-b border-black/[0.06]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a project name"
              className="w-full px-2 py-1.5 text-[13px] text-[#1D1D1F] placeholder-[#86868B] border-none outline-none bg-transparent"
              autoFocus
            />
          </div>

          {/* Project List */}
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onChange(project.name);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {project.type === 'category' ? (
                    <Hash size={12} strokeWidth={2} className="text-[#86868B]" />
                  ) : (
                    <div className="w-3 h-3 border border-[#86868B] rounded-sm" />
                  )}
                </div>
                <span className="flex-1 text-left">{project.name}</span>
                {value === project.name && (
                  <Check size={14} strokeWidth={2} className="text-[#007AFF]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
