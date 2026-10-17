import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  pubDate: string;
  coverImage: string;
  tags: string[];
}

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  deleteBook: (id: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', pubDate: '1965', coverImage: 'https://placehold.co/200x300', tags: ['Sci-Fi', 'Classic'] },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', pubDate: '2018', coverImage: 'https://placehold.co/200x300', tags: ['Self-Help'] },
  ]);

  const addBook = (book: Omit<Book, 'id'>) => {
    if (books.some(b => b.isbn === book.isbn)) return;
    setBooks(prev => [...prev, { ...book, id: Date.now().toString() }]);
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BookContext.Provider value={{ books, addBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBookContext must be used within a BookProvider');
  return context;
};
