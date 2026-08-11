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

export default {
  async fetch(request, env ) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    const backendUrl = env.BACKEND_URL || 'https://api.ticketer.website';

    // 1. PROXY: Fetch sitemap from backend without changing the browser URL
    if (url.pathname === '/sitemap.xml') {
      // Change to `${backendUrl}/api/sitemap.xml` if your backend route includes /api
      return fetch(`${backendUrl}/api/sitemap.xml`);
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

    // Pass non-intercepted requests to static assets (Vite / SPA)
    return env.ASSETS.fetch(request);
  },
};
