"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield, Clock, Lock, ChevronRight, ChevronLeft,
  CheckCircle2, Calendar, MapPin, AlertCircle, Loader2
} from 'lucide-react';
import { submitConsultation } from '../actions/consultation';

// ─── Utilities ──────────────────────────────────────────────────────────────
function getNextBusinessDays(count: number): { label: string; day: string; full: string }[] {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let date = new Date();
  date.setDate(date.getDate() + 1); // Start from tomorrow

  while (days.length < count) {
    const dow = date.getDay();
    if (dow !== 0 && dow !== 6) { // Skip weekends
      days.push({
        label: dayNames[dow],
        day: String(date.getDate()),
        full: `${dayNames[dow]} ${date.getDate()} ${monthNames[date.getMonth()]}`,
      });
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

// ─── Step Validation ─────────────────────────────────────────────────────────
function validateStep(step: number, formData: ReturnType<typeof useFormData>['formData']): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!formData.name.trim()) errors.push('Full name is required.');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.push('A valid email address is required.');
    if (!formData.phone.trim()) errors.push('Phone number is required.');
  }
  if (step === 2) {
    if (!formData.caseType) errors.push('Please select a practice area.');
    if (!formData.jurisdiction.trim()) errors.push('Jurisdiction is required.');
    if (formData.brief.trim().length < 30)
      errors.push('Please provide at least 30 characters in your executive brief.');
  }
  return errors;
}

