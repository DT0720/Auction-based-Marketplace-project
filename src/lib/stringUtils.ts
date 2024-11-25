export const formatCurrency = (amount: number | null): string => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount ?? 0.00);