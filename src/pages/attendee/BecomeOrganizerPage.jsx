// Three states:
//   1. No application yet → show the application form
//   2. Application pending → show a waiting screen
//   3. Application approved → show success + redirect prompt
//   4. Application rejected → show rejection + allow reapply

import { useEffect, useState } from 'react';
import { useOrganizerApplication } from '../../hooks/useOrgApplication';
import { useAuthStore } from '../../store/authStore';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import CenterLoader from '../../components/loaders/CenterLoader';

import PendingScreen from '../../components/orgApplication/PendingScreen';
import ApplicationForm from '../../components/orgApplication/ApplicationForm';
import OrganizerPitch from '../../components/orgApplication/OrganizerPitch';
import {
  ApprovedScreen,
  RejectedScreen,
} from '../../components/orgApplication/StatusScreen';

export default function BecomeOrganizerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((s) => s.user);

  const {
    myApplication,
    myApplicationLoading,
    myApplicationChecked,
    fetchMyApplication,
    hasPendingApplication,
    hasApprovedApplication,
    hasRejectedApplication,
    submitting,
    error: submitError,
    fieldErrors,
    submitApplication,
  } = useOrganizerApplication();

  useEffect(() => {
    fetchMyApplication();
  }, []);

  async function handleSubmit(formData) {
    const success = await submitApplication(formData);
    if (success) setShowForm(false);
  }

  const layout = (children) => (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">{children}</main>
      <Footer />
    </div>
  );

  if (myApplicationLoading || !myApplicationChecked) {
    return layout(<CenterLoader />);
  }

  if (hasPendingApplication && !showForm) {
    return layout(<PendingScreen application={myApplication} />);
  }

  if (hasApprovedApplication && !showForm) {
    return layout(<ApprovedScreen />);
  }

  if (hasRejectedApplication && !showForm) {
    return layout(<RejectedScreen onReapply={() => setShowForm(true)} />);
  }

  return layout(
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <OrganizerPitch user={user} />

      <div className="bg-card border border-border rounded-card p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-primary mb-1">Organizer application</h2>
        <p className="text-sm text-secondary mb-6">
          Fill in your details and we'll review your application within 24–48 hours.
        </p>

        <ApplicationForm
          onSubmit={handleSubmit}
          loading={submitting}
          fieldErrors={fieldErrors}
          submitError={submitError}
        />
      </div>
    </div>
  );
}