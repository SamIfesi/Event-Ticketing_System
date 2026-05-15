import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useOrganizerEvents } from '../../hooks/useOrganizerEvents';
import { useEvents } from '../../hooks/useEvents';
import CategoryService from '../../services/category.service';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import EventForm from '../../components/events/EventForm';

// Convert backend datetime (2026-06-15 09:00:00) to datetime-local input format
function toInputDate(str) {
  if (!str) return '';
  return str.replace(' ', 'T').slice(0, 16);
}

export default function EditEventPage() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const { updateEvent, loading, error, fieldErrors } = useOrganizerEvents();
  const { event, eventLoading, fetchEvent } = useEvents();

  useEffect(() => {
    if (id) fetchEvent(id);
    CategoryService.getCategories()
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, [id]);

  // Map the API event object to EventForm's expected shape
  const initialValues = useMemo(() => {
    if (!event) return undefined;
    return {
      title: event.title ?? '',
      description: event.description ?? '',
      category_id: event.category_id ? String(event.category_id) : '',
      location: event.location ?? '',
      banner_image: event.banner_image ?? '',
      start_date: toInputDate(event.start_date),
      end_date: toInputDate(event.end_date),
      total_tickets: event.total_tickets ?? '',
      status: event.status ?? 'draft',
      ticket_types: (event.ticket_types ?? []).map((tt) => ({
        id: tt.id,
        name: tt.name ?? '',
        price: tt.price ?? 0,
        quantity: tt.quantity ?? '',
        description: tt.description ?? '',
        sales_end_at: toInputDate(tt.sales_end_at),
      })),
    };
  }, [event]);

  async function handleSubmit(formData) {
    await updateEvent(id, formData, {
      onSuccess: () => {
        // navigate('/organizer/events'),
        fetchEvent(id);
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-secondary mb-6">
          <Link
            to="/organizer/events"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={13} strokeWidth={2.5} /> My Events
          </Link>
          <span className="text-muted">/</span>
          <span className="text-primary font-medium truncate max-w-50">
            {eventLoading ? 'Loading…' : (event?.title ?? 'Edit Event')}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Pencil size={14} className="text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Edit Event
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            {eventLoading ? (
              <span className="inline-block h-8 bg-border rounded w-64 animate-pulse" />
            ) : (
              (event?.title ?? 'Edit Event')
            )}
          </h1>
          <p className="text-sm text-secondary mt-1">
            Update your event details. Changes are saved immediately.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-card p-6 sm:p-8">
          {eventLoading ? (
            <div className="flex flex-col gap-5 animate-pulse">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 bg-border rounded w-24" />
                  <div className="h-12 bg-border rounded-card" />
                </div>
              ))}
            </div>
          ) : (
            <EventForm
              initialValues={initialValues}
              categories={categories}
              loading={loading}
              error={error}
              fieldErrors={fieldErrors}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
