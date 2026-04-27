import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

// ── Slide illustrations (inline SVG scenes) ────────────────────

function IllustrationTrack() {
  return (
    <img
      src="/assets/illustrations/party.svg"
      alt=""
      className="w-full h-full"
    />
  );
}

function IllustrationTeam() {
  return (
    <img
      src="/assets/illustrations/tickets.svg"
      alt=""
      className="w-full h-full"
    />
  );
}

function IllustrationNotify() {
  return (
    <img src="/assets/illustrations/notice.svg" alt="" className="w-full h-full"/>
  );
}

// ── Slide data ─────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    Illustration: IllustrationTrack,
    accentColor: '#2563EB',
    accentLight: '#EEF3FF',
    tag: 'Stay On Top',
    title: 'Track your work\nand get the result',
    description:
      'Remember to keep track of your professional accomplishments. Your metrics, your momentum — all in one place.',
  },
  {
    id: 1,
    Illustration: IllustrationTeam,
    accentColor: '#F97316',
    accentLight: '#FFF7ED',
    tag: 'Collaborate',
    title: 'Stay organized\nwith your team',
    description:
      'Understanding the contributions our colleagues make to our teams and companies leads to better outcomes for everyone.',
  },
  {
    id: 2,
    Illustration: IllustrationNotify,
    accentColor: '#16A34A',
    accentLight: '#F0FDF4',
    tag: 'Never Miss Out',
    title: 'Get notified when\nwork happens',
    description:
      'Take control of notifications, collaborate live or on your own time. Your work, your schedule.',
  },
];

// ── Dot indicator ──────────────────────────────────────────────
function Dots({ total, active, onDotClick, accent }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="transition-all duration-300 rounded-full"
          style={{
            width: i === active ? 24 : 8,
            height: 8,
            background: i === active ? accent : '#CBD5E1',
          }}
        />
      ))}
    </div>
  );
}

// ── Main Onboarding page ───────────────────────────────────────
export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const navigate = useNavigate();

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  function goTo(index) {
    if (animating || index === current) return;
    setDirection(index > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 280);
  }

  function finishOnboarding() {
    localStorage.setItem('onboarding_seen', 'true');
    navigate('/home');
  }

  function next() {
    if (isLast) {
      finishOnboarding();
    } else {
      goTo(current + 1);
    }
  }

  function skip() {
    finishOnboarding();
  }

  // swipe support
  const [touchStart, setTouchStart] = useState(null);
  function onTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }
  function onTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < SLIDES.length - 1) goTo(current + 1);
      if (diff < 0 && current > 0) goTo(current - 1);
    }
    setTouchStart(null);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Phone frame wrapper (centered on desktop, full on mobile) */}
      <div className="w-full flex flex-col relative overflow-hidden ">
        {/* ── Top bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-2 z-10">
          {/* Logo mark */}
          <div
            className="rounded-xl flex items-center justify-center shadow p-3"
            style={{ background: slide.accentColor }}
          >
            <img src="/assets/icons/logo-white.svg" alt="" className=" w-29" />
          </div>
          {!isLast && (
            <button
              onClick={skip}
              className="text-sm font-semibold transition-colors duration-200"
              style={{ color: slide.accentColor }}
            >
              Skip
            </button>
          )}
        </div>

        {/* ── Illustration area */}
        <div
          className="relative mx-6 mt-4 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: slide.accentLight,
            height: 280,
            transition: 'background 0.4s ease',
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: slide.accentColor }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
            style={{ background: slide.accentColor }}
          />

          {/* Slide illustration with fade+slide transition */}
          <div
            className="w-full h-full p-4 flex items-center justify-center"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction * 40}px)`
                : 'translateX(0)',
              transition: 'opacity 280ms ease, transform 280ms ease',
            }}
          >
            <slide.Illustration />
          </div>
        </div>

        {/* ── Dots */}
        <div className="flex justify-center mt-6">
          <Dots
            total={SLIDES.length}
            active={current}
            onDotClick={goTo}
            accent={slide.accentColor}
          />
        </div>

        {/* ── Text content */}
        <div
          className="px-8 mt-6 flex-1"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateY(${direction * 16}px)`
              : 'translateY(0)',
            transition: 'opacity 260ms ease 30ms, transform 260ms ease 30ms',
          }}
        >
          {/* Tag pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide uppercase"
            style={{
              background: slide.accentLight,
              color: slide.accentColor,
              border: `1.5px solid ${slide.accentColor}22`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: slide.accentColor }}
            />
            {slide.tag}
          </div>

          <h1
            className="text-[28px] leading-tight font-bold text-gray-900 mb-3 whitespace-pre-line"
            style={{ letterSpacing: '-0.02em' }}
          >
            {slide.title}
          </h1>
          <p className="text-sm leading-relaxed text-gray-500">
            {slide.description}
          </p>
        </div>

        {/* ── Bottom actions */}
        <div className="px-8 pb-10 pt-6 flex items-center justify-between">
          {/* Skip / Back */}
          <button
            onClick={() => (current > 0 ? goTo(current - 1) : skip())}
            className="h-12 px-5 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            {current === 0 ? 'SKIP' : 'BACK'}
          </button>

          {/* Next / Get Started */}
          <button
            onClick={next}
            className="h-12 px-7 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg active:scale-[.97] transition-all duration-150"
            style={{
              background: slide.accentColor,
              boxShadow: `0 8px 24px ${slide.accentColor}44`,
              transition: 'background 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {isLast ? (
              <>
                Get Started
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            ) : (
              <>
                NEXT
                <ChevronRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
