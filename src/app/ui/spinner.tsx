'use client';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-600">
      <svg viewBox="0 0 24 24" className="w-5 h-5 animate-spin">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
        <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}
