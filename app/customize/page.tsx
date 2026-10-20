import React from 'react';
import StudioCustomizer from '@/components/studio/StudioCustomizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Customizer Studio — CanvasCraft BD',
  description: 'Visualize your custom artwork or photo uploads on a realistic living room wall above a standard 80″ sofa with museum floating frames in real-time.',
};

export default function CustomizePage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen py-4 sm:py-8">
      {/* Studio Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
              Live Customizer Studio
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Living Room Wall &amp; Canvas Simulator
            </h1>
          </div>
          <p className="text-xs text-stone-500 max-w-md">
            Drag your artwork across the wall, preview proportional 80″ couch spacing, test museum floating frames, and upload custom photos for multi-piece combo deals.
          </p>
        </div>
      </div>

      {/* Main Interactive Studio Customizer */}
      <StudioCustomizer />
    </div>
  );
}
