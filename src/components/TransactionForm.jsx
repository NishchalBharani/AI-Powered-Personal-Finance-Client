import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction } from '../store/transactionSlice';

function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.transactions);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTransaction({ amount: parseFloat(amount), category, description }));
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{Array.isArray(error) ? error.join(', ') : error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;