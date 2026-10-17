import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export default async function scanBarcode() {
  // Check permission
  const status = await BarcodeScanner.checkPermission({ force: true });
  if (status.granted) {
    BarcodeScanner.hideBackground();
    document.body.classList.add('qrscanner-active');
    
    const result = await BarcodeScanner.startScan();
    
    document.body.classList.remove('qrscanner-active');
    BarcodeScanner.showBackground();
    
    if (result.hasContent) {
      return result.content;
    }
  }
  return null;
}
