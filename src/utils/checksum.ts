/**
 * Calculates a checksum for the given input string.
 * @param s - The input string to calculate the checksum for.
 * @returns The calculated checksum as a hexadecimal string.
 */
export function calculateChecksum(s: string): string {
  let chk = 0x12345678; // Initial checksum value
  const len = s.length;

  // console.log("Initial checksum value (chk):", chk.toString(16)); // Debugging statement
  // console.log(`Input string: ${s}`); // Debugging statement
  for (let i = 0; i < len; i++) {
    const charCode = s.charCodeAt(i); // ASCII value of the character
    const weight = i + 1; // Weight based on position
    const contribution = charCode * weight; // Contribution to the checksum

    chk += contribution;

    // Debugging statements
    // console.log(`Character: '${s[i]}', ASCII: ${charCode}, Weight: ${weight}, Contribution: ${contribution}`);
    // console.log(`Updated checksum (chk): ${chk.toString(16)}`);
  }

  const finalChecksum = (chk & 0xffffffff).toString(16); // Final checksum as a hexadecimal string
  console.log("Final checksum (chk & 0xffffffff):", finalChecksum); // Debugging statement

  return finalChecksum;
}
