import { useState } from 'react';
import { Sliders, Check, RefreshCw, Cpu, Layers, Palette, Video } from 'lucide-react';

export default function Settings() {
  const [sensitivity, setSensitivity] = useState(88);
  const [openLibraryEnabled, setOpenLibraryEnabled] = useState(true);
  const [googleBooksEnabled, setGoogleBooksEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#6c7a89]/15 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#476555] font-semibold">
            CONFIGURATION MATRIX / V3.2 VISIONCORE
          </span>
          <h1 className="text-3xl font-literata font-medium text-[#1a1c1a] mt-1">Application & Scanner Settings</h1>
          <p className="font-plus-jakarta text-sm text-[#596371] mt-1">
            Tune optical recognition thresholds, bibliographic enrichment pipelines, and archival aesthetics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#23272e] hover:bg-[#373e48] text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Sliders className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Setting Section 1: Scanner & Recognition AI */}
      <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#6c7a89]/15 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#505d6c]" />
            <h2 className="font-literata font-medium text-lg text-[#1a1c1a]">Scanner & Recognition AI</h2>
          </div>
          <span className="font-mono text-[10px] bg-[#c6e8d3]/40 text-[#2f4d3e] px-2.5 py-0.5 rounded-full font-medium">
            Active: V3.2 Core
          </span>
        </div>

        {/* Sensitivity slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[#1a1c1a]">Detection Sensitivity</span>
            <span className="font-mono font-semibold text-[#505d6c]">{sensitivity}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full h-1.5 bg-[#efeeeb] rounded-lg appearance-none cursor-pointer accent-[#505d6c]"
          />
          <div className="flex justify-between text-[10px] text-[#596371] font-mono">
            <span>Standard (Broad Match)</span>
            <span>Balanced Stack</span>
            <span>High Precision (Fine Spines)</span>
          </div>
        </div>

        {/* Enrichment toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#1a1c1a]">OpenLibrary Direct Lookup</span>
              <input
                type="checkbox"
                checked={openLibraryEnabled}
                onChange={(e) => setOpenLibraryEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#476555] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-[#596371]">
              Retrieve publisher editions, original release dates, and verified Dewey decimal classifications.
            </p>
          </div>

          <div className="p-4 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#1a1c1a]">Google Books Enrichment</span>
              <input
                type="checkbox"
                checked={googleBooksEnabled}
                onChange={(e) => setGoogleBooksEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#476555] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-[#596371]">
              Secondary failover for ISBN auto-resolution, high-res cover artwork, and synopsis syncing.
            </p>
          </div>
        </div>
      </div>

      {/* Setting Section 2: Visual Theme */}
      <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#6c7a89]/15 pb-3">
          <Palette className="w-5 h-5 text-[#505d6c]" />
          <h2 className="font-literata font-medium text-lg text-[#1a1c1a]">Visual Atmosphere</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#faf9f6] rounded-xl border-2 border-[#476555] flex flex-col justify-between">
            <div>
              <div className="flex gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#476555]"></span>
                <span className="w-5 h-5 rounded-full bg-[#c6e8d3]"></span>
                <span className="w-5 h-5 rounded-full bg-[#faf9f6] border border-gray-200"></span>
              </div>
              <h4 className="font-medium text-xs text-[#1a1c1a]">Sage Garden</h4>
              <p className="text-[10px] text-[#596371]">Tranquil botanic tint</p>
            </div>
            <span className="font-mono text-[10px] text-[#476555] mt-2 font-bold">Selected</span>
          </div>

          <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 opacity-70">
            <div className="flex gap-1.5 mb-2">
              <span className="w-5 h-5 rounded-full bg-[#61567d]"></span>
              <span className="w-5 h-5 rounded-full bg-[#e9ddff]"></span>
              <span className="w-5 h-5 rounded-full bg-[#faf9f6] border border-gray-200"></span>
            </div>
            <h4 className="font-medium text-xs text-[#1a1c1a]">Lavender Mist</h4>
            <p className="text-[10px] text-[#596371]">Soft twilight study</p>
          </div>

          <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 opacity-70">
            <div className="flex gap-1.5 mb-2">
              <span className="w-5 h-5 rounded-full bg-[#505d6c]"></span>
              <span className="w-5 h-5 rounded-full bg-[#f4f3f0]"></span>
              <span className="w-5 h-5 rounded-full bg-[#faf9f6] border border-gray-200"></span>
            </div>
            <h4 className="font-medium text-xs text-[#1a1c1a]">Warm Cream & Butter</h4>
            <p className="text-[10px] text-[#596371]">Antiquarian paper</p>
          </div>
        </div>
      </div>
    </div>
  );
}
