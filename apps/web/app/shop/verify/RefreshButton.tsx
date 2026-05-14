"use client";

export default function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="w-full bg-white border border-lex-navy text-lex-navy font-body text-[13px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-lex-navy hover:text-white transition-colors rounded-sm"
    >
      Refresh Page
    </button>
  );
}
