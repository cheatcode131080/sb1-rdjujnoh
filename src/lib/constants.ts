// Column Configuration
export const COLUMN_CONFIG = [
  { 
    title: 'New', 
    status: 'new' as const,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerColor: 'text-blue-700'
  },
  { 
    title: 'Pending', 
    status: 'pending' as const,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    headerColor: 'text-yellow-700'
  },
  { 
    title: 'Closed', 
    status: 'closed' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    headerColor: 'text-green-700'
  },
  { 
    title: 'Dropped', 
    status: 'dropped' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    headerColor: 'text-red-700'
  },
] as const;

// Initial Sample Data
export const INITIAL_ENTRIES = [
  {
    id: '1',
    name: 'Enterprise Software Solution',
    products: 'CRM Pro, Analytics Suite',
    value: 50000,
    status: 'new',
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    products: 'Cloud Storage, Security Package',
    value: 75000,
    status: 'pending',
    createdAt: '2024-03-05',
  },
  {
    id: '3',
    name: 'Data Analytics Platform',
    value: 120000,
    status: 'closed',
    createdAt: '2024-03-10',
  },
] as const;