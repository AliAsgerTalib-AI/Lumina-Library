import { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import { useBookContext } from '../context/BookContext';

export default function ScanCatalog() {
  const { addBook } = useBookContext();
  const [isbn, setIsbn] = useState('');
  const [formData, setFormData] = useState({ title: '', author: '' });
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    setIsbn(decodedText);
    setIsScanning(false);
    const newBook = { 
      title: 'Scanned Book', 
      author: 'Unknown', 
      isbn: decodedText, 
      pubDate: '2026', 
      coverImage: 'https://placehold.co/200x300', 
      tags: ['New Scan'] 
    };
    setFormData({ title: newBook.title, author: newBook.author });
    addBook(newBook);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-literata font-medium mb-6">Scan and Catalog</h1>
      
      {!isScanning ? (
        <button onClick={() => setIsScanning(true)} className="px-4 py-2 bg-primary text-white rounded-md mb-6">
          Start Barcode Scanner
        </button>
      ) : (
        <BarcodeScanner onScanSuccess={handleScanSuccess} />
      )}

      <div className="space-y-4 mt-6">
        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" className="w-full p-3 border rounded-md" />
        <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Title" className="w-full p-3 border rounded-md" />
        <input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Author" className="w-full p-3 border rounded-md" />
      </div>
    </div>
  );
}
