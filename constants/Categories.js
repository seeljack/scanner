export const CATEGORIES = [
  { id: 'all', name: 'All Documents', icon: 'folder' },
  { id: 'invoices', name: 'Invoices', icon: 'receipt' },
  { id: 'receipts', name: 'Receipts', icon: 'receipt-long' },
  { id: 'contracts', name: 'Contracts', icon: 'description' },
  { id: 'ids', name: 'IDs', icon: 'badge' },
  { id: 'notes', name: 'Notes', icon: 'note' }
];

// Helper function to get category names without 'All Documents'
export const getCategoryNames = () => {
  return CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map(cat => cat.name);
}; 