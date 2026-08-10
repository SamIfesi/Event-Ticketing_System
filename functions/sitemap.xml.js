export async function onRequestGet(){
  const response = await fetch('https://ticketer.website/api/sitemap.xml');
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}