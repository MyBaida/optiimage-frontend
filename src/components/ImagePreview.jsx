import { useEffect } from 'react';

export default function ImagePreview({ src, alt, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
          flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="relative z-[1] max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />

      {/* File name */}
      {alt && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1] text-white/70 text-sm bg-black/40 px-4 py-1.5 rounded-full">
          {alt}
        </p>
      )}
    </div>
  );
}
