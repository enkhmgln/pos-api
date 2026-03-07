const DIGITS = "0123456789";

export function generateNumericString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return result;
}
