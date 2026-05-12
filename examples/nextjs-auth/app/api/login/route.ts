import { login } from "../../../services/authService";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const result = login(body.email, body.password);
  return Response.json(result);
}
