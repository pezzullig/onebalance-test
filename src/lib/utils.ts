/**
 * Formats a balance string according to specific rules:
 * - Adds thousands separators.
 * - For numbers >= 1, keeps up to 4 decimal places.
 * - For numbers < 1, keeps up to 8 significant digits after the decimal point.
 */
export function formatBalance(balance: string | number): string {
  try {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance;

    if (isNaN(num)) {
      return 'Invalid Number';
    }

    // Handle numbers >= 1
    if (Math.abs(num) >= 1) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      });
    }

    // Handle numbers < 1 (close to zero)
    if (num === 0) return '0';

    // For small numbers, keep up to 8 significant decimal digits
    // Convert to string to handle potential scientific notation and precision
    const balanceString = num.toFixed(20); // Get enough decimal places
    const [integerPart, decimalPart] = balanceString.split('.');

    if (!decimalPart) return '0'; // Should not happen with toFixed(20) unless 0

    // Find the first non-zero digit position
    let firstNonZeroIndex = -1;
    for (let i = 0; i < decimalPart.length; i++) {
      if (decimalPart[i] !== '0') {
        firstNonZeroIndex = i;
        break;
      }
    }

    if (firstNonZeroIndex === -1) return '0'; // All zeros after decimal

    // Keep up to 8 digits starting from the first non-zero digit
    const significantDecimal = decimalPart.substring(0, firstNonZeroIndex + 8);

    return `${integerPart}.${significantDecimal}`;

  } catch (error) {
    console.error("Error formatting balance:", balance, error);
    return 'Error';
  }
} 