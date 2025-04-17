/**
 * Calculates a checksum for the given string.
 * @param s - The input string to calculate the checksum for.
 * @returns The calculated checksum as a hexadecimal string.
 */
export function calculateChecksum(s: string): string {
  let chk = 0x12345678; // Initial checksum value
  const len = s.length;

  for (let i = 0; i < len; i++) {
    chk += s.charCodeAt(i) * (i + 1); // Add weighted character code
  }

  return (chk & 0xffffffff).toString(16); // Return as a hexadecimal string
}
