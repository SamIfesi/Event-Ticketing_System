import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  XCircle,
  QrCode,
  AlertCircle,
  CalendarDays,
  Ticket,
  AlertTriangle,
  Banknote,
  Lock,
  ShieldCheck,
  ShieldX,
  UserX,
  Flag,
  CreditCard,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotification';
import { formateRelativeTime } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';

const TYPE_ICONS = {
  booking_confirmed:       { icon: CheckCircle2,  color: '#22c55e' },
  booking_failed:          { icon: XCircle,       color: '#ef4444' },
  ticket_checkin:          { icon: QrCode,        color: '#2563eb' },
  event_cancelled:         { icon: AlertCircle,   color: '#ef4444' },
  event_updated:           { icon: CalendarDays,  color: '#f59e0b' },
  new_booking:             { icon: Ticket,        color: '#10b981' },
  low_tickets:             { icon: AlertTriangle, color: '#f59e0b' },
  payout_sent:             { icon: Banknote,      color: '#22c55e' },
  payout_failed:           { icon: XCircle,       color: '#ef4444' },
  payout_frozen:           { icon: Lock,          color: '#f59e0b' },
  organizer_approved:      { icon: ShieldCheck,   color: '#22c55e' },
  organizer_rejected:      { icon: ShieldX,       color: '#ef4444' },
  role_changed:            { icon: ShieldCheck,   color: '#2563eb' },
  account_deactivated:     { icon: UserX,         color: '#ef4444' },
  account_flagged:         { icon: Flag,          color: '#ef4444' },
  bank_details_required:   { icon: CreditCard,    color: '#f59e0b' },
  admin_payout_failed:     { icon: AlertCircle,   color: '#ef4444' },
  admin_organizer_flagged: { icon: Flag,          color: '#f59e0b' },
};

function NotificationSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-btn bg-border shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-border rounded w-2/3" />
          <div className="h-3 bg-border rounded w-full" />
          <div className="h-3 bg-border rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ notification, onMarkRead, onDelete }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const typeConfig = TYPE_ICONS[notification.type] ?? { icon: Bell, color: '#2563eb' };
  const Icon = typeConfig.icon;

  function handleClick() {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  }

  return (
    <div
      className={`relative bg-card border rounded-card p-4 transition-all duration-150 cursor-pointer group ${
        notification.is_read
          ? 'border-border hover:border-accent/30 hover:shadow-sm'
          : 'border-accent/30 bg-accent-text/30 hover:shadow-md'
      }`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Unread dot */}
      {!notification.is_read && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-card bg-accent" />
      )}

      <div className="flex items-start gap-3 pl-1">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-btn flex items-center justify-center shrink-0"
          style={{ background: `${typeConfig.color}18` }}
        >
          <Icon size={17} strokeWidth={1.75} style={{ color: typeConfig.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${notification.is_read ? 'text-primary font-medium' : 'text-primary font-bold'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-2">
            {notification.body}
          </p>
          <p className="text-[11px] text-muted mt-1.5">
            {formateRelativeTime(notification.created_at)}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className={`w-8 h-8 flex items-center justify-center rounded-btn text-muted hover:text-error hover:bg-error/10 transition-all duration-150 shrink-0 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Delete notification"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [currentPage, setCurrentPage] = useState(1);

  const {
    notifications,
    pagination,
    notificationsLoading,
    fetchNotifications,
    unreadCount,
    mutating,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications({
      page: currentPage,
      ...(filter === 'unread' ? { unread: 1 } : {}),
    });
  }, [filter, currentPage]);

  async function handleMarkAllRead() {
    await markAllRead();
    fetchNotifications({ page: currentPage });
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setCurrentPage(1);
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-error text-white text-xs font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-secondary">
              Stay up to date with your bookings, events, and account.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<CheckCheck size={15} />}
              loading={mutating}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`h-9 px-4 rounded-btn text-xs font-semibold border transition-colors ${
                filter === f.value
                  ? 'bg-accent text-white border-accent'
                  : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {notificationsLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkRead={markRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>

            {pagination?.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
              <Bell size={28} strokeWidth={1.5} className="text-accent" />
            </div>
            <div>
              <p className="font-bold text-primary text-lg">
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </p>
              <p className="text-sm text-secondary mt-1 max-w-xs">
                {filter === 'unread'
                  ? 'You have no unread notifications.'
                  : "You'll see updates about your bookings, events, and account here."}
              </p>
            </div>
            {filter === 'unread' && (
              <button
                onClick={() => handleFilterChange('all')}
                className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}