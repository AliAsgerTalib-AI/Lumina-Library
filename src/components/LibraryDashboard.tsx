import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useBookContext } from '../context/BookContext';

const COLORS = ['#505d6c', '#476555', '#61567d', '#D97D64'];

export default function LibraryDashboard() {
  const { books } = useBookContext();

  const genreData = books.reduce((acc: any[], book) => {
    book.tags.forEach(tag => {
      const existing = acc.find(item => item.name === tag);
      if (existing) existing.value += 1;
      else acc.push({ name: tag, value: 1 });
    });
    return acc;
  }, []);

  const growthData = [
    { name: 'Last Month', count: Math.max(0, books.length - 5) },
    { name: 'This Month', count: books.length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white/50 p-4 rounded-xl border">
        <h3 className="font-literata text-lg mb-4">Genre Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={genreData} dataKey="value" nameKey="name" outerRadius={80}>
              {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white/50 p-4 rounded-xl border">
        <h3 className="font-literata text-lg mb-4">Collection Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={growthData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#505d6c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
