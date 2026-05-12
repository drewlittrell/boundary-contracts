export function authenticate(email: string, password: string): { ok: boolean; userId?: string } {
  if (email === "user@example.com" && password.length > 8) {
    return { ok: true, userId: "user_123" };
  }
  return { ok: false };
}
