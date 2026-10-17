interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  pubDate: string;
  coverImage: string;
}

interface Props {
  book: Book;
  onClose: () => void;
}

export default function BookDetailsModal({ book, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1c1a]/20 backdrop-blur-sm z-50">
      <div className="bg-[#faf9f6]/95 border border-[#6c7a89]/12 p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <button onClick={onClose} className="text-[#596371] mb-4">Close</button>
        <div className="flex gap-6">
          <img src={book.coverImage} alt={book.title} className="w-32 h-48 object-cover rounded-md" />
          <div>
            <h2 className="font-literata text-2xl font-medium text-[#1a1c1a]">{book.title}</h2>
            <p className="font-plus-jakarta text-lg text-[#596371] mb-4">{book.author}</p>
            <p className="font-mono text-sm text-[#596371]">ISBN: {book.isbn}</p>
            <p className="font-mono text-sm text-[#596371]">Published: {book.pubDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
