import { useState } from 'react';

const FORMATS = [
  { value: 'original', label: 'Original' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
];

export default function OptionsPanel({ quality, setQuality, format, setFormat, width, setWidth, targetSize, setTargetSize, targetUnit, setTargetUnit }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full">
      {/* Primary options — always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality slider */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Quality
            <span className="ml-2 text-opti-blue font-semibold">{quality}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-opti-blue
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-opti-blue
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>

        {/* Format selector */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`
                  py-2.5 px-3 sm:flex-1 sm:px-4 rounded-xl text-sm font-medium transition-all duration-150
                  ${format === f.value
                    ? 'bg-opti-blue text-white shadow-md shadow-opti-blue/20'
                    : 'bg-light-blue text-charcoal hover:bg-opti-blue/10'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced options toggle */}
      <div className="mt-5">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-opti-blue transition-colors group"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium">Advanced options</span>
        </button>

        {/* Collapsible advanced section */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showAdvanced ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Width input */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Resize Width
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 1200"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200
                    text-sm text-charcoal placeholder-gray-400
                    focus:outline-none focus:border-opti-blue focus:ring-2 focus:ring-opti-blue/10
                    transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">px</span>
              </div>
            </div>

            {/* Target size input */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Target File Size
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder={targetUnit === 'KB' ? 'e.g. 500' : 'e.g. 2'}
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  className="flex-1 min-w-0 pl-4 pr-4 py-2.5 rounded-xl border border-gray-200
                    text-sm text-charcoal placeholder-gray-400
                    focus:outline-none focus:border-opti-blue focus:ring-2 focus:ring-opti-blue/10
                    transition-all"
                />
                <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0">
                  {['KB', 'MB'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setTargetUnit(unit)}
                      className={`px-2.5 sm:px-3 py-2.5 text-xs font-semibold transition-colors ${
                        targetUnit === unit
                          ? 'bg-opti-blue text-white'
                          : 'bg-white text-gray-400 hover:text-charcoal'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
