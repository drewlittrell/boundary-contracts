import { authenticate } from "../domain/auth";

export function login(email: string, password: string): { ok: boolean; userId?: string } {
  return authenticate(email, password);
}
