import React, { useEffect, useState } from 'react';
import { useTour, TOUR_STEPS } from '../context/TourContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';

export const InteractiveTourOverlay: React.FC = () => {
  const { isTourActive, currentStepIndex, currentStep, nextStep, prevStep, endTour, goToStep } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isTourActive) return;

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    const interval = setInterval(updatePosition, 200);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearInterval(interval);
    };
  }, [isTourActive, currentStep]);

  if (!isTourActive) return null;

  const totalSteps = TOUR_STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none transition-all duration-300">
      
      {/* SVG Mask Spotlight: Darkens everything while leaving the focused container crystal-clear */}
      {targetRect ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-auto" onClick={endTour}>
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={Math.max(0, targetRect.left - 8)}
                y={Math.max(0, targetRect.top - 8)}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.72)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>
      ) : (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] pointer-events-auto" onClick={endTour} />
      )}

      {/* Target Focus Border Ring & Animated Pointing Hand */}
      {targetRect && (
        <>
          {/* Highlight Glowing Ring */}
          <div
            className="fixed pointer-events-none z-50 rounded-2xl transition-all duration-300 ring-4 ring-red-500/80 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            style={{
              top: Math.max(0, targetRect.top - 8),
              left: Math.max(0, targetRect.left - 8),
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />

          {/* Floating Animated Hand Pointer */}
          <div
            className="fixed pointer-events-none transition-all duration-300 z-50 flex items-center justify-center"
            style={{
              top: Math.max(12, targetRect.top - 54),
              left: Math.max(12, targetRect.left + targetRect.width / 2 - 40),
            }}
          >
            <div className="animate-pointing-hand flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1 rounded-full shadow-xl border border-red-400 text-xs font-bold select-none">
              <span className="text-base">👆</span>
              <span className="tracking-wide">Focused Section</span>
            </div>
          </div>
        </>
      )}

      {/* Tour Dialog Explanation Card */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 max-w-md w-[calc(100vw-3rem)] pointer-events-auto animate-fadeIn font-sans">
        <div className="bg-white rounded-2xl border-2 border-red-500 shadow-2xl p-5 text-slate-800 relative">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider block">
                  Interactive Platform Tour ({currentStepIndex + 1}/{totalSteps})
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <button
              onClick={endTour}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badge & Description */}
          <div className="mt-3.5 space-y-2.5">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentStep.badge}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {currentStep.description}
            </p>

            {currentStep.tip && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start space-x-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Demo Tip:</strong> {currentStep.tip}</span>
              </div>
            )}
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-1.5 mt-4">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStepIndex === idx
                    ? 'w-7 bg-red-600'
                    : 'w-1.5 bg-slate-200 hover:bg-slate-400'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controls Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={endTour}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex items-center space-x-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={prevStep}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                onClick={nextStep}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors flex items-center space-x-1.5 hover:shadow-md"
              >
                <span>{isLastStep ? 'Finish Tour' : 'Next Step'}</span>
                {isLastStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
