import { login } from "../../../services/authService";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  return Response.json(login(body.email, body.password));
}
