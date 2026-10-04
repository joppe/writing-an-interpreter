export type HashKey = string;

export function hashKey(
  type: string,
  value: number | boolean | string,
): HashKey {
  const data = new TextEncoder().encode(value.toString());

  return `${type}:${data.toBase64()}`;
}
