import { useState, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadZone from './components/UploadZone';
import OptionsPanel from './components/OptionsPanel';
import ResultSection from './components/ResultSection';
import ProgressTracker from './components/ProgressTracker';
import ImagePreview from './components/ImagePreview';
import { API_ENDPOINTS } from './config/api';

function App() {
  // Upload state
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // Options state
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState('original');
  const [qualityChanged, setQualityChanged] = useState(false);
  const [formatChanged, setFormatChanged] = useState(false);
  const [width, setWidth] = useState('');
  const [targetSize, setTargetSize] = useState('');
  const [targetUnit, setTargetUnit] = useState('KB');

  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [resultBlob, setResultBlob] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [progressSteps, setProgressSteps] = useState([]);
  const timersRef = useRef([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePreview = (file, heicUrl) => {
    setPreviewFile(file);
    setPreviewUrl(heicUrl || null);
  };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const startProgressSimulation = (fileCount) => {
    clearTimers();
    const totalBatches = Math.ceil(fileCount / 2);

    // Build the step list
    const steps = [
      { label: `Uploading ${fileCount} image${fileCount !== 1 ? 's' : ''}...`, status: 'active' },
    ];
    for (let i = 1; i <= totalBatches; i++) {
      steps.push({ label: `Compressing batch ${i}/${totalBatches}...`, status: 'pending' });
    }
    steps.push({ label: 'Creating ZIP archive...', status: 'pending' });

    setProgressSteps(steps);

    // Simulate upload completing
    const t0 = setTimeout(() => {
      setProgressSteps((prev) => prev.map((s, i) =>
        i === 0 ? { ...s, status: 'complete' } :
        i === 1 ? { ...s, status: 'active' } : s
      ));
    }, 600);
    timersRef.current.push(t0);

    // Simulate each batch completing
    for (let i = 0; i < totalBatches; i++) {
      const delay = 600 + (i + 1) * 1500;
      const t = setTimeout(() => {
        setProgressSteps((prev) => prev.map((s, j) => {
          if (j === i + 1) return { ...s, status: 'complete' };
          if (j === i + 2) return { ...s, status: 'active' };
          return s;
        }));
      }, delay);
      timersRef.current.push(t);
    }

    // Simulate ZIP step starting
    const zipStartDelay = 600 + totalBatches * 1500;
    const tZip = setTimeout(() => {
      setProgressSteps((prev) => prev.map((s, i) =>
        i === prev.length - 1 ? { ...s, status: 'active' } : s
      ));
    }, zipStartDelay);
    timersRef.current.push(tZip);
  };

  const completeProgress = () => {
    clearTimers();
    setProgressSteps((prev) => prev.map((s) =>
      s.status !== 'complete' ? { ...s, status: 'complete' } : s
    ));
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      setUploadError('Please select at least one image to compress.');
      return;
    }

    setIsLoading(true);
    setApiError('');
    setResultBlob(null);
    setOriginalSize(totalOriginalSize);
    startProgressSimulation(files.length);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      // Only send quality/format if user explicitly changed them — let backend use its defaults otherwise
      if (qualityChanged) formData.append('quality', String(quality));
      if (formatChanged) formData.append('format', format);

      if (width) formData.append('width', width);
      if (targetSize) {
        // Convert to KB since the server expects KB
        const sizeInKB = targetUnit === 'MB' ? Number(targetSize) * 1024 : Number(targetSize);
        formData.append('targetSize', String(Math.round(sizeInKB)));
      }

      const response = await fetch(API_ENDPOINTS.COMPRESS, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `Server error (${response.status})`);
      }

      const blob = await response.blob();
      completeProgress();
      setResultBlob(blob);
    } catch (err) {
      clearTimers();
      setProgressSteps([]);
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setOriginalSize(0);
    setApiError('');
    setUploadError('');
    setQuality(70);
    setFormat('original');
    setQualityChanged(false);
    setFormatChanged(false);
    setWidth('');
    setTargetSize('');
    setTargetUnit('KB');
    setProgressSteps([]);
    clearTimers();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full px-6 md:px-10 pb-12 pt-20">
        <div className="max-w-2xl mx-auto">

          {/* Hero */}
          <div className="text-center pt-8 pb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">
              Compress &amp; Optimize Images
            </h1>
            <p className="mt-3 text-gray-500 text-base md:text-lg max-w-lg mx-auto">
              Compress images, convert between formats, resize, and hit target file sizes. Supports JPG, PNG, WebP, and HEIC.
            </p>
          </div>

          {/* Upload + Options + Compress button — hidden during compression */}
          {!isLoading && !resultBlob && (
            <>
              <UploadZone
                files={files}
                setFiles={setFiles}
                error={uploadError}
                setError={setUploadError}
                onPreview={handlePreview}
              />

              {/* Feature strip — visible before files are uploaded */}
              {files.length === 0 && (
                <p className="mt-4 text-center text-xs text-gray-400">
                  JPG, PNG, WebP, HEIC &middot; Convert formats &middot; Resize &middot; Target file size &middot; Batch processing
                </p>
              )}

              {files.length > 0 && (
                <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-5">
                    Compression Settings
                  </h2>
                  <OptionsPanel
                    quality={quality}
                    setQuality={(v) => { setQuality(v); setQualityChanged(true); }}
                    format={format}
                    setFormat={(v) => { setFormat(v); setFormatChanged(true); }}
                    width={width}
                    setWidth={setWidth}
                    targetSize={targetSize}
                    setTargetSize={setTargetSize}
                    targetUnit={targetUnit}
                    setTargetUnit={setTargetUnit}
                  />
                </div>
              )}

              {files.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleCompress}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                      flex items-center justify-center gap-2
                      bg-opti-blue text-white hover:bg-dark-blue active:scale-[0.99]
                      transition-all duration-200 shadow-lg shadow-opti-blue/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Compress {files.length} Image{files.length !== 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Progress tracker — shown during compression */}
          {isLoading && (
            <div className="mt-8">
              <ProgressTracker steps={progressSteps} />
              <p className="mt-3 text-center text-xs text-gray-400">
                First request may take a moment if the server is waking up from sleep.
              </p>
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium">Compression failed</p>
                <p className="mt-0.5 text-red-500">{apiError}</p>
              </div>
            </div>
          )}

          {/* Results */}
          <ResultSection
            resultBlob={resultBlob}
            originalSize={originalSize}
            onReset={handleReset}
          />

        </div>
      </main>

      {/* Image preview lightbox */}
      {previewFile && (
        <ImagePreview
          src={previewUrl || URL.createObjectURL(previewFile)}
          alt={previewFile.name}
          onClose={() => { setPreviewFile(null); setPreviewUrl(null); }}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
