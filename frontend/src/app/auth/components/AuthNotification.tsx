'use client';

import { useAuthStore } from '../store';

export default function AuthNotification() {
  const { message } = useAuthStore();

  if (!message) return null;

  const styleClasses =
    message.type === 'success'
      ? 'bg-emerald-950/30 border border-emerald-800/80 text-emerald-200'
      : message.type === 'error'
      ? 'bg-rose-950/30 border border-rose-800/80 text-rose-200'
      : 'bg-blue-950/30 border border-blue-800/80 text-blue-200';

  return (
    <div className={`mb-5 rounded-lg p-3 text-xs leading-relaxed transition-all ${styleClasses}`}>
      {message.text}
    </div>
  );
}
