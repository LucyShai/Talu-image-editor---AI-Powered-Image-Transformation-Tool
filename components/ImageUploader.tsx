import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) { // 8MB limit
        alert("Image too large. Please upload an image smaller than 8MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div className="w-full h-72 border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm">
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="p-5 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-pink-500/30">
        <Upload className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 group-hover:from-white group-hover:to-white transition-all">
        Upload Source Image
      </h3>
      <p className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">JPG, PNG, WEBP (Max 8MB)</p>
    </div>
  );
};