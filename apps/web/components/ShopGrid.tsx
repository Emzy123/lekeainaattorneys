"use client";

import React, { useState, useTransition } from 'react';
import { Clock, Lock, X, Star, ChevronDown, CheckCircle2, ChevronRight, Search, AlertCircle, Loader2 } from 'lucide-react';
import { initializeCheckout } from '../app/actions/checkout';

type Resource = {
  id: string;
  title: string;
  description: string;
  price: number; // In kobo
  currency: string;
  coverImage: string | null;
  fileType: string;
};

const CATEGORIES = ['All Resources', 'Corporate', 'Compliance', 'Litigation', 'Templates'];

interface ShopGridProps {
  resources: Resource[];
}

export default function ShopGrid({ resources }: ShopGridProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side filtering (category is illustrative; search filters by title/description)
  const filtered = resources.filter((r) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    // All categories show all (categories are illustrative labels for now)
    return matchesSearch;
  });

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedResource || !email) return;
    setErrorMsg('');

    const formData = new FormData();
    formData.set('resourceId', selectedResource.id);
    formData.set('email', email);

    startTransition(async () => {
      try {
        await initializeCheckout(formData);
      } catch (err: unknown) {
        // If this is a Next.js redirect, it will be handled automatically.
        // Any other error is surfaced to the user.
        const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
        if (!message.includes('NEXT_REDIRECT')) {
          setErrorMsg(message);
        }
      }
    });
  };

  const formatPrice = (kobo: number, currency: string) => {
    const symbol = currency === 'NGN' ? '₦' : '$';
    return `${symbol}${(kobo / 100).toLocaleString()}`;
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 font-body text-[12px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all duration-fast ${
                activeCategory === cat
                  ? 'bg-lex-navy text-white shadow-md'
                  : 'bg-white text-lex-slate border border-lex-navy/10 hover:border-lex-navy hover:text-lex-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-lex-slate" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources…"
            className="block w-full pl-12 pr-4 py-3 rounded-sm bg-white border border-lex-navy/10 text-lex-navy placeholder-lex-slate focus:border-lex-gold focus:ring-0 transition-all font-body text-[14px] shadow-sm"
          />
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <p className="text-lex-slate font-body text-[16px]">
              {searchQuery ? `No resources found for "${searchQuery}".` : 'No resources currently available in the shop.'}
            </p>
          </div>
        ) : (
          filtered.map((res, index) => (
            <div
              key={res.id}
              className="group bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-normal ease-lex-standard cursor-pointer"
              onClick={() => {
                setSelectedResource(res);
                setErrorMsg('');
                setEmail('');
              }}
            >
              {/* Cover Image / Placeholder */}
              <div className="h-[260px] bg-lex-smoke relative overflow-hidden">
                {res.coverImage ? (
                  <img
                    src={res.coverImage}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-lex-navy to-lex-slate flex items-center justify-center p-8 text-center border-b-[8px] border-lex-gold">
                    <span className="font-display text-[24px] font-bold text-white leading-tight">
                      {res.title}
                    </span>
                  </div>
                )}

                {/* Bestseller Ribbon */}
                {index === 0 && (
                  <div className="absolute top-4 -right-12 bg-lex-gold text-lex-navy font-body text-[10px] font-bold uppercase tracking-widest py-1 px-12 rotate-45 shadow-md">
                    Bestseller
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-lex-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-lex-navy font-body text-[12px] font-bold uppercase tracking-wider px-6 py-3 rounded-sm shadow-lg hover:bg-lex-gold hover:text-white transition-colors">
                    View Details
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block self-start px-3 py-1 bg-lex-gold/10 text-lex-gold font-body text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3">
                  Legal Template
                </span>
                <h4 className="font-display text-[22px] font-bold text-lex-navy leading-tight mb-2 group-hover:text-lex-gold transition-colors line-clamp-2">
                  {res.title}
                </h4>
                <div className="flex items-center justify-between text-lex-slate font-body text-[12px] mb-6 mt-auto">
                  <span>By LEX Counsel</span>
                  <span className="uppercase tracking-wider">{res.fileType} Format</span>
                </div>

                <div className="flex items-center justify-between border-t border-lex-navy/10 pt-4">
                  <span className="font-display text-[24px] font-bold text-lex-navy">
                    {formatPrice(res.price, res.currency)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResource(res);
                      setErrorMsg('');
                      setEmail('');
                    }}
                    className="bg-lex-gold text-lex-navy hover:bg-amber-500 font-body text-[12px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Purchase Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-lex-navy/80 backdrop-blur-sm animate-in fade-in duration-normal">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-[860px] max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative">

            {/* Close Button */}
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-lex-smoke rounded-full transition-colors border border-lex-navy/10"
              aria-label="Close"
            >
              <X size={18} className="text-lex-navy" />
            </button>

            {/* Left Panel — Checkout (40%) */}
            <div className="w-full md:w-[40%] bg-lex-smoke p-8 flex flex-col items-center justify-center border-r border-lex-navy/10 text-center">
              {/* Document Preview */}
              <div className="w-full aspect-[3/4] bg-lex-navy rounded-sm shadow-lg mb-8 relative overflow-hidden border-l-[6px] border-lex-gold">
                {selectedResource.coverImage ? (
                  <img
                    src={selectedResource.coverImage}
                    alt={selectedResource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-lex-navy to-lex-slate flex items-center justify-center p-6 text-center">
                    <span className="font-display text-[22px] font-bold text-white leading-tight">
                      {selectedResource.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="font-display text-[36px] font-bold text-lex-navy mb-1">
                {formatPrice(selectedResource.price, selectedResource.currency)}
              </div>
              <p className="font-body text-[12px] text-lex-slate mb-6">One-time purchase · Instant delivery</p>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="w-full space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter email for delivery"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-lex-navy/20 rounded-sm font-body text-[14px] text-lex-navy focus:border-lex-gold focus:ring-0 py-3 px-4 text-center transition-colors"
                />

                {errorMsg && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-3 rounded-sm text-left">
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-[12px] text-red-700">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending || !email}
                  className="w-full bg-lex-gold text-lex-navy hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed font-body text-[14px] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Redirecting to Paystack…
                    </>
                  ) : (
                    <>
                      Proceed to Payment <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-5 font-body text-[11px] font-bold uppercase tracking-wider text-lex-slate">
                <Lock size={12} className="text-emerald-600" /> Secured by Paystack
              </div>
            </div>

            {/* Right Panel — Product Details (60%) */}
            <div className="w-full md:w-[60%] p-8 md:p-12 bg-white">
              <span className="text-lex-gold font-body text-[10px] font-bold uppercase tracking-widest mb-2 block">
                Premium Legal Template
              </span>
              <h2 className="font-display text-[32px] font-bold text-lex-navy leading-tight mb-4">
                {selectedResource.title}
              </h2>

              {/* Stars */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-lex-navy/10">
                <div className="flex items-center gap-1 text-lex-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="font-body text-[12px] text-lex-slate">(24 Reviews)</span>
              </div>

              <div className="prose prose-sm font-body text-lex-slate leading-relaxed mb-8 max-w-none">
                <p>
                  {selectedResource.description ||
                    'A comprehensive, highly-detailed legal framework designed to protect corporate interests. Drafted by senior counsel and regularly updated to reflect current jurisdictional requirements.'}
                </p>
              </div>

              <h3 className="font-display text-[18px] font-bold text-lex-navy mb-4">What's Included</h3>
              <ul className="space-y-3 font-body text-[14px] text-lex-slate mb-8">
                {[
                  'Complete master template with drafting notes',
                  'Strategic commentary from senior counsel',
                  'Jurisdictional variation clauses',
                  'Lifetime updates included',
                  `${selectedResource.fileType.toUpperCase()} format · Instant download`,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-lex-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border border-lex-navy/10 rounded-sm overflow-hidden">
                <div className="bg-lex-smoke p-4 flex items-center justify-between">
                  <h4 className="font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy">
                    Table of Contents
                  </h4>
                  <ChevronDown size={16} className="text-lex-slate" />
                </div>
                <div className="p-4 space-y-2">
                  {['1. Introduction & Scope', '2. Key Definitions', '3. Core Provisions', '4. Dispute Resolution', '5. Governing Law'].map((item) => (
                    <p key={item} className="font-body text-[13px] text-lex-slate">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
