import React from 'react';
import { useDrop } from 'react-dnd';
import { Entry, DragItem } from '../../types';
import KanbanCard from './KanbanCard';

interface Props {
  title: string;
  status: Entry['status'];
  entries: Entry[];
  bgColor: string;
  borderColor: string;
  headerColor: string;
  onMove: (id: string, status: Entry['status']) => void;
}

export default function KanbanColumn({ 
  title, 
  status, 
  entries, 
  bgColor,
  borderColor,
  headerColor,
  onMove 
}: Props) {
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
      className={`${bgColor} rounded-lg p-4 border-2 ${borderColor} min-h-[24rem] ${
        isOver ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold ${headerColor} text-lg`}>{title}</h2>
        <span className={`${bgColor} border ${borderColor} px-2 py-1 rounded-full text-sm ${headerColor}`}>
          {entries.length}
        </span>
      </div>
      <div className="space-y-3">
        {entries.map((entry) => (
          <KanbanCard key={entry.id} entry={entry} status={status} />
        ))}
      </div>
    </div>
  );
}