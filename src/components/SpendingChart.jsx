import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SpendingChart({ insights }) {
  const data = {
    labels: insights.map((i) => i._id),
    datasets: [
      {
        label: 'Spending by Category (₹)',
        data: insights.map((i) => i.totalSpent),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderColor: ['#1E40AF', '#059669', '#D97706', '#B91C1C', '#6D28D9'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, title: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Amount (₹)' } } }
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}

export default SpendingChart;