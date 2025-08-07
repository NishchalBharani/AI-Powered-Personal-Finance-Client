import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/transactionSlice';

function TransactionFilter() {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dispatch = useDispatch();
  const { insights } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions({ category, startDate, endDate }));
  }, [category, startDate, endDate, dispatch]);

  const categories = [...new Set(insights.map((i) => i._id))];

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Filter Transactions</h2>
      <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </form>
    </div>
  );
}

export default TransactionFilter;