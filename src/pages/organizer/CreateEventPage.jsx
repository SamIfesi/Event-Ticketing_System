import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useOrganizerEvents } from '../../hooks/useOrganizerEvents';
import CategoryService from '../../services/category.service';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import EventForm from '../../components/events/EventForm';

export default function CreateEventPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { createEvent, loading, error, fieldErrors } = useOrganizerEvents();

  useEffect(() => {
    CategoryService.getCategories()
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(formData) {
    await createEvent(formData, {
      onSuccess: (event) => {
        navigate(`/organizer/events/${event.id}/edit`);
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
          <span className="text-primary font-medium">Create Event</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <PlusCircle size={14} className="text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              New Event
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Create an Event
          </h1>
          <p className="text-sm text-secondary mt-1">
            Fill in the details below. You can save as a draft and publish
            later.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-card p-6 sm:p-8">
          <EventForm
            categories={categories}
            loading={loading}
            error={error}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            submitLabel="Create Event"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
