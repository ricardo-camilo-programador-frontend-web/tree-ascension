export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  
  // Handle very large numbers with AA, AB, AC...
  if (num >= 1e15) {
    const exponent = Math.floor(Math.log10(num) / 3);
    const suffixIndex = exponent - 5; // 1e15 is 10^15, which is 1000^5. 
    
    // This is a simple implementation. For a more robust one, we might need a library.
    // Given the constraints, I'll implement a basic version.
    if (suffixIndex < 0) return num.toExponential(2).replace('e+', 'e');
    
    const suffixes = ['K', 'M', 'B', 'T', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ'];
    if (suffixIndex < suffixes.length) {
      return (num / Math.pow(1000, exponent)).toFixed(2) + suffixes[suffixIndex];
    }
    
    return num.toExponential(2).replace('e+', 'e');
  }
  
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  
  return Math.floor(num).toLocaleString();
};
