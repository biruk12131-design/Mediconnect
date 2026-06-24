/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, Heart, Search, Bell, Activity, Clock, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AppointmentsView from './components/AppointmentsView';
import DoctorsView from './components/DoctorsView';
import ConsultationsView from './components/ConsultationsView';
import PrescriptionsView from './components/PrescriptionsView';
import SettingsView from './components/SettingsView';

import { Doctor, Appointment, Prescription, ActivityLog, ChatMessage } from './types';
import { 
  DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_ACTIVITIES, 
  CHAT_HISTORY 
} from './lib/data';

export default function App() {
  // Master state parameters
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [patientName, setPatientName] = useState('Elias Abdulhamid');

  // Multi-state models for persistence
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Direct reference doctor currently active in the consultation room
  const [consultDoctor, setConsultDoctor] = useState<Doctor>(DOCTORS[0]);

  // Appointment Modal trigger state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Sync state initialization with localStorage supporting immediate fallback
  useEffect(() => {
    // 1. Theme recovery
    const savedTheme = localStorage.getItem('medi-connect-theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Patient Profile recovery
    const savedName = localStorage.getItem('medi-connect-name');
    if (savedName) setPatientName(savedName);

    // 3. Appointments state recovery
    const cachedAppts = localStorage.getItem('medi-connect-appointments');
    if (cachedAppts) {
      setAppointments(JSON.parse(cachedAppts));
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
    }

    // 4. Prescriptions recovery
    const cachedRx = localStorage.getItem('medi-connect-prescriptions');
    if (cachedRx) {
      setPrescriptions(JSON.parse(cachedRx));
    } else {
      setPrescriptions(INITIAL_PRESCRIPTIONS);
    }

    // 5. Activities recovery
    const cachedActs = localStorage.getItem('medi-connect-activities');
    if (cachedActs) {
      setActivities(JSON.parse(cachedActs));
    } else {
      setActivities(INITIAL_ACTIVITIES);
    }

    // 6. Chat recovery
    const cachedChat = localStorage.getItem('medi-connect-chat');
    if (cachedChat) {
      setChatHistory(JSON.parse(cachedChat));
    } else {
      setChatHistory(CHAT_HISTORY);
    }

    // Hash router sync
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash && ['dashboard', 'appointments', 'doctors', 'consultations', 'prescriptions', 'settings'].includes(hash)) {
        setCurrentTab(hash);
      } else {
        setCurrentTab('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state back to persistent caches
  useEffect(() => {
    if (appointments.length) localStorage.setItem('medi-connect-appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (prescriptions.length) localStorage.setItem('medi-connect-prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    if (activities.length) localStorage.setItem('medi-connect-activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    if (chatHistory.length) localStorage.setItem('medi-connect-chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (patientName) localStorage.setItem('medi-connect-name', patientName);
  }, [patientName]);

  // Actions
  const handleAddNewAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);

    // Create dynamic activity ledger logs on success entry
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'appointment_confirmed',
      title: `Intake Scheduled with ${newApt.doctorName}`,
      description: `Tele-consultation approved for ${newApt.date} at ${newApt.time}.`,
      timestamp: 'Just now'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleRequestRxRenewal = (rxId: string) => {
    let medicName = '';
    
    setPrescriptions(prev => prev.map(p => {
      if (p.id === rxId) {
        medicName = p.medication;
        return { ...p, status: 'Pending Renewal' };
      }
      return p;
    }));

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'prescription_requested',
      title: 'Renewal requested',
      description: `Authorization pending for ${medicName || 'your medication'}.`,
      timestamp: 'Just now'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleSendPatientChatMessage = (newMsg: ChatMessage) => {
    setChatHistory(prev => [...prev, newMsg]);
  };

  // Select doctor and trigger booking wizard shortcut
  const handleOpenBookingForDoctor = (doctorId: string, specialty: string) => {
    const doc = DOCTORS.find(d => d.id === doctorId);
    if (doc) {
      setConsultDoctor(doc);
    }
    setCurrentTab('appointments');
    window.location.hash = '/appointments';
    setIsBookingModalOpen(true);
  };

  const handleNavigateDirect = (tabId: string) => {
    setCurrentTab(tabId);
    window.location.hash = tabId === 'dashboard' ? '/' : `/${tabId}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* 🚀 Skip to main content links */}
      <a 
        href="#main-content font-bold font-sans" 
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-teal-500 text-slate-950 px-4 py-2 rounded-lg font-sans shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        Skip to main content
      </a>

      {/* Global collpapsible sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        patientName={patientName}
      />

      {/* Primary screen frame layout */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 bg-slate-950">
        
        {/* Top telemetry location and quick notifications navbar */}
        <header className="h-16 border-b border-slate-850 bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Open clinical control catalog menu"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Virtual Simulated Browser Address bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-850 rounded-lg text-xs tracking-tight font-mono text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>https://mediconnect.health/{currentTab === 'dashboard' ? '' : currentTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick telemetry alerts indicator */}
            <button 
              type="button" 
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 relative"
              aria-label="Patient electronic notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            </button>

            {/* Live UTC Telemetry clock */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Session Time (UTC)</span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5">10:18 AM</span>
            </div>
          </div>
        </header>

        {/* Master Active Content Section */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950">
          
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Render subcomponents dynamically based on active telemetry route */}
            {currentTab === 'dashboard' && (
              <DashboardView 
                appointments={appointments}
                prescriptions={prescriptions}
                activities={activities}
                onNavigate={handleNavigateDirect}
                onOpenBookingModal={() => setIsBookingModalOpen(true)}
                patientName={patientName}
              />
            )}

            {currentTab === 'appointments' && (
              <AppointmentsView 
                appointments={appointments}
                doctors={DOCTORS}
                onAddAppointment={handleAddNewAppointment}
                onNavigate={handleNavigateDirect}
                isBookingOpen={isBookingModalOpen}
                setIsBookingOpen={setIsBookingModalOpen}
              />
            )}

            {currentTab === 'doctors' && (
              <DoctorsView 
                doctors={DOCTORS}
                onOpenBookingForDoctor={handleOpenBookingForDoctor}
              />
            )}

            {currentTab === 'consultations' && (
              <ConsultationsView 
                chatHistory={chatHistory}
                onSendMessage={handleSendPatientChatMessage}
                activeDoctor={consultDoctor}
              />
            )}

            {currentTab === 'prescriptions' && (
              <PrescriptionsView 
                prescriptions={prescriptions}
                onRequestRenewal={handleRequestRxRenewal}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                patientName={patientName}
                setPatientName={setPatientName}
              />
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
