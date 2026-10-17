import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookDetailsModal from '../components/BookDetailsModal';
import { useBookContext } from '../context/BookContext';
import LibraryDashboard from '../components/LibraryDashboard';
import { Camera, FileSpreadsheet, Search, BookOpen, Layers, CheckCircle } from 'lucide-react';

export default function MyLibrary() {
  const navigate = useNavigate();
  const { books } = useBookContext();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(books.flatMap((b) => b.tags || [])));

  const filteredBooks = books.filter(
    (book) =>
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)) &&
      (!selectedTag || book.tags?.includes(selectedTag))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header with title, stats, and action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#6c7a89]/15 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#476555] font-semibold">
            ARCHIVAL INDEX • LIVING STACKS
          </span>
          <h1 className="text-3xl font-literata font-medium text-[#1a1c1a] mt-1">My Library</h1>
          <p className="font-plus-jakarta text-sm text-[#596371] mt-1">
            Curated catalog compiled automatically via computer vision spine detection and shelf photo parsing.
          </p>
        </div>

        {/* Prototype Navigation Buttons strictly matching spec */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="quickScanBtn"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#23272e] hover:bg-[#373e48] text-white text-xs font-semibold shadow-md transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Quick Scan
          </button>
          <button
            id="exportBatchBtn"
            onClick={() => navigate('/export')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6c7a89]/30 hover:bg-[#efeeeb] text-[#1a1c1a] text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#505d6c]" />
            Export Batch
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <LibraryDashboard />

      {/* Search and Tag Filtering Controls */}
      <div className="bg-white/70 border border-[#6c7a89]/20 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#596371]" />
          <input
            type="text"
            placeholder="Search by book title, author, genre, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#6c7a89]/20 rounded-xl font-plus-jakarta text-sm focus:outline-none focus:border-[#505d6c] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#596371] mr-1">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              !selectedTag ? 'bg-[#505d6c] text-white shadow-xs' : 'bg-[#efeeeb] text-[#596371] hover:bg-[#e3e2e0]'
            }`}
          >
            All Books ({books.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#505d6c] text-white shadow-xs'
                  : 'bg-[#efeeeb] text-[#596371] hover:bg-[#e3e2e0]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Books List / Table */}
        <div className="pt-2">
          {filteredBooks.length === 0 ? (
            <div className="py-12 text-center text-[#596371]">
              <BookOpen className="w-10 h-10 mx-auto text-[#6c7a89]/40 mb-2" />
              <p className="font-plus-jakarta text-sm">No books found matching your query.</p>
              <p className="font-plus-jakarta text-xs opacity-75 mt-1">
                Try searching a different keyword or scan a bookshelf to add more books.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#6c7a89]/10">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="py-3.5 px-3 rounded-xl hover:bg-[#faf9f6] transition cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'}
                      alt={book.title}
                      className="w-11 h-15 object-cover rounded shadow-xs shrink-0 border border-[#6c7a89]/20"
                    />
                    <div className="min-w-0">
                      <h3 className="font-literata font-medium text-base text-[#1a1c1a] group-hover:text-[#505d6c] transition truncate">
                        {book.title}
                      </h3>
                      <p className="font-plus-jakarta text-xs text-[#596371]">
                        {book.author} • <span className="font-mono">{book.isbn}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {book.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] bg-[#c6e8d3]/30 text-[#2f4d3e] px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#476555] bg-[#c6e8d3]/40 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                    <span className="text-xs text-[#596371] font-mono">
                      {book.pubDate || '1965'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
