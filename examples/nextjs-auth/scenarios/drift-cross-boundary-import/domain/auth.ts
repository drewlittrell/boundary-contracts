export function authenticate(email: string, password: string): { ok: boolean; userId?: string } {
  return email === "user@example.com" && password.length > 8
    ? { ok: true, userId: "user_123" }
    : { ok: false };
}
