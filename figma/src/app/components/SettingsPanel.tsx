import { X, Key, Layers } from 'lucide-react';
import { useState } from 'react';

interface LifeArea {
  id: string;
  name: string;
  color: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  todoistApiKey: string;
  onTodoistApiKeyChange: (key: string) => void;
  lifeAreas: LifeArea[];
  onLifeAreasChange: (areas: LifeArea[]) => void;
}

type SettingsTab = 'integrations' | 'lifeareas';

export function SettingsPanel({
  isOpen,
  onClose,
  todoistApiKey,
  onTodoistApiKeyChange,
  lifeAreas,
  onLifeAreasChange,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('integrations');
  const [apiKeyInput, setApiKeyInput] = useState(todoistApiKey);
  const [editingAreas, setEditingAreas] = useState(lifeAreas);
  const [newAreaName, setNewAreaName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onTodoistApiKeyChange(apiKeyInput);
    onLifeAreasChange(editingAreas);
    onClose();
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;
    
    const newArea: LifeArea = {
      id: Date.now().toString(),
      name: newAreaName.trim(),
      color: '#007AFF',
    };
    
    setEditingAreas([...editingAreas, newArea]);
    setNewAreaName('');
  };

  const handleRemoveArea = (id: string) => {
    setEditingAreas(editingAreas.filter(area => area.id !== id));
  };

  const handleAreaNameChange = (id: string, name: string) => {
    setEditingAreas(
      editingAreas.map(area =>
        area.id === id ? { ...area, name } : area
      )
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="fixed inset-y-0 right-0 w-[640px] bg-[#FAFAF9] shadow-2xl z-50 flex">
        {/* Sidebar */}
        <div className="w-48 bg-[#F5F5F4] border-r border-black/[0.06] py-4">
          <div className="px-3 mb-2">
            <h3 className="text-[11px] font-medium text-[#86868B] uppercase tracking-wide px-2">
              Settings
            </h3>
          </div>
          
          <div className="space-y-0.5 px-2">
            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                activeTab === 'integrations'
                  ? 'bg-white text-[#007AFF] shadow-sm'
                  : 'text-[#1D1D1F] hover:bg-white/50'
              }`}
            >
              <Key size={14} strokeWidth={2} />
              <span>Integrations</span>
            </button>
            
            <button
              onClick={() => setActiveTab('lifeareas')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                activeTab === 'lifeareas'
                  ? 'bg-white text-[#007AFF] shadow-sm'
                  : 'text-[#1D1D1F] hover:bg-white/50'
              }`}
            >
              <Layers size={14} strokeWidth={2} />
              <span>Life Areas</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
            <h2 className="text-[15px] text-[#1D1D1F]">
              {activeTab === 'integrations' ? 'Integrations' : 'Life Areas'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/[0.04] rounded-md transition-colors"
            >
              <X size={16} strokeWidth={2} className="text-[#86868B]" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'integrations' && (
              <div className="max-w-md space-y-6">
                {/* Todoist Integration */}
                <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/[0.06]">
                    <h3 className="text-[14px] font-medium text-[#1D1D1F]">Todoist</h3>
                    <p className="text-[12px] text-[#86868B] mt-0.5">
                      Connect your Todoist account to sync tasks
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <label className="block mb-2">
                      <span className="text-[13px] text-[#1D1D1F]">API Key</span>
                    </label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your Todoist API key"
                      className="w-full px-3 py-2 text-[13px] bg-white border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
                    />
                    <p className="text-[11px] text-[#86868B] mt-2">
                      Find your API key in Todoist Settings → Integrations → Developer
                    </p>
                  </div>
                </div>

                {/* Future integrations placeholder */}
                <div className="bg-white/50 rounded-xl border border-black/[0.06] overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/[0.06]">
                    <h3 className="text-[14px] font-medium text-[#86868B]">More integrations</h3>
                    <p className="text-[12px] text-[#86868B] mt-0.5">
                      Google Calendar, Apple Reminders, and more coming soon
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lifeareas' && (
              <div className="max-w-md space-y-4">
                <div className="mb-4">
                  <p className="text-[13px] text-[#86868B]">
                    Organize your projects and tasks by life areas. These act as high-level categories for better organization.
                  </p>
                </div>

                {/* Life Areas List */}
                <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9]">
                    <h3 className="text-[13px] font-medium text-[#1D1D1F]">Your Life Areas</h3>
                  </div>
                  
                  <div className="divide-y divide-black/[0.04]">
                    {editingAreas.map((area) => (
                      <div
                        key={area.id}
                        className="flex items-center gap-3 px-4 py-2.5 group"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={area.name}
                            onChange={(e) => handleAreaNameChange(area.id, e.target.value)}
                            className="w-full px-2 py-1 text-[13px] bg-transparent border border-transparent hover:border-black/[0.1] focus:border-[#007AFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveArea(area.id)}
                          className="opacity-0 group-hover:opacity-100 text-[12px] text-[#FF3B30] hover:text-[#FF3B30]/80 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    {editingAreas.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[13px] text-[#86868B]">
                          No life areas yet. Add your first one below.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add New Area */}
                <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9]">
                    <h3 className="text-[13px] font-medium text-[#1D1D1F]">Add Life Area</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddArea();
                          }
                        }}
                        placeholder="e.g., Career, Family, Health"
                        className="flex-1 px-3 py-2 text-[13px] bg-white border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
                      />
                      <button
                        onClick={handleAddArea}
                        disabled={!newAreaName.trim()}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#0051D5] disabled:bg-[#86868B] disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-[#F5F5F4] rounded-xl border border-black/[0.06] p-4">
                  <h4 className="text-[12px] font-medium text-[#86868B] mb-2">Suggested areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Work', 'Family', 'Health', 'Personal', 'Home', 'Finance'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setNewAreaName(suggestion)}
                        className="px-2.5 py-1 text-[12px] text-[#1D1D1F] bg-white hover:bg-[#007AFF] hover:text-white border border-black/[0.06] rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-14 flex items-center justify-between px-4 border-t border-black/[0.06] bg-white/80 backdrop-blur-xl">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[13px] text-[#1D1D1F] hover:bg-black/[0.04] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
