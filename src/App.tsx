/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScanCatalog from './pages/ScanCatalog';
import MyLibrary from './pages/MyLibrary';
import ExportSync from './pages/ExportSync';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ScanCatalog />} />
          <Route path="library" element={<MyLibrary />} />
          <Route path="export" element={<ExportSync />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
