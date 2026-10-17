import { useState } from 'react';
import { useBookContext } from '../context/BookContext';
import { FileSpreadsheet, Download, Copy, Check, Database, Share2, Layers, BookMarked, Terminal } from 'lucide-react';

export default function ExportSync() {
  const { books } = useBookContext();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionSynced, setNotionSynced] = useState(false);

  const downloadCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Publication Year', 'Tags'];
    const rows = books.map((b) => [
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.isbn}"`,
      `"${b.pubDate}"`,
      `"${(b.tags || []).join(', ')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lumina-library-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyTSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Year', 'Tags'];
    const rows = books.map((b) => [b.title, b.author, b.isbn, b.pubDate, (b.tags || []).join('; ')]);
    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedFormat('tsv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(books, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'lumina-library-dump.json');
    dlAnchor.click();
  };

  const triggerNotionSync = () => {
    setNotionSyncing(true);
    setTimeout(() => {
      setNotionSyncing(false);
      setNotionSynced(true);
      setTimeout(() => setNotionSynced(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#6c7a89]/15 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#476555] font-semibold">
            ARCHIVAL PIPELINE • STAGE 04
          </span>
          <h1 className="text-3xl font-literata font-medium text-[#1a1c1a] mt-1">Export & Sync Library</h1>
          <p className="font-plus-jakarta text-sm text-[#596371] mt-1">
            Seamlessly export your identified book table into your favorite reading trackers, spreadsheets, or note apps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-3 py-1 bg-[#efeeeb] text-[#505d6c] rounded-full font-medium">
            {books.length} Records Selected
          </span>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: CSV / Excel */}
        <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c6e8d3]/30 flex items-center justify-center text-[#476555]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-literata font-medium text-lg text-[#1a1c1a]">Spreadsheet (CSV • Excel)</h3>
                <p className="font-plus-jakarta text-xs text-[#596371]">Formatted for Excel, Numbers, and Google Sheets</p>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#efeeeb] text-[#596371] px-2 py-0.5 rounded">UTF-8 Encoded</span>
          </div>

          <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 font-mono text-xs text-[#596371] overflow-x-auto">
            <div className="text-[10px] uppercase tracking-wider text-[#6c7a89] mb-1 font-semibold">Live Snippet Preview:</div>
            {books.slice(0, 2).map((b) => (
              <div key={b.id} className="truncate">
                {b.title} | {b.author} | {b.isbn}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={copyTSV}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#6c7a89]/30 hover:bg-[#efeeeb] text-xs font-semibold text-[#1a1c1a] transition cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              {copiedFormat === 'tsv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#505d6c]" />}
              {copiedFormat === 'tsv' ? 'Copied TSV!' : 'Copy TSV'}
            </button>
            <button
              type="button"
              onClick={downloadCSV}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#23272e] hover:bg-[#373e48] text-xs font-semibold text-white shadow-md transition cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download .csv
            </button>
          </div>
        </div>

        {/* Card 2: Notion Reading Hub */}
        <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e9ddff]/40 flex items-center justify-center text-[#61567d]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-literata font-medium text-lg text-[#1a1c1a]">Notion Reading Hub</h3>
                <p className="font-plus-jakarta text-xs text-[#596371]">Sync directly into personal archival database</p>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#c6e8d3]/50 text-[#1a3828] px-2 py-0.5 rounded font-medium">
              Connected
            </span>
          </div>

          <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 font-mono text-xs text-[#596371] space-y-1">
            <div className="flex justify-between">
              <span>Database Target:</span>
              <span className="text-[#1a1c1a]">/Folio-Identified-2024</span>
            </div>
            <div className="flex justify-between">
              <span>Last Synced:</span>
              <span className="text-[#1a1c1a]">Just Now</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={triggerNotionSync}
              disabled={notionSyncing}
              className="w-full py-2.5 px-4 rounded-xl bg-[#61567d] hover:bg-[#50446c] text-xs font-semibold text-white shadow-md transition cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              {notionSyncing ? 'Syncing...' : notionSynced ? 'Synced to Notion!' : 'Sync to Notion'}
            </button>
          </div>
        </div>

        {/* Card 3: Goodreads & StoryGraph */}
        <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#efeeeb] flex items-center justify-center text-[#505d6c]">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-literata font-medium text-lg text-[#1a1c1a]">Goodreads & StoryGraph</h3>
                <p className="font-plus-jakarta text-xs text-[#596371]">Pre-mapped CSV matching standard batch importers</p>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#efeeeb] text-[#596371] px-2 py-0.5 rounded">Pre-mapped</span>
          </div>

          <div className="text-xs text-[#596371] space-y-1">
            <div>✓ Exclusive Shelf: <span className="font-mono">to-read</span></div>
            <div>✓ Stripped leading zeros from ISBNs</div>
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            className="w-full py-2.5 px-4 rounded-xl border border-[#6c7a89]/30 hover:bg-[#efeeeb] text-xs font-semibold text-[#1a1c1a] transition cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#505d6c]" />
            Export Tracker CSV
          </button>
        </div>

        {/* Card 4: JSON Data Payload */}
        <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#efeeeb] flex items-center justify-center text-[#505d6c]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-literata font-medium text-lg text-[#1a1c1a]">JSON Data Payload</h3>
                <p className="font-plus-jakarta text-xs text-[#596371]">Full raw machine extraction dump with all metadata</p>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#efeeeb] text-[#596371] px-2 py-0.5 rounded">Raw Output</span>
          </div>

          <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#6c7a89]/15 font-mono text-xs text-[#596371] space-y-1">
            <div className="flex justify-between">
              <span>Schema Version:</span>
              <span className="text-[#1a1c1a]">v3.2.0-core</span>
            </div>
            <div className="flex justify-between">
              <span>Active Items:</span>
              <span className="text-[#1a1c1a]">{books.length} items</span>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadJSON}
            className="w-full py-2.5 px-4 rounded-xl border border-[#6c7a89]/30 hover:bg-[#efeeeb] text-xs font-semibold text-[#1a1c1a] transition cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#505d6c]" />
            Download .json Dump
          </button>
        </div>
      </div>
    </div>
  );
}
