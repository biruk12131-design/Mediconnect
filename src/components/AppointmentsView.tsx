/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Video, 
  User, 
  BookOpen, 
  Heart,
  ChevronLeft,
  X,
  Languages
} from 'lucide-react';
import { Appointment, Doctor } from '../types';
import { DOCTORS } from '../lib/data';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onAddAppointment: (appointment: Appointment) => void;
  onNavigate: (tabId: string) => void;
  isBookingOpen: boolean; // Managed by parent to open from anywhere
  setIsBookingOpen: (open: boolean) => void;
}

export default function AppointmentsView({ 
  appointments, 
  doctors, 
  onAddAppointment, 
  onNavigate,
  isBookingOpen,
  setIsBookingOpen
}: AppointmentsViewProps) {
  // Appointment list local filter: 'all' | 'confirmed' | 'completed' | 'cancelled'
  const [activeFilter, setActiveFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Booking Multi-step wizard state
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Static options
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
  const timeSlots = ['09:00 AM', '10:15 AM', '11:30 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'];

  // Filter doctors based on selected specialties
  const filteredDoctorsForBooking = doctors.filter(d => !selectedSpecialty || d.specialty === selectedSpecialty);

  // Handle Close / Reset booking fields
  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setStep(1);
    setSelectedSpecialty('');
    setSelectedDoctorId('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setBookingNotes('');
  };

  // Submit appointment booking
  const handleConfirmBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDoctorId);
    if (!doc) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorPhoto: doc.photoUrl,
      date: selectedDate || '2026-06-10',
      time: selectedTimeSlot || '10:00 AM',
      status: 'Confirmed',
      notes: bookingNotes || 'Virtual wellness monitoring and primary check-up.',
      meetingLink: '#/consultations'
    };

    onAddAppointment(newApt);
    handleCloseBooking();
  };

  // Filter total list
  const filteredAppointments = appointments.filter(apt => 
    activeFilter === 'all' ? true : apt.status === activeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header section with Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Your Clinical Appointments</h1>
          <p className="text-sm text-slate-400">View timeline of historical and upcoming digital sessions</p>
        </div>
        <button 
          onClick={() => {
            setStep(1);
            setIsBookingOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm rounded-xl transition duration-200 shadow-md shadow-teal-500/10 active:scale-95 shrink-0 self-stretch sm:self-auto justify-center"
          aria-label="Book new direct clinical appointment"
        >
          <Plus className="w-4 h-4" />
          Book New Appointment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {(['all', 'Confirmed', 'Completed', 'Cancelled'] as const).map((filterId) => (
          <button
            key={filterId}
            onClick={() => setActiveFilter(filterId)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeFilter === filterId
                ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
            aria-label={`Filter appointments by ${filterId}`}
          >
            {filterId === 'all' ? 'All Appointments' : filterId}
          </button>
        ))}
      </div>

      {/* Grid listing and Detail split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold">No appointments found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active appointments fall into this search category. You can schedule new sessions instantly.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div 
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className={`bg-slate-900 border transition-all duration-300 p-5 rounded-2xl cursor-pointer hover:border-teal-500/40 relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  selectedAppointment?.id === apt.id ? 'border-teal-500 ring-1 ring-teal-500/20' : 'border-slate-800'
                }`}
                id={`apt-card-${apt.id}`}
              >
                {/* Doctor Avatar + Details */}
                <div className="flex items-center gap-4">
                  <img 
                    src={apt.doctorPhoto} 
                    alt={apt.doctorName}
                    className="w-14 h-14 rounded-full object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-100">{apt.doctorName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/80">
                        {apt.doctorSpecialty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400" id={`info-row-${apt.id}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Action Panel */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 border-t border-slate-850 pt-3 md:pt-0 md:border-t-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                    apt.status === 'Confirmed' ? 'bg-teal-900/30 text-teal-400 border border-teal-800/50' :
                    apt.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
                    'bg-slate-800/80 text-slate-400 border border-slate-700'
                  }`}>
                    {apt.status === 'Confirmed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                     apt.status === 'Completed' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> :
                     <XCircle className="w-3.5 h-3.5" />}
                    {apt.status}
                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-500 hidden md:block" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Info Panel Side */}
        <div className="lg:col-span-1">
          {selectedAppointment ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 sticky top-6 animate-fadeIn" id="appointment-details-sidebar">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-200">Appointment Ledger</h3>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="text-slate-400 hover:text-white"
                  aria-label="unselect appointment details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card Summary */}
              <div className="space-y-3.5 text-center bg-slate-950 p-4 rounded-xl border border-slate-800/60 relative">
                <img 
                  src={selectedAppointment.doctorPhoto} 
                  alt={selectedAppointment.doctorName}
                  className="w-18 h-18 rounded-full object-cover border border-teal-500/30 mx-auto shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-md font-bold text-slate-100">{selectedAppointment.doctorName}</h4>
                  <p className="text-xs text-teal-400 font-semibold">{selectedAppointment.doctorSpecialty} Expert</p>
                </div>
                
                <div className="flex justify-center gap-1.5 py-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-850 rounded-lg max-w-[200px] mx-auto">
                  <span>ID: {selectedAppointment.id}</span>
                </div>
              </div>

              {/* Quick Details List */}
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-slate-500 font-medium">Session Format:</span>
                  <span className="font-semibold text-teal-300 flex items-center gap-1">
                    <Video className="w-4 h-4" /> Virtual Consultation
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-slate-500 font-medium">Schedule Date:</span>
                  <span className="font-semibold text-slate-200">{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-slate-500 font-medium">Session Time:</span>
                  <span className="font-semibold text-slate-200">{selectedAppointment.time}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-slate-500 font-medium">Ledger Status:</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                    selectedAppointment.status === 'Confirmed' ? 'text-teal-400 bg-teal-500/10' :
                    selectedAppointment.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10' :
                    'text-slate-400 bg-slate-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Patient Intake Notes */}
              <div className="space-y-1.5 p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Consolidated Notes</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAppointment.notes || "No patient preparation instructions entered by doctor."}
                </p>
              </div>

              {/* Action: Enter Virtual Consultation Room */}
              {selectedAppointment.status === 'Confirmed' ? (
                <button
                  onClick={() => onNavigate('consultations')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-500/15"
                  aria-label="Join online virtual telemedicine consultation clinic room"
                >
                  <Video className="w-4.5 h-4.5" />
                  Join Consultation Room
                </button>
              ) : (
                <div className="p-3 bg-slate-950 text-center border border-slate-850 rounded-xl text-xs text-slate-500">
                  This clinical session has been processed/completed.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center sticky top-6">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Intake Ledger</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Highlight any appointment in the medical list on the left to review checklists, doctors, and initiate secure telemedicine virtual chat chambers.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Multi-step Appointment Booking wizard Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {step}
                </div>
                <h3 className="text-sm font-bold text-slate-200">
                  {step === 1 && 'Step 1: Choose Medical Category'}
                  {step === 2 && 'Step 2: Choose Doctor'}
                  {step === 3 && 'Step 3: Schedule Date/Time'}
                  {step === 4 && 'Step 4: Confirm Telehealth Intake'}
                </h3>
              </div>
              <button 
                onClick={handleCloseBooking}
                className="text-slate-400 hover:text-white"
                aria-label="cancel booking appointment close wizard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Contents */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Step 1: Specialty Option Cards */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium">Select the specialist department required:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {specialties.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialty(spec);
                          setStep(2);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          selectedSpecialty === spec
                            ? 'bg-teal-950/50 border-teal-500 text-teal-300 ring-1 ring-teal-500/20'
                            : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                        }`}
                        aria-label={`Select specialty ${spec}`}
                      >
                        <Heart className="w-4 h-4 text-teal-400 mb-1.5" />
                        <span className="text-sm font-bold block">{spec}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Licensed Practitioners</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Practitioner List */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-medium">Select licensed {selectedSpecialty} doctor:</p>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-xs text-teal-400 hover:underline"
                    >
                      Change Specialty
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {filteredDoctorsForBooking.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setStep(3);
                        }}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition gap-3 ${
                          selectedDoctorId === doc.id
                            ? 'bg-teal-950/50 border-teal-500 text-teal-300'
                            : 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900'
                        }`}
                        aria-label={`Book with doctor ${doc.name}`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={doc.photoUrl} 
                            alt={doc.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-xs font-bold block text-slate-200">{doc.name}</span>
                            <span className="text-[10px] text-teal-400 font-semibold">{doc.education}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-100 font-mono block">${doc.consultationFee}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Fee Rate</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Pick Date/Time */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-medium">Choose a convenient date and active calendar slot:</p>
                  
                  <div className="grid grid-cols-1 gap-3.5">
                    {/* Date Picker */}
                    <div className="space-y-1.5">
                      <label htmlFor="booking-date-picker" className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Select Session Date</label>
                      <input 
                        id="booking-date-picker"
                        type="date"
                        min="2026-05-30"
                        max="2026-07-30"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono block">Available Daily Slots</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-1 rounded-lg border text-center font-mono text-xs font-bold transition ${
                              selectedTimeSlot === slot
                                ? 'bg-teal-900/60 border-teal-500 text-teal-300'
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                            aria-label={`Choose slot ${slot}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Summary Confirm */}
              {step === 4 && (
                <form onSubmit={handleConfirmBookingSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400 font-medium">Confirm your scheduled telemedicine slot specifics:</p>
                  
                  {(() => {
                    const doc = doctors.find(d => d.id === selectedDoctorId);
                    if (!doc) return <p className="text-xs text-rose-400">Doctor not selected.</p>;
                    return (
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <img 
                            src={doc.photoUrl} 
                            alt={doc.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-850 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-200">{doc.name}</p>
                            <span className="text-[10px] text-teal-400">{doc.specialty} department</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono border-t border-slate-850 pt-3">
                          <div>
                            <span className="text-slate-500 block">Scheduled Date:</span>
                            <span className="font-bold text-slate-200">{selectedDate || '2026-06-10'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Scheduled Time:</span>
                            <span className="font-bold text-slate-200">{selectedTimeSlot || '10:00 AM'}</span>
                          </div>
                          <div className="col-span-2 pt-1">
                            <span className="text-slate-500 block">Outpatient Fee rate:</span>
                            <span className="font-bold text-teal-300">${doc.consultationFee} USD (Covered)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Optional Notes Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-notes-input" className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Clinical Intake Notes (Reason/Symptoms)</label>
                    <textarea 
                      id="booking-notes-input"
                      rows={2}
                      placeholder="e.g. Heart health check, seasonal prescription renewals..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-650 resize-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Custom footer buttons */}
            <div className="h-16 px-5 border-t border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  disabled={
                    (step === 1 && !selectedSpecialty) ||
                    (step === 2 && !selectedDoctorId) ||
                    (step === 3 && (!selectedDate || !selectedTimeSlot))
                  }
                  onClick={() => setStep(step + 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleConfirmBookingSubmit(e)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-md"
                >
                  Confirm and Book
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
