/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Star, 
  MapPin, 
  FileText, 
  Clock, 
  Languages, 
  Stethoscope, 
  Sparkles, 
  CalendarCheck, 
  ArrowRight,
  BookOpen,
  DollarSign,
  X
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  onOpenBookingForDoctor: (doctorId: string, specialty: string) => void;
}

export default function DoctorsView({ doctors, onOpenBookingForDoctor }: DoctorsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDetailedDoctor, setSelectedDetailedDoctor] = useState<Doctor | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');

  // List of all unique specialties (plus 'all')
  const specialtiesList = useMemo(() => {
    return ['all', ...Array.from(new Set(doctors.map(d => d.specialty)))];
  }, [doctors]);

  // Full filter and sort criteria
  const processedDoctors = useMemo(() => {
    const filtered = doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.education.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedSpecialty === 'all' ? true : doc.specialty === selectedSpecialty;
      return matchesSearch && matchesCategory;
    });

    // Sort according to selection
    return [...filtered].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating; // Highest rating first
      }
      if (sortBy === 'fee') {
        return a.consultationFee - b.consultationFee; // Consultation Fee (Low to High)
      }
      if (sortBy === 'experience') {
        return b.experienceYears - a.experienceYears; // Years of experience (High to Low)
      }
      return 0;
    });
  }, [doctors, searchTerm, selectedSpecialty, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header layout */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Verified Clinical Practitioners</h1>
        <p className="text-sm text-slate-400">Search and check verified credentials, languages, and calendar availabilities</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        {/* Search input tool */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search doctors by name, credentials, or symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-600 font-sans shadow-inner"
            aria-label="Search doctors index"
          />
        </div>

        {/* Categories selector dropdown for quick layout */}
        <div className="relative">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 font-sans"
            aria-label="Filter practitioners by department category"
          >
            {specialtiesList.map((spec) => (
              <option key={spec} value={spec} className="bg-slate-950 text-slate-200">
                {spec === 'all' ? 'All Departments' : spec}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 font-sans"
            aria-label="Sort practitioners list"
          >
            <option value="rating" className="bg-slate-950 text-slate-200">★ Highest Rating</option>
            <option value="fee" className="bg-slate-950 text-slate-200">$ Fee: Low to High</option>
            <option value="experience" className="bg-slate-950 text-slate-200">🕒 Years of Experience</option>
          </select>
        </div>
      </div>

      {/* Specialty Pill Quick Buttons (alternative navigation) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
        {specialtiesList.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              selectedSpecialty === spec
                ? 'bg-teal-500 border-teal-500 text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-250 hover:border-slate-700'
            }`}
            aria-label={`Category ${spec}`}
          >
            {spec === 'all' ? 'All Units' : spec}
          </button>
        ))}
      </div>

      {/* Main Grid and Detail Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Doctors searchable Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {processedDoctors.length === 0 ? (
            <div className="col-span-full bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-450 space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold text-base">No clinical practitioners match your filters</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Try modifying your query terms or choose &apos;All Departments&apos; option to expand listings.
              </p>
            </div>
          ) : (
            processedDoctors.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => setSelectedDetailedDoctor(doc)}
                className={`bg-slate-900 border rounded-2xl p-4.5 transition-all duration-300 hover:scale-[1.01] hover:border-teal-500/50 cursor-pointer flex flex-col justify-between h-full ${
                  selectedDetailedDoctor?.id === doc.id ? 'border-teal-500 ring-1 ring-teal-500/10 shadow-lg' : 'border-slate-800'
                }`}
                id={`doc-card-${doc.id}`}
              >
                {/* Header detail */}
                <div className="space-y-3">
                  <div className="flex gap-4.5 items-start">
                    <img 
                      src={doc.photoUrl} 
                      alt={doc.name} 
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-800 shadow-sm"
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1 min-w-0">
                      {/* Availability badge */}
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider mb-1 ${
                        doc.availability === 'Available Today' ? 'bg-teal-900/40 text-teal-300 border border-teal-800/40' :
                        doc.availability === 'Next Available' ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/40' :
                        'bg-slate-800 text-slate-400 border border-slate-700/80'
                      }`}>
                        {doc.availability}
                      </span>
                      
                      <h3 className="text-sm font-bold text-slate-100 truncate leading-none">{doc.name}</h3>
                      <p className="text-xs text-slate-550 truncate font-medium">{doc.specialty} Department</p>
                    </div>
                  </div>

                  {/* Ratings and Stats */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-850 font-mono">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="text-slate-200 font-bold">{doc.rating}</span>
                      <span className="text-slate-600 text-[10px]">({doc.reviewsCount})</span>
                    </div>
                    <div className="h-3 w-px bg-slate-800" />
                    <div>
                      <span className="text-slate-200 font-bold">{doc.experienceYears}y</span>
                      <span className="text-slate-650 text-[10px]"> Exp</span>
                    </div>
                    <div className="h-3 w-px bg-slate-800" />
                    <div>
                      <span className="text-teal-400 font-bold">${doc.consultationFee}</span>
                      <span className="text-slate-650 text-[10px]"> Fee</span>
                    </div>
                  </div>
                </div>

                {/* Bottom line action */}
                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-teal-400 group font-bold">
                  <span>View Details & Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Doctor profiles Sliding Sheet/Drawer summary panel */}
        <div className="lg:col-span-1">
          {selectedDetailedDoctor ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 sticky top-6 animate-fadeIn" id="doctor-details-panel">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" /> Practitioner Bio
                </h3>
                <button 
                  onClick={() => setSelectedDetailedDoctor(null)}
                  className="text-slate-400 hover:text-white"
                  aria-label="unselect doctor"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Bio banner */}
              <div className="text-center space-y-3.5 bg-slate-950 p-5 rounded-2xl border border-slate-850">
                <img 
                  src={selectedDetailedDoctor.photoUrl} 
                  alt={selectedDetailedDoctor.name} 
                  className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-teal-500/20 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-100">{selectedDetailedDoctor.name}</h4>
                  <p className="text-xs text-teal-400 font-semibold">{selectedDetailedDoctor.specialty} Department Lead</p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  {selectedDetailedDoctor.languages.map(l => (
                    <span key={l} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-slate-400 text-[10px] font-mono font-medium rounded-md border border-slate-800">
                      <Languages className="w-3 h-3 text-slate-500" />
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed credentials */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Education & Degree</span>
                  <p className="text-slate-300 font-medium bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                    {selectedDetailedDoctor.education}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Personal Statement</span>
                  <p className="text-slate-450 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/60 font-sans leading-relaxed">
                    {selectedDetailedDoctor.bio}
                  </p>
                </div>
              </div>

              {/* Consultation Info details list */}
              <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Outpatient Consultation Rate:</span>
                  <strong className="text-slate-200 font-mono font-bold">${selectedDetailedDoctor.consultationFee} USD</strong>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Unit Placement:</span>
                  <strong className="text-slate-200 font-sans">{selectedDetailedDoctor.specialty}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Current Schedule:</span>
                  <span className="font-bold text-teal-400">{selectedDetailedDoctor.availability}</span>
                </div>
              </div>

              {/* Book Appointment CTA */}
              <button
                onClick={() => onOpenBookingForDoctor(selectedDetailedDoctor.id, selectedDetailedDoctor.specialty)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-teal-500/10 active:scale-95"
                aria-label={`Schedule digital appointment with ${selectedDetailedDoctor.name}`}
              >
                <CalendarCheck className="w-4.5 h-4.5" />
                Schedule Appointment With Doctor
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center sticky top-6">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Credentials Inspector</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Select any verified medical practitioner from the grid registry on the left to inspect professional boards, scientific publications, degrees, and schedule direct booking lanes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
