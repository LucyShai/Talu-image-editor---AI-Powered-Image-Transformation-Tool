import React from 'react';
import { TemplateId, ParamValue, TemplateParam } from '../types';
import { TEMPLATES } from '../constants';

interface ParameterControlsProps {
  templateId: TemplateId;
  values: Record<string, ParamValue>;
  onChange: (key: string, value: ParamValue) => void;
  disabled?: boolean;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({ templateId, values, onChange, disabled }) => {
  const template = TEMPLATES.find(t => t.id === templateId);

  if (!template) return null;

  return (
    <div className="space-y-5 bg-white/5 backdrop-blur-md p-5 rounded-xl border border-pink-500/10">
      <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
        Configuration
      </h3>
      
      {template.params.map((param: TemplateParam) => (
        <div key={param.id} className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-slate-200 font-medium">
              {param.label}
            </label>
            {param.type === 'slider' && (
              <span className="text-xs text-pink-300 font-mono bg-pink-900/30 px-2 py-0.5 rounded border border-pink-500/30">
                {values[param.id]}
              </span>
            )}
          </div>

          {/* Render input based on type */}
          {param.type === 'text' && (
            <input
              type="text"
              value={String(values[param.id] || '')}
              onChange={(e) => onChange(param.id, e.target.value)}
              disabled={disabled}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-slate-500"
            />
          )}

          {param.type === 'textarea' && (
            <textarea
              rows={4}
              value={String(values[param.id] || '')}
              onChange={(e) => onChange(param.id, e.target.value)}
              disabled={disabled}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-y placeholder-slate-500"
            />
          )}

          {param.type === 'slider' && (
            <div className="relative w-full h-6 flex items-center">
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={Number(values[param.id] || 0)}
                onChange={(e) => onChange(param.id, parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
              />
            </div>
          )}

          {param.type === 'color' && (
            <div className="flex items-center space-x-3 bg-black/20 p-2 rounded-lg border border-white/5">
              <input
                type="color"
                value={String(values[param.id] || '#000000')}
                onChange={(e) => onChange(param.id, e.target.value)}
                disabled={disabled}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-xs text-slate-400 font-mono uppercase">
                {String(values[param.id])}
              </span>
            </div>
          )}

          {param.type === 'select' && (
            <div className="relative">
              <select
                value={String(values[param.id])}
                onChange={(e) => onChange(param.id, e.target.value)}
                disabled={disabled}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
              >
                {param.options?.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};