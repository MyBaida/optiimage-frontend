import { useEffect, useRef } from 'react';

export default function ProgressTracker({ steps }) {
  const listRef = useRef(null);

  // Auto-scroll to the latest step
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div className="mt-4 p-4 rounded-xl bg-light-blue/50 border border-opti-blue/10">
      <div ref={listRef} className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${
              step.status === 'pending' ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Icon */}
            {step.status === 'active' && (
              <svg className="w-4 h-4 text-opti-blue shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {step.status === 'complete' && (
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {step.status === 'pending' && (
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>
            )}

            {/* Label */}
            <span className={`${
              step.status === 'active' ? 'text-charcoal font-medium' :
              step.status === 'complete' ? 'text-gray-500' :
              'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
