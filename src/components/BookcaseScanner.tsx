import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface BookcaseScannerProps {
  onCapture: (imageData: string) => void;
  isProcessing?: boolean;
}

export default function BookcaseScanner({ onCapture, isProcessing = false }: BookcaseScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      setCameraActive(true);
      setPreviewImage(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can upload or drag-and-drop a bookshelf photo below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !cameraActive) {
      setCameraError('Please activate the camera first, or choose a bookshelf photo.');
      return;
    }
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('Camera stream is still initializing. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewImage(dataUrl);
    stopCamera();
    onCapture(dataUrl);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setCameraError('Please provide a valid image file (JPG, PNG, WebP).');
      return;
    }
    setCameraError(null);
    stopCamera();

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewImage(result);
        onCapture(result);
      }
    };
    reader.onerror = () => {
      setCameraError('Failed to read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full bg-[#f4f3f0]/90 border border-[#6c7a89]/20 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top status & controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#6c7a89]/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cameraActive ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cameraActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-[#596371]">
            {cameraActive ? 'Live Camera Feed Ready' : previewImage ? 'Snapshot Loaded' : 'Spine Matrix Sensor Ready'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!cameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#505d6c] hover:bg-[#3d4957] text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              Open Camera
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e3e2e0] hover:bg-[#dbdad7] text-[#1a1c1a] rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Close Camera
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#476555] hover:bg-[#385244] text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            Select Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {cameraError && (
        <div className="flex items-center gap-2 text-xs text-[#ba1a1a] bg-[#ffdad6]/60 p-2.5 rounded-lg border border-[#ba1a1a]/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main viewport canvas */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative min-h-[300px] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 transition-all ${
          isDragging
            ? 'border-[#476555] bg-[#c6e8d3]/30 scale-[1.01]'
            : 'border-dashed border-[#6c7a89]/30 bg-white/70'
        }`}
      >
        {/* Case 1: Active Camera Feed */}
        {cameraActive && (
          <div className="relative w-full h-[320px] bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/40 m-4 rounded-lg flex flex-col justify-between p-3">
              <span className="font-mono text-[10px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded self-start">
                Align shelf spines inside frame
              </span>
              <span className="font-mono text-[10px] text-white/80 self-end bg-black/50 px-2 py-0.5 rounded">
                Tap 'Capture Bookshelf' below
              </span>
            </div>
          </div>
        )}

        {/* Case 2: Captured or Uploaded Preview */}
        {!cameraActive && previewImage && (
          <div className="relative w-full max-h-[360px] flex items-center justify-center bg-stone-900/10 p-2">
            <img
              src={previewImage}
              alt="Bookshelf capture preview"
              className="max-h-[340px] w-auto object-contain rounded-lg shadow-sm"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
                <span className="font-medium text-sm">VisionCore neural parser analyzing spines...</span>
                <span className="text-xs text-white/70">Identifying authors, titles, and ISBNs</span>
              </div>
            )}
          </div>
        )}

        {/* Case 3: Empty State Dropzone */}
        {!cameraActive && !previewImage && (
          <div className="p-8 text-center flex flex-col items-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#efeeeb] flex items-center justify-center mb-3 text-[#505d6c]">
              <ImageIcon className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h4 className="font-literata font-medium text-base text-[#1a1c1a] mb-1">
              Spine Detection Canvas
            </h4>
            <p className="font-plus-jakarta text-xs text-[#596371] mb-4 leading-relaxed">
              Drop a photo of your bookcase or single cover here, open the live camera, or click select photo to auto-extract titles.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-[#505d6c] text-white rounded-lg text-xs font-medium hover:bg-[#3d4957] transition cursor-pointer shadow-sm"
              >
                Start Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#476555] text-white rounded-lg text-xs font-medium hover:bg-[#385244] transition cursor-pointer shadow-sm"
              >
                Browse Photos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-[#596371]">
          {isProcessing ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Parsing bookcase spines with Gemini Vision AI...
            </span>
          ) : previewImage ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready for analysis
            </span>
          ) : (
            <span>Supports JPG, PNG, HEIC up to 50MB</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {cameraActive && (
            <button
              type="button"
              onClick={captureFrame}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-[#476555] hover:bg-[#364f42] text-white rounded-xl text-sm font-medium shadow-md transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              Capture Bookshelf
            </button>
          )}

          {previewImage && !cameraActive && (
            <button
              type="button"
              onClick={() => onCapture(previewImage)}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-[#505d6c] hover:bg-[#3d4957] text-white rounded-xl text-sm font-medium shadow-md transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Re-analyze Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