function useFormData() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    caseType: '', jurisdiction: '', brief: '',
    date: '', time: '',
  });
  const update = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));
  return { formData, update };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ConsultationWizardPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reference, setReference] = useState('');
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const { formData, update } = useFormData();

  const businessDays = useMemo(() => getNextBusinessDays(5), []);

  const handleNext = () => {
    const errors = validateStep(step, formData);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors([]);
    setStep(s => Math.min(s + 1, 3));
  };

  const handlePrev = () => {
    setStepErrors([]);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      setStepErrors(['Please select a preferred date and time.']);
      return;
    }
    setIsSubmitting(true);
    setStepErrors([]);
    setSubmitError('');
    try {
      const result = await submitConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        caseType: formData.caseType,
        jurisdiction: formData.jurisdiction,
        brief: formData.brief,
        date: formData.date,
        time: formData.time,
      });
      setReference(result.reference.slice(0, 8).toUpperCase());
      setIsSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">

      {/* ── Left Panel: Trust & Branding ────────────────────────────────────── */}
      <div className="w-full lg:w-[55%] relative hidden lg:flex flex-col justify-between bg-lex-navy text-white p-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-lex-navy via-lex-navy/95 to-lex-navy/80" />

        <div className="relative z-10">
          <Link href="/" className="font-display text-[24px] font-bold tracking-[0.15em] text-white hover:text-lex-gold transition-colors inline-flex items-center gap-2 mb-16">
            LEX
          </Link>
          <h1 className="font-display text-[52px] font-bold leading-[1.1] mb-6 max-w-xl">
            Decisive Counsel.<br />
            <span className="text-lex-gold">Uncompromising</span> Results.
          </h1>
          <p className="font-body text-[17px] text-white/75 max-w-lg leading-[1.8]">
            Request a confidential assessment of your corporate or litigation matter. Our senior partners review all inquiries within 24 hours.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: Shield, title: 'Absolute Confidentiality', desc: 'All communications are strictly attorney-client privileged.' },
            { icon: Clock, title: 'Rapid Response', desc: 'Guaranteed acknowledgement within 24 business hours.' },
            { icon: Lock, title: 'Secure Transmission', desc: 'End-to-end encrypted submission via TLS 1.3.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-lex-gold/10 flex items-center justify-center border border-lex-gold/30 flex-shrink-0">
                <Icon className="w-5 h-5 text-lex-gold" />
              </div>
              <div>
                <h4 className="font-body text-[13px] font-bold uppercase tracking-wider text-white">{title}</h4>
                <p className="font-body text-[12px] text-white/55 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Wizard Form ─────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] flex flex-col pt-10 pb-16 px-6 sm:px-16 overflow-y-auto min-h-screen">

        {/* Mobile Header */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="font-display text-[22px] font-bold tracking-[0.15em] text-lex-navy">LEX</Link>
          <h2 className="font-display text-[32px] font-bold text-lex-navy leading-tight mt-4">Book a Consultation</h2>
        </div>

        {isSuccess ? (
          /* ── Success State ────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-slow py-16">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border-[4px] border-emerald-100">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="font-display text-[40px] font-bold text-lex-navy mb-4">Request Received</h2>
            <p className="font-body text-[16px] text-lex-slate max-w-sm mb-2 leading-relaxed">
              Your consultation request has been securely transmitted to our intake team.
            </p>
            <div className="inline-block font-body text-[13px] font-bold uppercase tracking-widest text-lex-gold bg-lex-gold/10 border border-lex-gold/20 px-6 py-3 rounded-sm mb-10">
              Reference: LEX-{reference || '--------'}
            </div>
            <p className="font-body text-[13px] text-lex-slate max-w-xs mb-10">
              A confirmation email has been sent to <strong>{formData.email}</strong>. We will contact you within 24 hours.
            </p>
            <Link
              href="/"
              className="bg-lex-navy text-white font-body text-[13px] font-bold uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-lex-navy/90 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          /* ── Wizard Steps ─────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-14 relative mt-4">
              <div className="absolute left-0 right-0 top-4 h-[2px] bg-lex-smoke -z-10" />
              <div
                className="absolute left-0 top-4 h-[2px] bg-lex-gold -z-10 transition-all duration-normal"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              {(['Personal', 'Matter', 'Schedule'] as const).map((label, idx) => {
                const num = idx + 1;
                return (
                  <div key={label} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-[12px] font-bold transition-all duration-normal border-2 ${
                      step > num
                        ? 'bg-lex-gold border-lex-gold text-lex-navy'
                        : step === num
                        ? 'bg-white border-lex-gold text-lex-gold'
                        : 'bg-white border-lex-navy/20 text-lex-slate'
                    }`}>
                      {step > num ? <CheckCircle2 size={15} /> : num}
                    </div>
                    <span className={`font-body text-[10px] uppercase tracking-wider font-bold ${
                      step >= num ? 'text-lex-navy' : 'text-lex-slate/40'
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Inline Step Validation Errors */}
            {stepErrors.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-sm p-4 animate-in slide-in-from-top-2 duration-fast">
                {stepErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-[13px] text-red-700">{err}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Step 1: Personal Details ─────────────────────────────── */}
              {step === 1 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-normal space-y-5">
                  <div>
                    <h3 className="font-display text-[28px] font-bold text-lex-navy mb-1">Your Details</h3>
                    <p className="font-body text-[14px] text-lex-slate">Please provide your primary contact information.</p>
                  </div>
                  {[
                    { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. Jane Adaobi' },
                    { label: 'Corporate Email', field: 'email', type: 'email', placeholder: 'jane@company.com' },
                    { label: 'Direct Phone', field: 'phone', type: 'tel', placeholder: '+234 800 000 0000' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="block font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-2">{label}</label>
                      <input
                        type={type}
                        value={formData[field as keyof typeof formData]}
                        onChange={e => update(field, e.target.value)}
                        className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:ring-0 focus:bg-white rounded-sm font-body text-[15px] p-4 text-lex-navy transition-all"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Step 2: Matter Profile ───────────────────────────────── */}
              {step === 2 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-normal space-y-5">
                  <div>
                    <h3 className="font-display text-[28px] font-bold text-lex-navy mb-1">Matter Profile</h3>
                    <p className="font-body text-[14px] text-lex-slate">Provide a brief overview of the legal matter.</p>
                  </div>

                  <div>
                    <label className="block font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-2">Primary Practice Area</label>
                    <select
                      value={formData.caseType}
                      onChange={e => update('caseType', e.target.value)}
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:ring-0 focus:bg-white rounded-sm font-body text-[15px] p-4 text-lex-navy appearance-none transition-all"
                    >
                      <option value="" disabled>Select Practice Area</option>
                      <option value="corporate">Corporate Structuring &amp; M&amp;A</option>
                      <option value="litigation">Commercial Litigation</option>
                      <option value="compliance">Regulatory Compliance</option>
                      <option value="employment">Employment &amp; Labour</option>
                      <option value="ip">Intellectual Property</option>
                      <option value="realestate">Real Estate &amp; Property</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-2">Jurisdiction</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-lex-slate" />
                      </div>
                      <input
                        type="text"
                        value={formData.jurisdiction}
                        onChange={e => update('jurisdiction', e.target.value)}
                        className="w-full pl-12 bg-lex-smoke border border-transparent focus:border-lex-gold focus:ring-0 focus:bg-white rounded-sm font-body text-[15px] p-4 text-lex-navy transition-all"
                        placeholder="e.g. Lagos, Nigeria"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                      Executive Brief
                      <span className="ml-2 font-normal normal-case tracking-normal text-lex-slate text-[11px]">
                        ({formData.brief.length}/30 min chars)
                      </span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.brief}
                      onChange={e => update('brief', e.target.value)}
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:ring-0 focus:bg-white rounded-sm font-body text-[14px] p-4 text-lex-navy resize-none transition-all"
                      placeholder="Please omit sensitive specifics at this stage. Describe the nature of your matter and desired outcome…"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: Scheduling ───────────────────────────────────── */}
              {step === 3 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-normal space-y-6">
                  <div>
                    <h3 className="font-display text-[28px] font-bold text-lex-navy mb-1">Preferred Timing</h3>
                    <p className="font-body text-[14px] text-lex-slate">Select a tentative window for our initial consultation.</p>
                  </div>

                  {/* Dynamic Date Picker */}
                  <div>
                    <label className="flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-3">
                      <Calendar size={15} className="text-lex-gold" /> Select Date
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {businessDays.map(({ label, day, full }) => (
                        <button
                          key={full}
                          type="button"
                          onClick={() => update('date', full)}
                          className={`border rounded-sm py-3 text-center cursor-pointer transition-all ${
                            formData.date === full
                              ? 'border-lex-gold bg-lex-gold/10 text-lex-navy shadow-sm'
                              : 'border-lex-navy/10 text-lex-slate hover:border-lex-gold/50 hover:text-lex-navy'
                          }`}
                        >
                          <div className="font-body text-[9px] uppercase font-bold tracking-wider mb-1">{label}</div>
                          <div className="font-display text-[18px] font-bold">{day}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block font-body text-[11px] font-bold uppercase tracking-wider text-lex-navy mb-3">
                      Available Slots (WAT)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => update('time', time)}
                          className={`border rounded-sm py-3 px-2 text-center cursor-pointer font-body text-[14px] font-bold transition-all ${
                            formData.time === time
                              ? 'border-lex-gold bg-lex-gold/10 text-lex-navy shadow-sm'
                              : 'border-lex-navy/10 text-lex-slate hover:border-lex-gold/50 hover:text-lex-navy'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-lex-smoke p-4 border-l-2 border-lex-gold rounded-sm">
                    <p className="font-body text-[12px] text-lex-slate italic leading-relaxed">
                      * Times are in West Africa Time (WAT, UTC+1) and subject to partner availability. We will confirm the exact schedule upon review.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Navigation ──────────────────────────────────────────────── */}
              <div className="flex gap-4 pt-6 border-t border-lex-navy/10 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 py-4 font-body text-[13px] font-bold uppercase tracking-widest text-lex-slate border border-lex-navy/10 hover:border-lex-navy hover:text-lex-navy rounded-sm transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-lex-navy text-white hover:bg-lex-navy/90 font-body text-[13px] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.date || !formData.time}
                    className="flex-1 bg-lex-gold text-lex-navy hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed font-body text-[13px] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Transmitting…</>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                )}
              </div>

              {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-[13px] text-red-700">{submitError}</p>
                </div>
              )}
            </form>

            <div className="mt-10 text-center font-body text-[10px] text-lex-slate uppercase tracking-wider">
              <Lock className="inline-block w-3 h-3 mr-1 text-lex-gold" /> Encrypted Transmission via TLS 1.3
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
