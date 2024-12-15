import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetricCard from '../analytics/MetricCard';
import SalesChart from '../analytics/SalesChart';
import { useAdminEntries } from '../../context/EntriesContext';
import { useAdminAuth } from '../../context/AuthContext';
import { calculateMetrics } from '../../lib/analytics';
import { COLUMN_CONFIG } from '../../lib/constants';

interface Props {
  userId?: string;
  username?: string;
  showBackLink?: boolean;
}

export default function UserAnalytics({ userId: propUserId, username: propUsername, showBackLink = true }: Props) {
  const params = useParams();
  const { getUserEntries } = useAdminEntries();
  const { getUsers } = useAdminAuth();
  
  // Use URL param if available, otherwise use prop
  const userId = params.userId || propUserId;
  
  const [username, setUsername] = React.useState(propUsername);

  React.useEffect(() => {
    if (!propUsername && userId) {
      try {
        const user = getUsers().find(u => u.id === userId);
        setUsername(user?.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
  }, [userId, propUsername, getUsers]);

  if (!userId) return null;

  const entries = getUserEntries(userId);
  const metrics = calculateMetrics(entries);

  if (!entries.length) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {username ? `${username} has no entries yet` : 'No entries found'}
          </h2>
          {showBackLink && (
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {username ? `${username}'s Analytics` : 'User Analytics'}
          </h2>
          {showBackLink && (
            <Link
              to="/admin/analytics"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
          )}
        </div>

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
                {entries.filter(e => e.status === status).length}
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

        <SalesChart entries={entries} />
      </div>
    </div>
  );
}