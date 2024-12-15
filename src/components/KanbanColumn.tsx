import React from 'react';
import { useDrop } from 'react-dnd';
import { Entry, DragItem } from '../types';
import KanbanCard from './KanbanCard';

interface Props {
  title: string;
  status: Entry['status'];
  entries: Entry[];
  onMove: (id: string, status: Entry['status']) => void;
}

export default function KanbanColumn({ title, status, entries, onMove }: Props) {
  const [{ isOver }, drop] = useDrop({
    accept: 'card',
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-gray-50 rounded-lg p-4 ${
        isOver ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
          {entries.length}
        </span>
      </div>
      <div className="space-y-3">
        {entries.map((entry) => (
          <KanbanCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}