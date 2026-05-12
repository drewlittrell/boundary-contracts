import { login } from "../../services/authService";

export function testLogin(): boolean {
  return login("user@example.com", "long-password").ok;
}
