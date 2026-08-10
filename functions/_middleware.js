const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'twitterbot',
  'whatsapp',
  'telegrambot',
  'linkedinbot',
  'slackbot',
  'discordbot',
  'pinterest',
  'skypeuripreview',
  'googlebot',
];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const backendUrl = env.BACKEND_URL || 'https://api.ticketer.website';

  // 1. Proxy Sitemap directly to backend API for all requests
  if (url.pathname === '/sitemap.xml') {
    return fetch(`${backendUrl}/sitemap.xml`);
  }

  // 2. Intercept Event Links for Social Media Preview Bots
  const eventMatch = url.pathname.match(/^\/events\/([^/]+)\/?$/);

  if (eventMatch) {
    const isBot = BOT_USER_AGENTS.some((bot) =>
      userAgent.toLowerCase().includes(bot)
    );

    if (isBot) {
      const slug = eventMatch[1];
      const metaRes = await fetch(`${backendUrl}/api/events/${slug}/meta`);
      const body = await metaRes.text();

      return new Response(body, {
        status: metaRes.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  }

  return context.next();
}
