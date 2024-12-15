import React from 'react';
import { COLUMN_CONFIG } from '../../lib/constants';

interface Props {
  title: string;
  percentage: number;
  variant?: 'success' | 'danger' | 'info';
}

export default function MetricCard({ title, percentage, variant = 'info' }: Props) {
  const getColorClass = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600';
      case 'danger':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${getColorClass()}`}>
        {percentage.toFixed(1)}%
      </p>
    </div>
  );
}