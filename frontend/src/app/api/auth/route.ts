import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const response = await fetch(`${process.env.API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${req.cookies.get('jwt')}`,
    }
  });
  if (!response.ok) {
    return new Response(await response.text(), { status: response.status });
  } else {
    return new Response(JSON.stringify(await response.json()), { status: response.status });
  }
}
