"use client";

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Type, Palette, Hexagon, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';

export default function BrandIdentityManager() {
  const [activeTab, setActiveTab] = useState('identity');

  // Mock State
  const [firmName, setFirmName] = useState('LEX Platform');
  const [primaryColor, setPrimaryColor] = useState('#0A1628');
  const [accentColor, setAccentColor] = useState('#C9A84C');
  const [headingFont, setHeadingFont] = useState('Playfair Display');
  const [bodyFont, setBodyFont] = useState('Lato');
  const [primaryLogo, setPrimaryLogo] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-lex-content-area animate-in fade-in duration-normal">
      
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-bold text-lex-navy">Brand Identity</h1>
        <p className="font-body text-[14px] text-lex-slate">Manage your firm's global visual identity tokens.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Content Area (60%) */}
        <div className="w-full lg:w-[60%] space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-lex-navy/10 gap-8">
            {[
              { id: 'identity', label: 'Identity', icon: Hexagon },
              { id: 'colours', label: 'Colours', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-body text-[14px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors relative ${activeTab === tab.id ? 'text-lex-gold' : 'text-lex-slate hover:text-lex-navy'}`}
              >
                <tab.icon size={16} /> {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-lex-gold rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-sm border border-lex-navy/10 p-8 shadow-sm min-h-[500px]">
            
            {activeTab === 'identity' && (
              <div className="space-y-8 animate-in fade-in duration-fast">
                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Firm Name</label>
                  <input 
                    type="text" 
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-white border border-lex-navy/20 rounded-sm px-4 py-3 font-display text-[24px] font-bold text-lex-navy focus:border-lex-gold focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Primary Logo</label>
                  <ImageUpload 
                    value={primaryLogo} 
                    onChange={setPrimaryLogo} 
                    label="Primary Logo"
                  />
                </div>

                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Favicon Generation</label>
                  <div className="flex gap-4 p-6 border border-lex-navy/10 rounded-sm bg-lex-smoke/50 items-center">
                    <div className="w-16 h-16 bg-lex-gold text-white font-display flex items-center justify-center font-bold text-xl rounded-sm">L</div>
                    <div className="flex flex-col">
                      <span className="font-body text-[12px] font-bold text-lex-navy">Auto-generated</span>
                      <span className="font-body text-[11px] text-lex-slate">16x16, 32x32, 96x96, 180x180</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'colours' && (
              <div className="animate-in fade-in duration-fast">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Primary Swatch */}
                  <div className="border border-lex-navy/10 p-6 rounded-sm">
                    <div className="w-16 h-16 rounded-full border border-black/10 mb-4 shadow-sm" style={{ backgroundColor: primaryColor }}></div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-1">Navy (Primary)</label>
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full bg-lex-smoke border-transparent focus:border-lex-gold rounded-sm font-body text-[14px] px-3 py-2 mb-3 font-mono"
                    />
                    <button className="text-[12px] font-body font-bold text-lex-slate hover:text-lex-gold uppercase tracking-wider">Pick Colour</button>
                  </div>
                  
                  {/* Accent Swatch */}
                  <div className="border border-lex-navy/10 p-6 rounded-sm">
                    <div className="w-16 h-16 rounded-full border border-black/10 mb-4 shadow-sm" style={{ backgroundColor: accentColor }}></div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-1">Gold (Accent)</label>
                    <input 
                      type="text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full bg-lex-smoke border-transparent focus:border-lex-gold rounded-sm font-body text-[14px] px-3 py-2 mb-3 font-mono"
                    />
                    <button className="text-[12px] font-body font-bold text-lex-slate hover:text-lex-gold uppercase tracking-wider">Pick Colour</button>
                  </div>

                  {/* Surface Swatch */}
                  <div className="border border-lex-navy/10 p-6 rounded-sm">
                    <div className="w-16 h-16 rounded-full border border-black/10 mb-4 shadow-sm" style={{ backgroundColor: '#EEF3F8' }}></div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-1">Smoke (Surface)</label>
                    <input disabled value="#EEF3F8" className="w-full bg-lex-smoke opacity-50 border-transparent rounded-sm font-body text-[14px] px-3 py-2 mb-3 font-mono" />
                  </div>
                  
                  {/* Dark Swatch */}
                  <div className="border border-lex-navy/10 p-6 rounded-sm">
                    <div className="w-16 h-16 rounded-full border border-black/10 mb-4 shadow-sm" style={{ backgroundColor: '#152338' }}></div>
                    <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-1">Steel (Dark)</label>
                    <input disabled value="#152338" className="w-full bg-lex-smoke opacity-50 border-transparent rounded-sm font-body text-[14px] px-3 py-2 mb-3 font-mono" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-8 animate-in fade-in duration-fast">
                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Heading Font (Display)</label>
                  <select 
                    value={headingFont}
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full bg-white border border-lex-navy/20 rounded-sm px-4 py-3 font-body text-[16px] text-lex-navy focus:border-lex-gold focus:ring-0"
                  >
                    <option value="Playfair Display">Playfair Display (Serif)</option>
                    <option value="Merriweather">Merriweather (Serif)</option>
                    <option value="Inter">Inter (Sans)</option>
                  </select>
                  <div className="mt-4 p-6 bg-lex-smoke rounded-sm border border-lex-navy/5">
                    <p className="text-[32px] font-bold text-lex-navy" style={{ fontFamily: headingFont }}>Justice Delivered.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Body Font</label>
                  <select 
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full bg-white border border-lex-navy/20 rounded-sm px-4 py-3 font-body text-[16px] text-lex-navy focus:border-lex-gold focus:ring-0"
                  >
                    <option value="Lato">Lato (Sans)</option>
                    <option value="Roboto">Roboto (Sans)</option>
                    <option value="Source Sans Pro">Source Sans Pro (Sans)</option>
                  </select>
                  <div className="mt-4 p-6 bg-lex-smoke rounded-sm border border-lex-navy/5">
                    <p className="text-[16px] text-lex-slate leading-relaxed" style={{ fontFamily: bodyFont }}>
                      Every visual decision must communicate mastery and trustworthiness. Dark, saturated backgrounds anchor the experience with gravitas.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button className="px-6 py-3 font-body text-[14px] font-bold uppercase tracking-wider text-lex-slate hover:text-lex-navy transition-colors">Discard</button>
            <button className="px-6 py-3 font-body text-[14px] font-bold uppercase tracking-wider bg-lex-gold text-lex-navy rounded-sm hover:bg-lex-gold-light transition-colors flex items-center gap-2">
              <CheckCircle2 size={16} /> Save Changes
            </button>
          </div>
        </div>

        {/* Right Sidebar (Live Preview - 40%) */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-24">
            <h3 className="font-body text-[12px] font-bold uppercase tracking-wider text-lex-slate mb-4 flex items-center gap-2">
              <ImageIcon size={14} /> Live Preview
            </h3>
            
            <div className="border border-lex-navy/10 rounded-sm overflow-hidden bg-white shadow-xl shadow-lex-navy/5">
              {/* Mock Web Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10" style={{ backgroundColor: primaryColor }}>
                 <span className="font-bold text-xl text-white" style={{ fontFamily: headingFont }}>{firmName}</span>
                 <div className="hidden sm:flex gap-4">
                   <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                   <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                   <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                 </div>
              </div>

              {/* Mock Web Content */}
              <div className="p-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest mb-2 block" style={{ color: accentColor, fontFamily: bodyFont }}>Expertise</span>
                  <h2 className="text-[28px] font-bold leading-tight mb-4" style={{ color: primaryColor, fontFamily: headingFont }}>
                    Strategic Counsel for Modern Enterprise
                  </h2>
                  <p className="text-[14px] leading-relaxed text-gray-500" style={{ fontFamily: bodyFont }}>
                    Our firm provides comprehensive legal strategies tailored to your specific corporate structure. We believe in proactive defense and decisive action.
                  </p>
                </div>

                <div className="p-5 rounded-sm border border-gray-200">
                  <h4 className="text-[16px] font-bold mb-2" style={{ color: primaryColor, fontFamily: headingFont }}>Consultation Request</h4>
                  <p className="text-[12px] text-gray-500 mb-4" style={{ fontFamily: bodyFont }}>Book a session with our partners.</p>
                  <button className="w-full py-2 rounded-sm font-bold text-[12px] uppercase tracking-wider" style={{ backgroundColor: accentColor, color: primaryColor, fontFamily: bodyFont }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
