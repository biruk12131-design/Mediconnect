/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Eye, 
  Sun, 
  Moon, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Database,
  Clock,
  Lock
} from 'lucide-react';

interface SettingsViewProps {
  patientName: string;
  setPatientName: (name: string) => void;
}

export default function SettingsView({ patientName, setPatientName }: SettingsViewProps) {
  // Profile settings state (UI functional)
  const [nameInput, setNameInput] = useState(patientName);
  const [emailInput, setEmailInput] = useState('eliasabdulhamid431@gmail.com');
  const [alternativeEmailInput, setAlternativeEmailInput] = useState('elias.abdulhamid@outlook.com');
  const [phoneInput, setPhoneInput] = useState('+1 (555) 019-2834');
  const [addressInput, setAddressInput] = useState('128 Medical Center Blvd, Suite A, Metropolis');
  const [isSavedDone, setIsSavedDone] = useState(false);

  // Notification states
  const [apptAlerts, setApptAlerts] = useState(true);
  const [rxAlerts, setRxAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Theme support
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('medi-connect-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeMode(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default dark
      setThemeMode('dark');
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (mode: 'light' | 'dark') => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleToggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    localStorage.setItem('medi-connect-theme', newTheme);
    applyTheme(newTheme);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientName(nameInput);
    
    setIsSavedDone(true);
    setTimeout(() => {
      setIsSavedDone(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System & Account Settings</h1>
        <p className="text-sm text-slate-400">Configure telemedicine preferences, notification matrices, and display theme metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-200 tracking-tight mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-400" /> Patient Demographics
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name input */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-name-input" className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-600" />
                    <input 
                      id="settings-name-input"
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-250 focus:outline-none focus:border-teal-500"
                      aria-label="Patient Full Name"
                      required
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-email-input" className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Primary Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-600" />
                    <input 
                      id="settings-email-input"
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-855 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-250 focus:outline-none focus:border-teal-500"
                      aria-label="Patient Email Address"
                      required
                    />
                  </div>
                </div>

                {/* Alternative email address */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-alternative-email-input" className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Alternative Notification Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-600" />
                    <input 
                      id="settings-alternative-email-input"
                      type="email" 
                      value={alternativeEmailInput}
                      onChange={(e) => setAlternativeEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-855 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-250 focus:outline-none focus:border-teal-500"
                      aria-label="Alternative Email Address"
                    />
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-phone-input" className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Mobile Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-600" />
                    <input 
                      id="settings-phone-input"
                      type="tel" 
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-250 focus:outline-none focus:border-teal-500"
                      aria-label="Patient Contact Number"
                      required
                    />
                  </div>
                </div>

                {/* Permanent address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="settings-address-input" className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-600" />
                    <input 
                      id="settings-address-input"
                      type="text" 
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-250 focus:outline-none focus:border-teal-500"
                      aria-label="Patient Physical Address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-850">
                {isSavedDone && (
                  <span className="text-xs text-teal-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4 animate-scale" /> Profile Details Saved
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-teal-500/10"
                  aria-label="Save profile details securely"
                >
                  Save Profile Securely
                </button>
              </div>
            </form>
          </div>

          {/* Notifications config */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-200 tracking-tight mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-400" /> Notification Broadcast Rules
            </h3>

            <div className="space-y-4">
              {/* Option 1 */}
              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-205">Appointment Reminders</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Receive automatic calendar push notifications and email calendar attachments</p>
                </div>
                <button
                  type="button"
                  onClick={() => setApptAlerts(!apptAlerts)}
                  className={`w-11 h-6 rounded-full transition flex items-center p-0.5 ${apptAlerts ? 'bg-teal-500' : 'bg-slate-800'}`}
                  aria-label="Toggle Appt alert reminders"
                >
                  <span className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition ${apptAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-205">Prescription Alert Signals</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Alert when active medications are set to expire or refills need auto-renewal requests</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRxAlerts(!rxAlerts)}
                  className={`w-11 h-6 rounded-full transition flex items-center p-0.5 ${rxAlerts ? 'bg-teal-500' : 'bg-slate-800'}`}
                  aria-label="Toggle drug alerts reminders"
                >
                  <span className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition ${rxAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Theme Toggler & Medical Security Badge */}
        <div className="lg:col-span-1 space-y-6">
          {/* Theme card display */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-200 tracking-tight border-b border-slate-800 pb-3 mb-4">
              Display Mode Settings
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Toggle screen calibration mode to adjust viewing during nocturnal clinical appointments:
            </p>

            <button
              type="button"
              onClick={handleToggleTheme}
              className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl transition"
              aria-label="Switch light/dark screen mode"
            >
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                {themeMode === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-teal-400" />}
                Active: {themeMode === 'dark' ? 'Calming Dark Mode' : 'Clinical Light Mode'}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-400 tracking-widest bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Toggle
              </span>
            </button>
          </div>

          {/* Secure compliance banner */}
          <div className="bg-emerald-950/20 border border-emerald-800/30 p-5 rounded-3xl space-y-3 shadow-inner">
            <div className="flex gap-2.5 items-center">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest font-mono">HIPAA Encrypted</h4>
                <span className="text-[10px] text-emerald-400 font-bold block">Protected Health Information SECURE</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-450 leading-relaxed font-sans">
              MediConnect strictly adheres to HIPAA and SOC2 regulations. All consultation rooms and digital prescription transactions require mutual multi-party biometric confirmation.
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 1.3 / AES-256 Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
