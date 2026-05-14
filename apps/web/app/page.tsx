import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@lex/ui";
import { prisma } from "@lex/database";
import Link from "next/link";
import { Metadata } from 'next';
import { Shield, Award, Lock, Scale } from "lucide-react";
import HeroAssessmentForm from "../components/HeroAssessmentForm";

export const metadata: Metadata = {
  title: 'Home | LEX Platform',
  description: 'Justice Delivered. Relentlessly.',
};

export default async function HomePage() {
  const practiceAreas = await prisma.practiceArea.findMany({
    take: 3,
    orderBy: { title: 'asc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-lex-navy">
        {/* Background Image with Navy Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop")', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-lex-navy/90 to-lex-navy/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          
          {/* Left Content (55%) */}
          <div className="w-full lg:w-[55%] space-y-8">
            <div className="inline-block px-3 py-1 bg-lex-gold/10 border border-lex-gold/30 rounded-sm">
              <span className="font-body font-semibold text-[12px] uppercase tracking-[0.12em] text-lex-gold">
                Trusted Legal Excellence
              </span>
            </div>
            
            <h1 className="font-display text-[56px] md:text-[80px] font-black leading-[1.05] text-white">
              <span className="block animate-in fade-in slide-in-from-bottom-6 duration-slower ease-lex-enter">Justice Delivered.</span>
              <span className="block text-lex-gold animate-in fade-in slide-in-from-bottom-6 duration-slower ease-lex-enter delay-100">Relentlessly.</span>
            </h1>
            
            <p className="font-body text-[18px] leading-[1.70] text-white/85 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-slower ease-lex-enter delay-200">
              We provide enterprise-grade digital infrastructure and unparalleled legal expertise to protect your most valuable assets. When the stakes are highest, we are the firm you want in your corner.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-slower ease-lex-enter delay-300">
              <Link href="/consultation">
                <Button size="lg" className="w-full sm:w-auto" id="hero-cta-consultation">
                  Book Free Consultation
                </Button>
              </Link>
              <Link href="/practice-areas">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto" id="hero-cta-practice">
                  Explore Practice Areas
                </Button>
              </Link>
            </div>
            
            {/* Trust Bar */}
            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-slower ease-lex-enter delay-500">
              {[
                { icon: Award, text: "30+ Years of Excellence" },
                { icon: Shield, text: "500+ Cases Won" },
                { icon: Lock, text: "Confidential & Trusted" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-6 h-6 text-lex-gold" />
                  <span className="font-body text-[14px] font-normal text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content - Glass Card (45%) */}
          <div className="w-full lg:w-[40%] animate-in fade-in slide-in-from-bottom-12 duration-dramatic ease-lex-slow">
            <HeroAssessmentForm />
          </div>
          
        </div>
      </section>

      {/* Featured Practice Areas */}
      <section className="py-[120px] px-6 max-w-7xl mx-auto w-full bg-lex-smoke">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="font-body font-bold text-[12px] tracking-[0.12em] text-lex-gold uppercase">Our Competencies</span>
          <h2 className="font-display text-[40px] font-bold tracking-tight text-lex-navy">Areas of Expertise</h2>
          <div className="w-24 h-[2px] bg-lex-gold mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practiceAreas.length === 0 ? (
             <p className="font-body text-lex-slate col-span-3 text-center">No practice areas currently listed.</p>
          ) : (
            practiceAreas.map((area) => (
              <Card key={area.id} className="hover:-translate-y-2 hover:shadow-xl transition-all duration-normal ease-lex-standard border-none rounded-sm group relative overflow-hidden">
                {/* Hover gold border reveal */}
                <div className="absolute inset-0 border-[3px] border-lex-gold opacity-0 group-hover:opacity-100 transition-opacity duration-normal ease-lex-standard rounded-sm pointer-events-none"></div>
                
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-lex-navy flex items-center justify-center mb-6">
                    <Scale className="w-8 h-8 text-lex-gold" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="group-hover:text-lex-gold transition-colors duration-normal">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {area.description || 'Dedicated legal counsel and strategic representation tailored to your business objectives.'}
                  </CardDescription>
                  <div className="mt-8">
                    <Link href={`/practice-areas/${area.slug}`} className="font-body text-lex-navy font-bold uppercase tracking-[0.12em] text-[12px] group-hover:text-lex-gold transition-colors flex items-center gap-2">
                      Learn More <span className="text-lex-gold">→</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-20 text-center">
          <Link href="/practice-areas">
            <Button variant="outlineGold" size="lg" id="home-all-practices-cta">
              View All Practice Areas
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
