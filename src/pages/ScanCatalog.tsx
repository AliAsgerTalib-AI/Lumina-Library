import { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';

export default function ScanCatalog() {
  const [isbn, setIsbn] = useState('');
  const [formData, setFormData] = useState({ title: '', author: '' });
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    setIsbn(decodedText);
    setIsScanning(false);
    // Mock metadata lookup
    setFormData({ title: 'Scanned Book Title', author: 'Author Name' });
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
