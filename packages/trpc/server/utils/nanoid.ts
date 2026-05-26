const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
export function nanoid(length = 8): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
