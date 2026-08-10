export async function onRequestGet(context) {
  const { slug } = context.params;
  const response = await fetch(`https://ticketer.website/api/events/${slug}/meta`);
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    }
  })
}