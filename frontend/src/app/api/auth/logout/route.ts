export async function POST() {
  await fetch(`${process.env.API_URL}/users/login`, {
    method: 'POST',
  });
  return new Response('ok', { status: 200 });
}
