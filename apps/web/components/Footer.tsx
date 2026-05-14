import Link from 'next/link';
import { Scale, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const NAV_COLUMNS = [
  {
    heading: 'Practice Areas',
    links: [
      { label: 'Corporate &amp; M&amp;A', href: '/practice-areas' },
      { label: 'Commercial Litigation', href: '/practice-areas' },
      { label: 'Regulatory Compliance', href: '/practice-areas' },
      { label: 'Employment Law', href: '/practice-areas' },
      { label: 'Real Estate', href: '/practice-areas' },
    ],
  },
  {
    heading: 'The Firm',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Blog &amp; Insights', href: '/blog' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'FAQs', href: '/faq' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Premium Shop', href: '/shop' },
      { label: 'Legal Templates', href: '/shop' },
      { label: 'Compliance Frameworks', href: '/shop' },
      { label: 'Book Consultation', href: '/consultation' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lex-navy text-white">
      {/* ── Upper Footer ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Scale className="w-8 h-8 text-lex-gold" strokeWidth={1.5} />
              <span className="font-display text-2xl font-bold tracking-wide text-white">
                LEX <span className="font-light">Firm</span>
              </span>
            </Link>
            <p className="font-body text-[14px] text-white/60 leading-[1.8] max-w-xs">
              Global-standard legal infrastructure for corporations, institutions, and high-net-worth individuals navigating complex matters.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-2">
              <a href="tel:+2348000000000" className="flex items-center gap-3 font-body text-[13px] text-white/60 hover:text-lex-gold transition-colors">
                <Phone size={14} className="text-lex-gold flex-shrink-0" />
                +234 800 000 0000
              </a>
              <a href="mailto:counsel@lexfirm.com" className="flex items-center gap-3 font-body text-[13px] text-white/60 hover:text-lex-gold transition-colors">
                <Mail size={14} className="text-lex-gold flex-shrink-0" />
                counsel@lexfirm.com
              </a>
              <div className="flex items-start gap-3 font-body text-[13px] text-white/60">
                <MapPin size={14} className="text-lex-gold flex-shrink-0 mt-0.5" />
                <span>12 Victoria Island Boulevard,<br />Lagos, Nigeria</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-sm border border-white/10 flex items-center justify-center text-white/50 hover:border-lex-gold hover:text-lex-gold transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {NAV_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-lex-gold mb-5">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-[13px] text-white/55 hover:text-white transition-colors"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gold Divider ──────────────────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-lex-gold/40 to-transparent" />

      {/* ── Lower Footer ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-[12px] text-white/40">
          © {year} LEX Platform. All rights reserved. Registered with the Nigerian Bar Association.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-body text-[11px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-wider"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
