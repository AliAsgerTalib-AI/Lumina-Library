import { useState } from 'react';
import BookcaseScanner from '../components/BookcaseScanner';
import { useBookContext } from '../context/BookContext';

export default function ScanCatalog() {
  const { addBook } = useBookContext();
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = async (image: string) => {
    setIsScanning(false);
    const response = await fetch('/api/analyze-bookcase', {
      method: 'POST',
      body: JSON.stringify({ image }),
      headers: { 'Content-Type': 'application/json' }
    });
    const scannedBooks = await response.json();
    scannedBooks.forEach((book: any) => {
      addBook({ ...book, pubDate: book.pubDate || 'Unknown', coverImage: 'https://placehold.co/200x300', tags: book.tags || ['Auto-scanned'] });
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-literata font-medium mb-6">Scan Bookcase</h1>
      {!isScanning ? (
        <button onClick={() => setIsScanning(true)} className="px-4 py-2 bg-primary text-white rounded-md">Start Bookcase Scan</button>
      ) : (
        <BookcaseScanner onCapture={handleCapture} />
      )}
    </div>
  );
}
