import { cookies, cookies as Cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const response = await fetch(`${process.env.API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (!response.ok) {
    return new Response(await response.text(), { status: response.status });
  } else {
    if (!response.headers.get('set-cookie')) {
      return new Response('Missing cookie.', { status: 500 });
    }

    const cookieStore = Cookies();
    // cookieStore.set('jwt', response.headers.get('set-cookie')!);
    console.log(cookieStore.getAll())
    return new Response(JSON.stringify(await response.json()), {
      status: response.status,
    });
  }
}
