export const config = {
  matcher: '/events/:path*',
};

const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Twitterbot',
  'WhatsApp',
  'TelegramBot',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'Pinterest',
  'SkypeUriPreview',
];

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_USER_AGENTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  if (isBot) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/events/')[1];
    const backendUrl = process.env.BACKEND_URL || 'https://api-ticketer-e.up.railway.app';
    return Response.redirect(`${backendUrl}/api/events/${slug}/meta`, 307);
  }
}