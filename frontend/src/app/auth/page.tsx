'use client';

import { useEffect } from 'react';
import { useCurrentUser } from './hooks';
import { useAuthStore } from './store';
import AuthTabs from './components/AuthTabs';
import AuthNotification from './components/AuthNotification';
import ActiveSessionCard from './components/ActiveSessionCard';
import LoginForm from './components/LoginForm';
import RegisterWizard from './components/RegisterWizard';

export default function AuthPage() {
  const { data: currentUser, triggerRefetch } = useCurrentUser();
  const { activeTab, resendCooldown, decrementCooldown } = useAuthStore();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      decrementCooldown();
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown, decrementCooldown]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-[#21252b] bg-[#121518] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/2 rounded-full blur-3xl pointer-events-none" />

        {currentUser && (
          <ActiveSessionCard user={currentUser} onSignOut={triggerRefetch} />
        )}

        <AuthTabs />
        <AuthNotification />

        {activeTab === 'login' ? (
          <LoginForm onSuccess={() => triggerRefetch()} />
        ) : (
          <RegisterWizard onSuccess={() => triggerRefetch()} />
        )}
      </div>
    </div>
  );
}
