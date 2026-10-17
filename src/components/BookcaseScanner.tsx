import { useRef, useState } from 'react';

export default function BookcaseScanner({ onCapture }: { onCapture: (image: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    setStream(s);
    if (videoRef.current) videoRef.current.srcObject = s;
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      onCapture(canvas.toDataURL('image/jpeg').split(',')[1]);
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm rounded-lg border" />
      <div className="flex gap-2">
        <button onClick={startCamera} className="px-4 py-2 bg-primary text-white rounded-md">Start Camera</button>
        <button onClick={capture} className="px-4 py-2 bg-primary text-white rounded-md">Capture Bookshelf</button>
      </div>
    </div>
  );
}
