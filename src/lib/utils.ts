const DIGITS = "0123456789";

export function toNull<T>(v: T | ""): T | null {
  return v === "" ? null : v;
}

export function mapDefined<T extends Record<string, unknown>, V>(
  obj: T,
  transform: (value: T[keyof T]) => V,
): Partial<Record<keyof T, V>> {
  return Object.fromEntries(
    (Object.entries(obj) as [keyof T, T[keyof T]][])
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, transform(v)]),
  ) as Partial<Record<keyof T, V>>;
}

export function generateNumericString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return result;
}
