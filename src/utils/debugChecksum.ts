import { calculateChecksum } from "./checksum";

const input = "test@example.comJohn Doe12345";
let chk = 0x12345678;

console.log("Initial chk:", chk.toString(16));
for (let i = 0; i < input.length; i++) {
  chk += input.charCodeAt(i) * (i + 1);
  console.log(`After processing '${input[i]}' (charCode: ${input.charCodeAt(i)}): chk = ${chk.toString(16)}`);
}
console.log("Final Calculated Checksum:", (chk & 0xffffffff).toString(16));
