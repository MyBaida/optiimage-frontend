import { useState, useRef, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ files, setFiles, error, setError, onPreview }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndAdd = useCallback((newFiles) => {
    setError('');
    const valid = [];
    const fileArr = Array.from(newFiles);

    for (const file of fileArr) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isHeicExt = ext === 'heic' || ext === 'heif';

      if (!ACCEPTED_TYPES.includes(file.type) && !isHeicExt) {
        setError(`"${file.name}" is not a supported format. Use JPG, PNG, WebP, or HEIC.`);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" exceeds the 10MB limit.`);
        return;
      }
      valid.push(file);
    }

    setFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  }, [setFiles, setError]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      validateAndAdd(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files.length) {
      validateAndAdd(e.target.files);
    }
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setError('');
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-200 ease-in-out
          flex flex-col items-center justify-center py-14 px-6
          ${isDragging
            ? 'border-opti-blue bg-light-blue scale-[1.01]'
            : 'border-gray-300 bg-white hover:border-opti-blue hover:bg-light-blue/40'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        <svg
          className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-opti-blue' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="text-charcoal font-semibold text-base mb-1">
          {isDragging ? 'Drop your images here' : 'Drag & drop images here'}
        </p>
        <p className="text-gray-400 text-sm">
          or <span className="text-opti-blue font-medium">click to browse</span>
        </p>
        <p className="text-gray-400 text-xs mt-3">
          JPG, PNG, WebP, HEIC &middot; Max 10 files &middot; 10MB each
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-charcoal">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={clearAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative rounded-xl bg-light-blue overflow-hidden"
              >
                {/* Clickable image area for preview */}
                <div
                  className="aspect-square flex items-center justify-center p-2 cursor-zoom-in"
                  onClick={() => onPreview && onPreview(file)}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="px-2 pb-2">
                  <p className="text-xs text-charcoal font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 hover:bg-red-500 hover:text-white
                    rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100
                    transition-all text-gray-500 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
