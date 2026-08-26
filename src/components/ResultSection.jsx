function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResultSection({ resultBlob, originalSize, onReset }) {
  if (!resultBlob) return null;

  const handleDownload = () => {
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const savings = originalSize > 0
    ? Math.round((1 - resultBlob.size / originalSize) * 100)
    : 0;

  return (
    <div className="w-full mt-8 p-6 md:p-8 rounded-2xl bg-light-blue border border-opti-blue/10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-charcoal">Compression Complete</h3>
          <p className="text-sm text-gray-500">Your optimized images are ready</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Original</p>
          <p className="text-lg font-semibold text-charcoal">{formatSize(originalSize)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Compressed</p>
          <p className="text-lg font-semibold text-opti-blue">{formatSize(resultBlob.size)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Saved</p>
          <p className="text-lg font-semibold text-green-600">
            {savings > 0 ? `${savings}%` : '—'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl
            bg-opti-blue text-white font-semibold text-sm
            hover:bg-dark-blue active:scale-[0.98]
            transition-all duration-150 shadow-md shadow-opti-blue/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download ZIP
        </button>
        <button
          onClick={onReset}
          className="flex-1 sm:flex-none py-3 px-6 rounded-xl
            border border-gray-200 text-charcoal font-medium text-sm
            hover:bg-gray-50 active:scale-[0.98]
            transition-all duration-150"
        >
          Compress More
        </button>
      </div>
    </div>
  );
}
