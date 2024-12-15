import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../lib/utils';
import { Entry } from '../../types';

interface Props {
  entries: Entry[];
}

export default function SalesChart({ entries }: Props) {
  const chartData = React.useMemo(() => {
    const closedEntries = entries
      .filter((e) => e.status === 'closed')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let cumulativeValue = 0;
    return closedEntries.map((entry) => {
      cumulativeValue += entry.value;
      return {
        date: new Date(entry.createdAt).toLocaleDateString(),
        value: cumulativeValue,
      };
    });
  }, [entries]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Cumulative Sales Value Over Time
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCompactCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}