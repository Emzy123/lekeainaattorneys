"use client";

import { useTransition, useState } from "react";
import { submitContact, type ContactFormData } from "../actions/contact";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    setError("");
    startTransition(async () => {
      try {
        await submitContact(data);
        setSuccess(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">
      {/* Hero */}
      <section className="bg-lex-navy pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block font-body font-bold text-[11px] tracking-[0.15em] text-lex-gold uppercase mb-6">
            Get In Touch
          </span>
          <h1 className="font-display text-[48px] md:text-[64px] font-bold text-white leading-tight mb-6">
            Contact Us
          </h1>
          <p className="font-body text-[18px] text-white/80 max-w-xl mx-auto leading-relaxed">
            Reach out to our team. We respond to all inquiries within 1–2 business days.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Info */}
        <aside className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="font-display text-[28px] font-bold text-lex-navy mb-6">
              Our Offices
            </h2>
            {[
              { city: "Lagos", addr: "14 Broad Street, Victoria Island, Lagos", phone: "+234 700 000 0000" },
              { city: "Abuja", addr: "Plot 45, Central Business District, Abuja", phone: "+234 700 000 0001" },
            ].map((office) => (
              <div key={office.city} className="mb-6 bg-white border border-lex-navy/10 p-6 rounded-sm shadow-sm">
                <h3 className="font-body text-[11px] font-bold uppercase tracking-widest text-lex-gold mb-3">
                  {office.city}
                </h3>
                <p className="font-body text-[14px] text-lex-slate leading-relaxed mb-2">
                  {office.addr}
                </p>
                <p className="font-body text-[14px] font-bold text-lex-navy">{office.phone}</p>
              </div>
            ))}
          </div>

          <div className="bg-lex-navy text-white p-8 rounded-sm">
            <h3 className="font-display text-[22px] font-bold mb-3">Need Urgent Counsel?</h3>
            <p className="font-body text-[14px] text-white/80 mb-6">
              For time-sensitive legal matters, skip the form and book a direct consultation.
            </p>
            <a
              href="/consultation"
              className="inline-block w-full text-center bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest py-4 hover:bg-amber-400 transition-colors"
            >
              Book Consultation
            </a>
          </div>
        </aside>

        {/* Right: Form */}
        <div className="lg:col-span-8 bg-white border border-lex-navy/10 rounded-sm shadow-sm p-8 md:p-12">
          {success ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-95 duration-normal">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h2 className="font-display text-[28px] font-bold text-lex-navy mb-3">
                Message Received
              </h2>
              <p className="font-body text-[15px] text-lex-slate max-w-md leading-relaxed">
                Thank you for contacting us. A member of our team will respond within 1–2 business days. Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-[28px] font-bold text-lex-navy mb-8">
                Send a Message
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-body text-[14px] rounded-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      type="text"
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:outline-none rounded-sm font-body text-[14px] px-4 py-3 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      required
                      type="email"
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:outline-none rounded-sm font-body text-[14px] px-4 py-3 transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:outline-none rounded-sm font-body text-[14px] px-4 py-3 transition-colors"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      required
                      className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:outline-none rounded-sm font-body text-[14px] px-4 py-3 transition-colors appearance-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Legal Consultation">Legal Consultation</option>
                      <option value="Resource Purchase Support">Resource Purchase Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Media & Press">Media & Press</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="w-full bg-lex-smoke border border-transparent focus:border-lex-gold focus:outline-none rounded-sm font-body text-[14px] px-4 py-3 resize-none transition-colors"
                    placeholder="Briefly describe your matter or inquiry…"
                  />
                </div>

                <p className="font-body text-[12px] text-lex-slate/70">
                  All communications are subject to our Privacy Policy and handled with strict confidentiality.
                </p>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-3 bg-lex-navy text-white font-body text-[13px] font-bold uppercase tracking-widest py-4 hover:bg-lex-navy/90 transition-colors disabled:opacity-60"
                >
                  {isPending ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
