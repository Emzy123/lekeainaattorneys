"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@lex/ui";
import { Menu, X, Scale } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Practice Areas", path: "/practice-areas" },
  { name: "Our Team", path: "/team" },
  { name: "Blog", path: "/blog" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide header on the consultation page (it has its own full-screen layout)
  const isConsultationPage = pathname === "/consultation";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isConsultationPage) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-normal ease-lex-standard flex items-center ${
        isScrolled
          ? "bg-lex-navy/97 backdrop-blur-[12px] h-[76px] shadow-md"
          : "bg-transparent h-[80px]"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Scale
            className={`w-7 h-7 transition-colors ${
              isScrolled ? "text-lex-gold" : "text-white group-hover:text-lex-gold"
            }`}
            strokeWidth={1.5}
          />
          <span className="font-display font-bold text-[22px] tracking-wide text-white">
            LEX <span className="font-light opacity-70">Firm</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`text-white font-body font-normal text-[15px] relative group transition-colors ${
                  isActive ? "text-lex-gold" : "hover:text-lex-gold/80"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-lex-gold transition-all duration-fast ease-lex-standard ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* Premium Resources — highlighted */}
          <Link
            href="/shop"
            className={`text-white font-body font-normal text-[15px] relative group flex items-center gap-2 transition-colors ${
              pathname === "/shop" ? "text-lex-gold" : "hover:text-lex-gold/80"
            }`}
          >
            Resources
            <span className="bg-lex-gold text-lex-navy text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Shop
            </span>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-lex-gold transition-all duration-fast ease-lex-standard ${
                pathname === "/shop" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link href="/consultation">
            <Button variant="default" id="header-book-cta">Book Consultation</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full min-h-screen bg-lex-navy text-white flex flex-col p-8 space-y-5 lg:hidden animate-in fade-in slide-in-from-right-10 duration-normal ease-lex-enter">
          {[...NAV_LINKS, { name: "Premium Resources", path: "/shop" }].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`font-display text-3xl font-bold hover:text-lex-gold transition-colors ${
                pathname === item.path ? "text-lex-gold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-6 border-t border-white/10">
            <Link href="/consultation" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" className="w-full h-14 text-lg" id="mobile-book-cta">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
