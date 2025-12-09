import React from 'react';
import { TEMPLATES } from '../constants';
import { TemplateId } from '../types';
import * as Icons from 'lucide-react';

interface TemplateSelectorProps {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  disabled?: boolean;
}

// These are the IDs we want to EXCLUDE from the sidebar list (they are shown in Quick Start instead)
const SCENARIO_IDS = [
  TemplateId.BG_SHIP,
  TemplateId.BG_BEACH,
  TemplateId.BG_STADIUM,
  TemplateId.BG_NEON,
  TemplateId.BG_FOREST
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedId, onSelect, disabled }) => {
  // Filter out the scenarios, only show editing tools
  const templatesToShow = TEMPLATES.filter(t => !SCENARIO_IDS.includes(t.id));

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {templatesToShow.map((template) => {
        // Dynamic icon rendering
        const IconComponent = (Icons as any)[template.iconName] || Icons.HelpCircle;
        const isSelected = selectedId === template.id;

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            disabled={disabled}
            className={`
              relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 overflow-hidden text-center min-h-[90px]
              ${isSelected 
                ? 'bg-pink-600/20 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Gradient background for active state */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-fuchsia-500/20 to-purple-500/20" />
            )}

            <IconComponent 
              size={22} 
              className={`mb-2 relative z-10 transition-colors duration-300 ${
                isSelected 
                  ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]' 
                  : 'text-slate-400 group-hover:text-pink-300'
              }`} 
            />
            <span className={`text-xs font-medium relative z-10 transition-colors duration-300 leading-tight ${
              isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
            }`}>
              {template.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};