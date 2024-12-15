import React from 'react';
import MetricCard from './analytics/MetricCard';
import SalesChart from './analytics/SalesChart';
import { useEntries, useAdminEntries } from '../context/EntriesContext';
import { COLUMN_CONFIG } from '../lib/constants';
import { calculateMetrics } from '../lib/analytics';
import { Entry } from '../types';

interface Props {
  userId?: string;
}

export default function Analytics({ userId }: Props) {
  const { entries } = useEntries();
  const { getUserEntries } = useAdminEntries();
  
  // If userId is provided (admin view), use admin entries
  const displayEntries: Entry[] = userId ? getUserEntries(userId) : entries;
  const metrics = calculateMetrics(displayEntries);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {COLUMN_CONFIG.map(({ title, status, bgColor, borderColor, headerColor }) => (
          <div
            key={status}
            className={`${bgColor} rounded-lg p-6 shadow-sm border-2 ${borderColor}`}
          >
            <h3 className={`text-lg font-medium ${headerColor} capitalize mb-2`}>
              {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {displayEntries.filter(e => e.status === status).length}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Deal Success Rate"
          percentage={metrics.closedRate}
          variant="success"
        />
        <MetricCard
          title="Drop-off Rate"
          percentage={metrics.droppedRate}
          variant="danger"
        />
        <MetricCard
          title="Value Conversion Rate"
          percentage={metrics.conversionRate}
          variant="info"
        />
      </div>

      <SalesChart entries={displayEntries} />
    </div>
  );
}