'use client';

import { useEffect, useRef, useState } from 'react';
import { useNotificationStore, ToastNotification, NotificationType } from '@/lib/notifications';

function ToastCard({ notification }: { notification: ToastNotification }) {
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const [isDismissing, setIsDismissing] = useState(false);
  const [dismissedByDrag, setDismissedByDrag] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const duration = notification.duration || 5000;

  const handleDismiss = (fromDrag = false) => {
    if (isDismissing) return;
    setIsDismissing(true);
    if (fromDrag) {
      setDismissedByDrag(true);
    }
    setTimeout(() => {
      removeNotification(notification.id);
    }, 320); // Matches smooth exit animation timing
  };

  useEffect(() => {
    if (isPaused || isDismissing || isDragging) return;
    const timer = setTimeout(() => {
      handleDismiss(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isPaused, isDismissing, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on buttons inside the card
    if ((e.target as HTMLElement).closest('button')) return;
    if (isDismissing) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if pointer capture unsupported
    }

    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isDismissing) return;
    const deltaX = e.clientX - startXRef.current;
    
    // Provide natural resistance when dragging left, smooth direct drag when dragging right
    const offset = deltaX > 0 ? deltaX : deltaX * 0.15;
    setDragOffset(offset);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsPaused(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Dismiss threshold: 75px drag distance
    if (dragOffset > 75) {
      handleDismiss(true);
    } else {
      // Snap back smoothly
      setDragOffset(0);
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsPaused(false);
    setDragOffset(0);
  };

  const config: Record<
    NotificationType,
    {
      borderColor: string;
      bgColor: string;
      shadow: string;
      iconBg: string;
      iconColor: string;
      icon: React.ReactNode;
      defaultTitle: string;
    }
  > = {
    error: {
      borderColor: 'border-rose-500/35',
      bgColor: 'bg-[#181214]/95',
      shadow: 'shadow-[0_12px_32px_-6px_rgba(244,63,94,0.18)]',
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
      iconColor: 'text-rose-400',
      defaultTitle: 'Error',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    success: {
      borderColor: 'border-[#b6f076]/45',
      bgColor: 'bg-[#121c12]/95',
      shadow: 'shadow-[0_12px_32px_-6px_rgba(182,240,118,0.2)]',
      iconBg: 'bg-[#b6f076]/15 text-[#b6f076] border border-[#b6f076]/25',
      iconColor: 'text-[#b6f076]',
      defaultTitle: 'Success',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    warning: {
      borderColor: 'border-amber-500/35',
      bgColor: 'bg-[#1c1811]/95',
      shadow: 'shadow-[0_12px_32px_-6px_rgba(245,158,11,0.18)]',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      iconColor: 'text-amber-400',
      defaultTitle: 'Notice',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      borderColor: 'border-white/12',
      bgColor: 'bg-[#161d16]/95',
      shadow: 'shadow-[0_12px_32px_-6px_rgba(0,0,0,0.5)]',
      iconBg: 'bg-white/10 text-[#dde5d9] border border-white/10',
      iconColor: 'text-[#dde5d9]',
      defaultTitle: 'Information',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const currentConfig = config[notification.type] || config.info;
  const title = notification.title || currentConfig.defaultTitle;

  // Dynamic style calculation for smooth drag & dismissal
  let dynamicStyle: React.CSSProperties = {};
  if (dismissedByDrag) {
    dynamicStyle = {
      transform: 'translate3d(120%, 0, 0)',
      opacity: 0,
      maxHeight: 0,
      marginBottom: '-0.625rem',
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
      transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  } else if (isDragging) {
    dynamicStyle = {
      transform: `translate3d(${dragOffset}px, 0, 0)`,
      opacity: Math.max(0.15, 1 - Math.max(0, dragOffset) / 240),
      transition: 'none',
    };
  } else if (dragOffset > 0) {
    dynamicStyle = {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }

  const animationClass = isDismissing && !dismissedByDrag
    ? 'animate-toast-out'
    : !isDragging && !dismissedByDrag && dragOffset === 0
    ? 'animate-toast-in'
    : '';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDraggingRef.current) setIsPaused(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={dynamicStyle}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border ${
        currentConfig.borderColor
      } ${currentConfig.bgColor} backdrop-blur-xl ${
        currentConfig.shadow
      } p-4 flex items-start gap-3.5 select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${animationClass}`}
    >
      {/* Icon with pop animation */}
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center pointer-events-none animate-icon-pop ${currentConfig.iconBg}`}
      >
        {currentConfig.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1 pt-0.5 pointer-events-none">
        <h4 className="text-xs sm:text-sm font-semibold text-[#f6ffe4] tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-[#c2c9b5]/90 mt-0.5 leading-relaxed break-words">
          {notification.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss(false);
        }}
        className="shrink-0 p-1.5 rounded-lg text-[#c2c9b5]/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const notifications = useNotificationStore((s) => s.notifications);

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 w-[calc(100vw-2rem)] sm:w-[380px] pointer-events-none"
    >
      {notifications.map((n) => (
        <ToastCard key={n.id} notification={n} />
      ))}
    </div>
  );
}
