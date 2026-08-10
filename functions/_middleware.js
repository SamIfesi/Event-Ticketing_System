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
];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Check if the request is visiting an event page: /events/:slug
  const eventMatch = url.pathname.match(/^\/events\/([^/]+)\/?$/);

  if (eventMatch) {
    const isBot = BOT_USER_AGENTS.some((bot) =>
      userAgent.toLowerCase().includes(bot)
    );

    if (isBot) {
      const slug = eventMatch[1];
      const backendUrl = env.BACKEND_URL || 'https://api.ticketer.website';

      // Fetch the meta HTML directly from your API
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
