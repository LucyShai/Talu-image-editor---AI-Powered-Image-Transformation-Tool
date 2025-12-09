import React, { useState, useEffect } from 'react';
import { AppState, TemplateId, ParamValue, LibraryItem } from './types';
import { TEMPLATES } from './constants';
import { editImageWithGemini } from './services/geminiService';
import { TemplateSelector } from './components/TemplateSelector';
import { ParameterControls } from './components/ParameterControls';
import { ImageUploader } from './components/ImageUploader';
import { 
  Wand2, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  ArrowRight,
  Undo2,
  Redo2,
  Check,
  X,
  Palette,
  Anchor,
  Sun,
  Trophy,
  Zap,
  Mountain,
  Sparkles,
  Save,
  Grid,
  Image as ImageIcon,
  Clock
} from 'lucide-react';

const INITIAL_TEMPLATE = TemplateId.CUSTOM;

// New scenes for quick start
const SCENE_TEMPLATES = [
  { id: TemplateId.BG_SHIP, label: 'Luxury Ship', icon: Anchor },
  { id: TemplateId.BG_BEACH, label: 'Tropical Beach', icon: Sun },
  { id: TemplateId.BG_STADIUM, label: 'Stadium', icon: Trophy },
  { id: TemplateId.BG_NEON, label: 'Neon City', icon: Zap },
  { id: TemplateId.BG_FOREST, label: 'Forest', icon: Mountain },
  { id: TemplateId.BACKGROUND_CHANGE, label: 'Solid Color', icon: Palette },
];

const getDefaultParams = (id: TemplateId) => {
  const template = TEMPLATES.find(t => t.id === id);
  if (!template) return {};
  return template.params.reduce((acc, param) => {
    acc[param.id] = param.defaultValue;
    return acc;
  }, {} as Record<string, ParamValue>);
};

