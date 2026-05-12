import { POST } from "../app/api/login/route";
import { authenticate } from "../domain/auth";

export function login(email: string, password: string): { ok: boolean; userId?: string } {
  void POST;
  return authenticate(email, password);
}
