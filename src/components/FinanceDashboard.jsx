import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchInsights, deleteTransaction } from '../store/transactionSlice';
import TransactionForm from './TransactionForm';
import TransactionFilter from './TransactionFilter';
import SpendingChart from './SpendingChart';

const FinanceDashboard = () => {
  const dispatch = useDispatch();

  const {
    items: transactions = [],
    insights = [],
    recommendations = [],
    loading,
    error
  } = useSelector((state) => state.transactions || {});

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchInsights());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Transactions Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Transactions</h2>
        <TransactionForm />
        <TransactionFilter />
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-y-auto max-h-[400px] pr-2">
            <ul className="space-y-3">
              {transactions.map((t) => (
                <li
                  key={t._id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{t.category}</span>
                      <span className="text-green-600 font-semibold">₹{t.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => dispatch(deleteTransaction(t._id))}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Recommendations + Chart Section */}
      <section className="bg-white p-6 rounded-lg shadow flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Spending Insights</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : recommendations.length === 0 ? (
          <p className="text-gray-500">No recommendations available.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            {recommendations.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Spending by Category</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <SpendingChart insights={insights} />
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Category-wise Spending</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : insights.length === 0 ? (
          <p className="text-gray-500">No insights found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <h3 className="font-medium text-lg text-gray-700">{insight._id}</h3>
                <p className="text-green-700 font-semibold text-xl">₹{insight.totalSpent}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FinanceDashboard;