export default function App() {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    selectedTemplateId: INITIAL_TEMPLATE,
    paramValues: getDefaultParams(INITIAL_TEMPLATE),
    isProcessing: false,
    error: null,
    history: [],
    historyIndex: -1,
    library: [],
    viewMode: 'editor'
  });

  // Load library from local storage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('talu_library');
    if (savedLibrary) {
      try {
        setState(prev => ({ ...prev, library: JSON.parse(savedLibrary) }));
      } catch (e) {
        console.error("Failed to load library", e);
      }
    }
  }, []);

  // Save library to local storage whenever it changes
  useEffect(() => {
    if (state.library.length > 0) {
      localStorage.setItem('talu_library', JSON.stringify(state.library));
    }
  }, [state.library]);

  const handleTemplateSelect = (id: TemplateId) => {
    setState(prev => ({
      ...prev,
      selectedTemplateId: id,
      paramValues: getDefaultParams(id),
      error: null
    }));
  };

  const handleParamChange = (key: string, value: ParamValue) => {
    setState(prev => ({
      ...prev,
      paramValues: {
        ...prev.paramValues,
        [key]: value
      }
    }));
  };

  const handleImageSelect = (base64: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64,
      generatedImage: null,
      error: null,
      history: [base64],
      historyIndex: 0,
      viewMode: 'editor' // Switch to editor when uploading
    }));
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      originalImage: null,
      generatedImage: null,
      error: null,
      history: [],
      historyIndex: -1
    }));
  };

  const handleUndo = () => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        originalImage: prev.history[newIndex],
        generatedImage: null,
        error: null
      }));
    }
  };

  const handleRedo = () => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        originalImage: prev.history[newIndex],
        generatedImage: null,
        error: null
      }));
    }
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const resultBase64 = await editImageWithGemini(
        state.originalImage,
        state.selectedTemplateId,
        state.paramValues
      );

      setState(prev => ({
        ...prev,
        generatedImage: resultBase64,
        isProcessing: false
      }));
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof Error) errorMessage = err.message;
      if (err.message?.includes('API Key')) errorMessage = "API Key not found. Please verify your environment configuration.";
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isProcessing: false
      }));
    }
  };

  // "Keep Changes" - adds the generated image to history
  const handleApplyChanges = () => {
    if (!state.generatedImage) return;

    setState(prev => {
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), prev.generatedImage!];
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        originalImage: prev.generatedImage, // Update the working canvas
        generatedImage: null // Clear preview
      };
    });
  };

  const handleDiscardChanges = () => {
    setState(prev => ({
      ...prev,
      generatedImage: null
    }));
  };

  const handleDownload = () => {
    const imageToDownload = state.generatedImage || state.originalImage;
    if (imageToDownload) {
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `talu-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Library Functions
  const addToLibrary = (type: 'draft' | 'saved') => {
    const imageToSave = state.generatedImage || state.originalImage;
    if (!imageToSave) return;

    const newItem: LibraryItem = {
      id: Date.now().toString(),
      type,
      imageData: imageToSave,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      library: [newItem, ...prev.library],
      viewMode: 'library' // Redirect to library view
    }));
  };

  const deleteFromLibrary = (id: string) => {
    setState(prev => ({
      ...prev,
      library: prev.library.filter(item => item.id !== id)
    }));
  };

  const loadFromLibrary = (item: LibraryItem) => {
    setState(prev => ({
      ...prev,
      originalImage: item.imageData,
      generatedImage: null,
      history: [item.imageData],
      historyIndex: 0,
      viewMode: 'editor'
    }));
  };

  // derived state for UI
  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const libraryDrafts = state.library.filter(item => item.type === 'draft');
  const librarySaved = state.library.filter(item => item.type === 'saved');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-950 via-slate-950 to-black text-white flex flex-col md:flex-row overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Sidebar - Controls */}
      <aside className="w-full md:w-[420px] flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border-r border-pink-500/10 flex flex-col h-screen overflow-y-auto z-10 shadow-2xl">
        <div className="p-6 border-b border-pink-500/10 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
          <div className="flex items-center space-x-2 mb-1">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg shadow-pink-500/20">
              <Wand2 size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-200">
              Talu Image Lab
            </h1>
          </div>
          <p className="text-xs text-pink-300/70 pl-1">Professional AI Image Processing</p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Step 1: Template */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">1</span>
              <h2 className="text-sm font-semibold text-pink-200 uppercase tracking-wider">
                Select Template
              </h2>
            </div>
            <TemplateSelector 
              selectedId={state.selectedTemplateId} 
              onSelect={handleTemplateSelect}
              disabled={state.isProcessing || !!state.generatedImage || state.viewMode === 'library'}
            />
          </section>

          {/* Step 2: Parameters */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">2</span>
              <h2 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">
                Adjust Parameters
              </h2>
            </div>
            <ParameterControls 
              templateId={state.selectedTemplateId} 
              values={state.paramValues} 
              onChange={handleParamChange}
              disabled={state.isProcessing || !!state.generatedImage || state.viewMode === 'library'}
            />
          </section>

          {state.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 backdrop-blur-sm">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-200">{state.error}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-pink-500/10 bg-slate-900/50 backdrop-blur">
          {/* Generate Button */}
          {state.generatedImage ? (
            <div className="flex space-x-3">
               <button
                onClick={handleDiscardChanges}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all flex items-center justify-center space-x-2"
              >
                <X size={18} />
                <span>Discard</span>
              </button>
              <button
                onClick={handleApplyChanges}
                className="flex-[2] py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Check size={18} />
                <span>Apply & Continue</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!state.originalImage || state.isProcessing || state.viewMode === 'library'}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all relative overflow-hidden
                ${!state.originalImage || state.viewMode === 'library'
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                  : state.isProcessing
                    ? 'bg-purple-900/50 text-purple-200 cursor-wait border border-purple-500/20'
                    : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/25 border border-white/10 hover:shadow-pink-500/40 hover:-translate-y-0.5'
                }
              `}
            >
              {state.isProcessing ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Processing Magic...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>Generate Edit</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content - Canvas */}
      <main className="flex-1 bg-transparent relative overflow-hidden flex flex-col">
        {/* Background Ambient Light */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        {/* Toolbar */}
        <div className="h-16 border-b border-pink-500/10 flex items-center justify-between px-6 bg-slate-950/30 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2">
             {state.viewMode === 'editor' && state.originalImage && (
              <>
                 <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Clear All">
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-6 bg-pink-500/20 mx-2" />
                <button 
                  onClick={handleUndo} 
                  disabled={!canUndo}
                  className={`p-2 rounded-lg transition-colors ${canUndo ? 'text-pink-300 hover:text-white hover:bg-white/5' : 'text-slate-700 cursor-not-allowed'}`}
                  title="Undo"
                >
                  <Undo2 size={18} />
                </button>
                <button 
                  onClick={handleRedo} 
                  disabled={!canRedo}
                  className={`p-2 rounded-lg transition-colors ${canRedo ? 'text-pink-300 hover:text-white hover:bg-white/5' : 'text-slate-700 cursor-not-allowed'}`}
                  title="Redo"
                >
                  <Redo2 size={18} />
                </button>
              </>
             )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Library Toggle */}
            <button 
              onClick={() => setState(prev => ({ ...prev, viewMode: prev.viewMode === 'editor' ? 'library' : 'editor' }))}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                state.viewMode === 'library' 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Grid size={16} />
              <span>Library</span>
            </button>

            {/* Save / Download Actions */}
             {state.viewMode === 'editor' && (state.generatedImage || state.originalImage) && (
               <>
                 <button 
                  onClick={() => addToLibrary(state.generatedImage ? 'saved' : 'draft')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm font-medium text-pink-300 hover:text-white transition-all"
                  title="Save to Library"
                 >
                   <Save size={16} />
                   <span>{state.generatedImage ? 'Save Result' : 'Save Draft'}</span>
                 </button>
                 <button 
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-sm font-medium text-white transition-all shadow-sm"
                 >
                  <Download size={16} />
                  <span>Export</span>
                </button>
               </>
             )}
          </div>
        </div>

        {/* Main Viewport Area */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center min-h-0 relative z-10 scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
          
          {state.viewMode === 'library' ? (
            /* --- LIBRARY VIEW --- */
            <div className="w-full max-w-5xl h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Image Library</h2>
                    <p className="text-slate-400 text-sm">Manage your drafts and finished masterpieces</p>
                 </div>
                 <div className="flex space-x-2">
                   <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                      <span className="text-pink-400 font-bold">{librarySaved.length}</span> Saved
                   </div>
                   <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                      <span className="text-purple-400 font-bold">{libraryDrafts.length}</span> Drafts
                   </div>
                 </div>
              </div>

              {state.library.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <ImageIcon size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-1">Library is Empty</p>
                  <p className="text-sm">Save your edits or drafts to see them here.</p>
                  <button 
                    onClick={() => setState(prev => ({...prev, viewMode: 'editor'}))}
                    className="mt-6 text-pink-400 hover:text-pink-300 font-medium flex items-center space-x-1"
                  >
                    <span>Go to Editor</span> <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                  {/* Saved Section */}
                  {librarySaved.length > 0 && (
                     <div className="col-span-full mt-4">
                       <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Check size={16} /> Saved Images
                       </h3>
                     </div>
                  )}
                  {librarySaved.map((item) => (
                    <div key={item.id} className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all shadow-lg hover:shadow-pink-500/20">
                      <img src={item.imageData} alt="Saved" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                         <button 
                           onClick={() => loadFromLibrary(item)}
                           className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-bold text-white flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                         >
                           <Wand2 size={12} /> Load
                         </button>
                         <button 
                           onClick={() => deleteFromLibrary(item.id)}
                           className="p-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                  ))}

                  {/* Drafts Section */}
                  {libraryDrafts.length > 0 && (
                     <div className="col-span-full mt-8 pt-8 border-t border-white/5">
                       <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Clock size={16} /> Drafts
                       </h3>
                     </div>
                  )}
                  {libraryDrafts.map((item) => (
                    <div key={item.id} className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/20">
                      <img src={item.imageData} alt="Draft" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-slate-300 font-mono">
                         {new Date(item.timestamp).toLocaleDateString()}
                       </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                         <button 
                           onClick={() => loadFromLibrary(item)}
                           className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                         >
                           <Wand2 size={12} /> Continue
                         </button>
                         <button 
                           onClick={() => deleteFromLibrary(item.id)}
                           className="p-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* --- EDITOR VIEW (Existing Canvas) --- */
            !state.originalImage ? (
               <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500 flex flex-col gap-8">
                 {/* Scene Selectors Above Upload */}
                 <div className="w-full">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-semibold text-pink-200 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={16} className="text-pink-400" />
                        Quick Start: Choose a Scene
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {SCENE_TEMPLATES.map((scene) => (
                        <button
                          key={scene.id}
                          onClick={() => handleTemplateSelect(scene.id)}
                          className={`
                            flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300
                            ${state.selectedTemplateId === scene.id 
                              ? 'bg-pink-600/30 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30'
                            }
                          `}
                        >
                          <scene.icon 
                            size={24} 
                            className={`mb-2 transition-colors ${state.selectedTemplateId === scene.id ? 'text-pink-300' : 'text-slate-400'}`} 
                          />
                          <span className={`text-xs font-medium ${state.selectedTemplateId === scene.id ? 'text-white' : 'text-slate-400'}`}>
                            {scene.label}
                          </span>
                        </button>
                      ))}
                    </div>
                 </div>

                 <ImageUploader onImageSelect={handleImageSelect} />
               </div>
            ) : (
              <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 max-h-[85vh]">
                
                {/* Original / Working Canvas */}
                <div className={`
                  relative flex-1 max-w-[650px] w-full flex flex-col items-center transition-all duration-500
                  ${state.generatedImage ? 'opacity-60 scale-95 lg:scale-100 blur-[1px] hover:opacity-100 hover:blur-0' : 'opacity-100 scale-100'}
                `}>
                  <span className="mb-3 text-xs font-bold text-pink-300/80 uppercase tracking-widest bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-pink-500/20 shadow-lg">
                    {state.historyIndex > 0 ? `Step ${state.historyIndex}` : 'Original'}
                  </span>
                  <div className="relative w-full aspect-square bg-slate-900/50 rounded-2xl overflow-hidden shadow-2xl border border-pink-500/10 group">
                    <img src={state.originalImage} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Arrow Indicator */}
                {state.generatedImage && (
                  <div className="hidden lg:flex text-pink-400 animate-pulse drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                    <ArrowRight size={40} />
                  </div>
                )}

                {/* Generated Result */}
                {state.generatedImage ? (
                  <div className="relative flex-1 max-w-[650px] w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
                    <span className="mb-3 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 uppercase tracking-widest bg-purple-950/50 backdrop-blur px-4 py-1 rounded-full border border-pink-500/30 shadow-lg shadow-pink-500/20">
                      Preview
                    </span>
                    <div className="relative w-full aspect-square bg-slate-900/50 rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/50 shadow-pink-500/10">
                      <img src={state.generatedImage} alt="Generated" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-4 text-center text-sm text-pink-200/70 animate-bounce">
                      Click "Apply & Continue" to keep this edit.
                    </div>
                  </div>
                ) : state.isProcessing ? (
                  <div className="relative flex-1 max-w-[650px] w-full flex flex-col items-center">
                     <div className="w-full aspect-square bg-white/5 backdrop-blur-sm rounded-2xl border border-pink-500/20 flex items-center justify-center flex-col shadow-lg shadow-pink-500/5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 animate-pulse"></div>
                          <RefreshCw className="animate-spin text-pink-400 mb-6 relative z-10" size={56} />
                        </div>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 font-bold text-lg">Processing Image...</p>
                        <p className="text-slate-400 text-sm mt-2">Designing your masterpiece</p>
                     </div>
                  </div>
                ) : null}

              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}