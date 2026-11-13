// frontend/src/components/ImageUploader.jsx
import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function ImageUploader({ onFileSelect, selectedFile, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setError('Unsupported file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 10MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {previewUrl || selectedFile ? (
        <div className="relative rounded-2xl border-2 border-emerald-500/50 bg-stone-900 overflow-hidden shadow-md group">
          <img
            src={previewUrl || (selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile)}
            alt="Crop sample preview"
            className="w-full h-72 object-contain bg-stone-950"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40 pointer-events-none"></div>

          {/* Badge & Info Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Image Attached for Gemini 2.5 Vision</span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 text-stone-200 hover:text-white hover:bg-rose-600 transition backdrop-blur-sm"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
            <span className="truncate max-w-[200px] font-mono">
              {selectedFile?.name || 'Selected Crop Sample'}
            </span>
            <span>
              {selectedFile?.size ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''}
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
              : 'border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/20 bg-stone-50/50'
          }`}
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="font-bold text-stone-800 text-base">
            Upload Crop Leaf or Soil Photo
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Drag & drop high-resolution photo showing leaf lesion, discoloration, or pest damage.
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-white border border-stone-200 shadow-2xs hover:bg-stone-50 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Browse File
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" /> Camera Capture
            </button>
          </div>

          <p className="text-[11px] text-stone-400 mt-3">
            Supported formats: JPEG, PNG, WebP (Max 10MB)
          </p>
        </div>
      )}

      {error && (
        <div className="mt-2.5 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

