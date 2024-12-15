import { Entry } from '../types';

export function calculateMetrics(entries: Entry[]) {
  const total = entries.length;
  const closedCount = entries.filter(e => e.status === 'closed').length;
  const droppedCount = entries.filter(e => e.status === 'dropped').length;
  
  const closedRate = total > 0 ? (closedCount / total) * 100 : 0;
  const droppedRate = total > 0 ? (droppedCount / total) * 100 : 0;
  
  const totalValue = entries.reduce((sum, entry) => sum + entry.value, 0);
  const closedValue = entries
    .filter(e => e.status === 'closed')
    .reduce((sum, entry) => sum + entry.value, 0);
  
  const conversionRate = totalValue > 0 ? (closedValue / totalValue) * 100 : 0;
  
  return {
    closedRate,
    droppedRate,
    conversionRate,
  };
}