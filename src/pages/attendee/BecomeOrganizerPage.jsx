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
import PendingScreen from '../../components/orgApplication/PendingScreen';
import ApplicationForm from '../../components/orgApplication/ApplicationForm';
import OrganizerPitch from '../../components/orgApplication/OrganizerPitch';
import {
  ApprovedSreen,
  RejectedScreen,
} from '../../components/orgApplication/StatusScreen';


// ── Main page ─────────────────────────────────────────────────
export default function BecomeOrganizerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((state) => state.user);

  const {
    myApplication,
    myApplicationLoading,
    myApplicationChecked,
    fetchMyApplication,
    hasPendingApplication,
    hasApprovedApplication,
    hasRejectedApplication,
    canApply,
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

  const layout = (children)=>{
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={()=>setSidebarOpen(true)}/>
        <Sidebar isOpen={sidebarOpen} onClose={()=setSidebarOpen(false)}/>
        <main className="flex-1 w-full max-w-full mx-auto px-6 py-10">{children}</main>
        <Footer />
    </div>
  }

  if (hasPendingScreen && !showForm) return layout(<PendingScreen application={myApplication}/>);
  if (hasApprovedApplication && !showForm) return layout(<ApprovedScreen />);
  if (hasRejectedApplication && !showForm) return layout(<RejectedScreen onReapply={()=> setShowForm(true)}/>);

  return ();
}
