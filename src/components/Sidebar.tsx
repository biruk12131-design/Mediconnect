/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  UserRound, 
  Video, 
  FileText, 
  Settings, 
  Menu, 
  X,
  Activity,
  Heart
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  patientName: string;
}

export default function Sidebar({ currentTab, setCurrentTab, isOpen, setIsOpen, patientName }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '#/' },
    { id: 'appointments', name: 'Appointments', icon: Calendar, href: '#/appointments' },
    { id: 'doctors', name: 'Doctors', icon: UserRound, href: '#/doctors' },
    { id: 'consultations', name: 'Consultations', icon: Video, href: '#/consultations' },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText, href: '#/prescriptions' },
    { id: 'settings', name: 'Settings', icon: Settings, href: '#/settings' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    window.location.hash = tabId === 'dashboard' ? '/' : `/${tabId}`;
    setIsOpen(false); // Close mobile sidebar if open
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          id="sidebar-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="main-sidebar"
        className={`fixed inset-y-0 left-0 bg-slate-950 text-slate-100 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col border-r border-slate-800`}
      >
        {/* Header Branding */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500 rounded-lg text-slate-950 shadow-md shadow-teal-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              MediConnect
            </span>
          </div>
          <button 
            type="button"
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest font-sans">
            Menu Registry
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                id={`sidebar-link-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-teal-600/90 text-white shadow-lg shadow-teal-700/20 font-medium' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
                aria-label={item.name}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                }`} />
                <span className="font-sans text-sm">{item.name}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Quick Medical Card Status */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Telemetry Live</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Medical ID: <strong className="text-teal-300 font-mono">MC-2026-94</strong>
          </p>
          <div className="mt-2.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full w-4/5" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Patient Health Profile (80% Complete)</span>
        </div>

        {/* Patient Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm tracking-wide shadow-md">
            {patientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate font-sans">
              {patientName}
            </p>
            <span className="text-[11px] font-medium text-teal-400 block tracking-tight">
              Premium Care Elite
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
