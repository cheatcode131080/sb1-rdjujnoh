import React from 'react';
import { useDrag } from 'react-dnd';
import { DollarSign } from 'lucide-react';
import { Entry } from '../types';

interface Props {
  entry: Entry;
}

export default function KanbanCard({ entry }: Props) {
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { id: entry.id, type: 'card', status: entry.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-sm cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="font-medium text-gray-900 mb-2">{entry.name}</h3>
      {entry.products && (
        <p className="text-sm text-gray-600 mb-2">{entry.products}</p>
      )}
      <div className="flex items-center text-sm text-gray-700">
        <DollarSign size={16} className="mr-1" />
        {entry.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>
    </div>
  );
}