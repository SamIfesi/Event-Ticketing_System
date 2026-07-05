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
    const slug = request.nextUrl.pathname.split('/events/')[1];
    const backendUrl = `https://api-ticketer-e.up.railway.app/api/events/${slug}/meta`;
    return Response.redirect(backendUrl, 307);
  }
}