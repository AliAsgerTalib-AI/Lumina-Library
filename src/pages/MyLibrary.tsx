import { useState } from 'react';
import BookDetailsModal from '../components/BookDetailsModal';
import { useBookContext } from '../context/BookContext';
import LibraryDashboard from '../components/LibraryDashboard';

export default function MyLibrary() {
  const { books } = useBookContext();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(books.flatMap(b => b.tags)));

  const filteredBooks = books.filter(book => 
    (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)) &&
    (!selectedTag || book.tags.includes(selectedTag))
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-literata font-medium mb-6">My Library</h1>
      <LibraryDashboard />
      <input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-4 bg-white/60 border border-[#6c7a89]/20 rounded-md focus:bg-white focus:border-[#6c7a89] transition-all"
      />
      <div className="flex gap-2 mb-6">
        <button onClick={() => setSelectedTag(null)} className={`px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-[#505d6c] text-white' : 'bg-white/50'}`}>All</button>
        {allTags.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-[#505d6c] text-white' : 'bg-white/50'}`}>{tag}</button>
        ))}
      </div>
      <ul className="space-y-4">
        {filteredBooks.map(book => (
          <li key={book.id} onClick={() => setSelectedBook(book)} className="p-4 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors border border-[#6c7a89]/10">
            <span className="font-literata text-xl">{book.title}</span> - <span className="font-plus-jakarta text-gray-600">{book.author}</span>
            <div className="flex gap-2 mt-2">
                {book.tags.map(tag => <span key={tag} className="text-xs bg-gray-200 px-2 py-0.5 rounded">{tag}</span>)}
            </div>
          </li>
        ))}
      </ul>
      {selectedBook && <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
