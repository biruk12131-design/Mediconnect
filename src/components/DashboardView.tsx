/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Video, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Heart,
  Clock, 
  Stethoscope, 
  AlertCircle, 
  MessageSquare,
  CheckCircle2,
  CalendarDays,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Appointment, Prescription, ActivityLog } from '../types';

// Simulated health historical dataset
const weightData = [
  { name: 'Wk 1', weight: 79.2 },
  { name: 'Wk 2', weight: 78.8 },
  { name: 'Wk 3', weight: 78.5 },
  { name: 'Wk 4', weight: 78.1 },
  { name: 'Wk 5', weight: 77.8 },
  { name: 'Wk 6', weight: 77.4 },
  { name: 'Wk 7', weight: 77.0 }
];

const bpData = [
  { name: 'May 24', systolic: 122, diastolic: 80 },
  { name: 'May 25', systolic: 120, diastolic: 78 },
  { name: 'May 26', systolic: 124, diastolic: 81 },
  { name: 'May 27', systolic: 119, diastolic: 79 },
  { name: 'May 28', systolic: 121, diastolic: 80 },
  { name: 'May 29', systolic: 118, diastolic: 77 },
  { name: 'May 30', systolic: 117, diastolic: 76 }
];

const activityData = [
  { name: 'Mon', steps: 7800, goal: 8000 },
  { name: 'Tue', steps: 9200, goal: 8000 },
  { name: 'Wed', steps: 6500, goal: 8000 },
  { name: 'Thu', steps: 8400, goal: 8000 },
  { name: 'Fri', steps: 10500, goal: 8000 },
  { name: 'Sat', steps: 11200, goal: 8000 },
  { name: 'Sun', steps: 8900, goal: 8000 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 text-white border border-slate-800 px-3 py-2 rounded-xl text-xs shadow-xl min-w-[125px] font-sans">
        <p className="font-semibold text-slate-400 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any, i: number) => (
            <div key={i} className="font-bold flex justify-between items-center gap-4">
              <span style={{ color: pld.color }} className="text-[11px] flex items-center gap-1">
                <span>●</span> {pld.name}:
              </span>
              <span className="text-slate-100">{pld.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface DashboardViewProps {
  appointments: Appointment[];
  prescriptions: Prescription[];
  activities: ActivityLog[];
  onNavigate: (tabId: string) => void;
  onOpenBookingModal: () => void;
  patientName: string;
}

export default function DashboardView({ 
  appointments, 
  prescriptions, 
  activities, 
  onNavigate, 
  onOpenBookingModal,
  patientName
}: DashboardViewProps) {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'weight' | 'bp' | 'activity' | 'heart'>('weight');

  // Real-time Heart Rate Variation (HRV) data syncing with the consultation view's simulated telemetry
  const [currentHR, setCurrentHR] = useState(72);
  const [hrvData, setHrvData] = useState<any[]>([
    { name: '10:59:40', hr: 71 },
    { name: '10:59:44', hr: 73 },
    { name: '10:59:48', hr: 70 },
    { name: '10:59:52', hr: 72 },
    { name: '10:59:56', hr: 74 },
    { name: '11:00:00', hr: 72 }
  ]);

  // High heart rate warning alert modal states
  const [showHighHRAlert, setShowHighHRAlert] = useState(false);
  const [alertHRValue, setAlertHRValue] = useState<number | null>(null);
  const [hasDismissedAlert, setHasDismissedAlert] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setCurrentHR(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        let next = prev + delta;
        
        // 15% probability of spike upwards to test or demonstrate immediate alert triggers (>90 BPM)
        if (Math.random() > 0.85) {
          next = Math.floor(Math.random() * 15) + 84; // ranges from 84 to 99 BPM
        }
        
        const finalVal = next > 105 ? 100 : next < 55 ? 60 : next;
        
        // Update historical slider hrv data
        setHrvData(prevData => {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return [...prevData.slice(1), { name: nowStr, hr: finalVal }];
        });

        return finalVal;
      });
    }, 4000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Monitor physiological parameters to display alert modals
  useEffect(() => {
    if (currentHR > 90) {
      if (!hasDismissedAlert) {
        setShowHighHRAlert(true);
        setAlertHRValue(currentHR);
      }
    } else {
      // Automatic baseline restabilization resets the custom dismissal state
      setHasDismissedAlert(false);
    }
  }, [currentHR, hasDismissedAlert]);

  // Filter useful KPIs
  const upcomingCount = appointments.filter(a => a.status === 'Confirmed').length;
  const activeRxCount = prescriptions.filter(p => p.status === 'Active').length;
  const pendingRenewalRx = prescriptions.filter(p => p.status === 'Pending Renewal').length;

  // Static chart data for appointments by month
  const chartData = [
    { month: 'Jan', count: 2, cases: 'General Consults' },
    { month: 'Feb', count: 4, cases: 'Flu/Ailments' },
    { month: 'Mar', count: 3, cases: 'Cardio Follow-up' },
    { month: 'Apr', count: 5, cases: 'Derm & Physical' },
    { month: 'May', count: 6, cases: 'Seasonal Allergies' },
    { month: 'Jun', count: 4, cases: 'Projected Checkups' },
  ];

  // Calendar dates list for June 2026
  // Days of week: Mon to Sun. May 30, 2026 is Saturday, June 1 is Monday.
  const juneDaysCount = 30;
  const juneAppointments = appointments.filter(a => a.date.startsWith('2026-06'));

  const getDayAppointment = (dayNum: number) => {
    const formattedDate = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    return appointments.find(a => a.date === formattedDate);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Banner Greeting */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl border border-teal-800 p-6 md:p-8 shadow-md">
        <div className="absolute top-0 right-0 -tr-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl" />
        
        <div className="relative max-w-2xl z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Active Care Cycle
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Welcome back, <span className="text-teal-400">{patientName}</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            All primary physiological readings look stabilized since your last check-in. Your next consultation with Dr. Vance is scheduled for June 2.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={onOpenBookingModal}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-semibold text-sm rounded-xl transition duration-200 shadow-lg shadow-teal-500/20 active:scale-95"
              aria-label="Book new consultation appointment"
            >
              Book Appointment
            </button>
            <button 
              onClick={() => onNavigate('consultations')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition duration-200 active:scale-95"
              aria-label="Start virtual medical tele-consultation room"
            >
              Start Consultation
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="dashboard-kpi-grid">
        {/* KPI 1 Appts */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-teal-500/40 transition duration-300 group shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono block">Upcoming Appts</span>
              <p className="text-3xl font-extrabold text-slate-100">{upcomingCount}</p>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl group-hover:bg-teal-500 group-hover:text-slate-900 transition duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Next session: 3 days from now</span>
          </div>
        </div>

        {/* KPI 2 Prescriptions */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-teal-500/40 transition duration-300 group shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono block">Active Prescriptions</span>
              <p className="text-3xl font-extrabold text-slate-100">{activeRxCount}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-slate-900 transition duration-300">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{pendingRenewalRx} refill request pending</span>
          </div>
        </div>

        {/* KPI 3 Messages */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-teal-500/40 transition duration-300 group shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono block">Unread Chats</span>
              <p className="text-3xl font-extrabold text-slate-100">5</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-900 transition duration-300">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>All practitioners online</span>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Pure SVG Bar Chart (Appointments per Month) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">Clinical Checkups Trend</h3>
                <p className="text-xs text-slate-400">Monthly consultation analytics</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-teal-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+25% Growth</span>
              </div>
            </div>

            {/* Simulated Chart Rendering */}
            <div className="h-60 flex items-end justify-between gap-2.5 pt-4 px-2 select-none">
              {chartData.map((data, index) => {
                const maxVal = 8;
                const percentHeight = (data.count / maxVal) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-950 text-white border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-20 shadow-xl whitespace-nowrap min-w-[120px] text-center">
                      <p className="font-bold text-teal-400">{data.count} Consults</p>
                      <p className="text-[10px] text-slate-400">{data.cases}</p>
                    </div>

                    {/* Bar graphic */}
                    <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden h-44 relative flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-teal-600 via-teal-500 to-cyan-400 rounded-t-md hover:brightness-110 active:brightness-95 transition-all duration-500 ease-out origin-bottom"
                        style={{ height: `${percentHeight}%` }}
                      >
                        {/* Overlay shines */}
                        <div className="absolute inset-x-0 top-0 h-4 bg-white/20 blur-[1px]" />
                        {/* Interactive dots */}
                        <div className="absolute top-1 left-1.5 right-1.5 h-0.5 bg-cyan-200/40 rounded-full" />
                      </div>
                    </div>

                    {/* Month Label */}
                    <span className="mt-3 text-xs font-semibold text-slate-400 font-mono tracking-wide group-hover:text-teal-400 transition-colors">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Health Metrics Tracking */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs" id="health-metrics-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">Physiological Metrics</h3>
                <p className="text-xs text-slate-400">Secure real-time diagnostic trackers</p>
              </div>
              {/* Tabs header */}
              <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 index self-start sm:self-auto gap-1">
                <button
                  onClick={() => setActiveMetricTab('weight')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                    activeMetricTab === 'weight'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Filter chart by weight metric"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  Weight
                </button>
                <button
                  onClick={() => setActiveMetricTab('bp')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                    activeMetricTab === 'bp'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Filter chart by blood pressure metric"
                >
                  <Heart className="w-3.5 h-3.5" />
                  BP
                </button>
                <button
                  onClick={() => setActiveMetricTab('activity')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                    activeMetricTab === 'activity'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Filter chart by activity levels"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Activity
                </button>
                <button
                  onClick={() => setActiveMetricTab('heart')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                    activeMetricTab === 'heart'
                      ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/10 animate-pulse'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Filter chart by live heart rate variation telemetry"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Live HR
                </button>
              </div>
            </div>

            {/* Selected metric summary card */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 animate-fadeIn">
              {activeMetricTab === 'weight' && (
                <>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Current Read</span>
                    <p className="text-lg md:text-xl font-bold text-teal-400 mt-1">77.0 kg</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Target</span>
                    <p className="text-lg md:text-xl font-semibold text-slate-300 mt-1">75.0 kg</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Overall Diff</span>
                    <p className="text-lg md:text-xl font-bold text-emerald-450 mt-1">-2.2 kg</p>
                  </div>
                </>
              )}
              {activeMetricTab === 'bp' && (
                <>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Latest Pulse</span>
                    <p className="text-lg md:text-xl font-bold text-teal-400 mt-1">117/76 mmHg</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Assessment</span>
                    <span className="inline-flex mt-1.5 items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider">
                      Optimal
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Daily Avg</span>
                    <p className="text-lg md:text-xl font-bold text-slate-300 mt-1">120/78</p>
                  </div>
                </>
              )}
              {activeMetricTab === 'activity' && (
                <>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Today</span>
                    <p className="text-lg md:text-xl font-bold text-teal-400 mt-1">8,900 steps</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Daily Goal</span>
                    <p className="text-lg md:text-xl font-semibold text-slate-300 mt-1">8,000 steps</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Performance</span>
                    <p className="text-lg md:text-xl font-bold text-emerald-450 mt-1">+11.2%</p>
                  </div>
                </>
              )}
              {activeMetricTab === 'heart' && (
                <>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Live Pulse</span>
                    <p className="text-lg md:text-xl font-bold text-red-500 mt-1 flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                      <span>{currentHR}</span>
                      <span className="text-xs text-slate-400 font-normal font-sans">BPM</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Status</span>
                    <span className="inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider">
                      Synchronized
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold block">Target Rhythm</span>
                    <p className="text-lg md:text-xl font-bold text-slate-300 mt-1">Normal Sinus</p>
                  </div>
                </>
              )}
            </div>

            {/* Recharts LineChart container */}
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    (activeMetricTab === 'weight' ? weightData :
                     activeMetricTab === 'bp' ? bpData :
                     activeMetricTab === 'activity' ? activityData :
                     hrvData) as any[]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(148, 163, 184, 0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    dy={8}
                    className="font-mono font-medium"
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    domain={
                      activeMetricTab === 'weight' ? [76, 80] : 
                      activeMetricTab === 'bp' ? [65, 135] : 
                      activeMetricTab === 'heart' ? [60, 90] : 
                      [0, 13000]
                    }
                    dx={-8}
                    className="font-mono font-medium"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {activeMetricTab === 'weight' && (
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Weight (kg)"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#14b8a6', strokeWidth: 1, fill: '#0f172a' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#14b8a6' }}
                    />
                  )}
                  {activeMetricTab === 'bp' && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        name="Systolic (mmHg)"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: '#14b8a6', strokeWidth: 1, fill: '#0f172a' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#14b8a6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        name="Diastolic (mmHg)"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: '#0ea5e9', strokeWidth: 1, fill: '#0f172a' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                      />
                    </>
                  )}
                  {activeMetricTab === 'activity' && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="steps"
                        name="Steps Count"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: '#10b981', strokeWidth: 1, fill: '#0f172a' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                      />
                      <Line
                        type="monotone"
                        strokeDasharray="5 5"
                        dataKey="goal"
                        name="Daily Goal"
                        stroke="rgba(148, 163, 184, 0.4)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                      />
                    </>
                  )}
                  {activeMetricTab === 'heart' && (
                    <Line
                      type="monotone"
                      dataKey="hr"
                      name="Pulse (BPM)"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#ef4444', strokeWidth: 1, fill: '#0f172a' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">Recent Activity Feed</h3>
                <p className="text-xs text-slate-400">Updates from your clinical circle</p>
              </div>
              <button 
                onClick={() => onNavigate('appointments')}
                className="text-xs text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 font-semibold group"
                aria-label="View all scheduled appointments"
              >
                All Schedules
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/50 space-y-3 pt-1">
              {activities.slice(0, 4).map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex gap-3.5 pt-3 first:pt-0 animate-fadeIn opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: `${index * 125}ms` }}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    activity.type === 'appointment_confirmed' ? 'bg-teal-500/10 text-teal-400' :
                    activity.type === 'prescription_renewed' ? 'bg-cyan-500/10 text-cyan-400' :
                    activity.type === 'message_received' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {activity.type === 'appointment_confirmed' ? <CalendarDays className="w-4 h-4" /> :
                     activity.type === 'prescription_renewed' ? <FileText className="w-4 h-4" /> :
                     activity.type === 'message_received' ? <MessageSquare className="w-4 h-4" /> :
                     <Stethoscope className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-slate-200 leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {activity.description}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono text-right font-medium self-start mt-0.5 shrink-0">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Mini Calendar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 tracking-tight">Interactive Care Calendar</h3>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md font-sans">
                June 2026
              </span>
            </div>

            {/* Days table */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>

            {/* Days grid for June 2026 */}
            {/* June 1 2026 is a Monday (let's assume starting cell offset = 0) */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: juneDaysCount }).map((_, idx) => {
                const dayNum = idx + 1;
                const appt = getDayAppointment(dayNum);
                const isSelected = selectedCalendarDate === `2026-06-${dayNum.toString().padStart(2, '0')}`;
                
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      if (appt) {
                        setSelectedCalendarDate(appt.date);
                      } else {
                        setSelectedCalendarDate(null);
                      }
                    }}
                    className={`h-9 w-9 text-xs rounded-lg flex flex-col items-center justify-center relative font-medium transition duration-150 ${
                      appt 
                        ? 'bg-teal-950 text-teal-300 border border-teal-500/60 font-semibold hover:bg-teal-900 shadow-sm shadow-teal-500/5' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    } ${isSelected ? 'ring-2 ring-cyan-400 bg-teal-900' : ''}`}
                    aria-label={`June ${dayNum}, 2026 ${appt ? '- Appointment scheduled' : ''}`}
                  >
                    <span>{dayNum}</span>
                    {appt && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Selected Calendar Card details */}
            {selectedCalendarDate ? (
              (() => {
                const activeAppt = appointments.find(a => a.date === selectedCalendarDate);
                if (!activeAppt) return null;
                return (
                  <div className="mt-4 p-3 bg-teal-950/40 border border-teal-500/20 rounded-xl space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-xs font-bold text-teal-300 font-sans">Active Appointment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={activeAppt.doctorPhoto} 
                        alt={activeAppt.doctorName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-200 leading-none">{activeAppt.doctorName}</p>
                        <span className="text-[10px] text-slate-400">{activeAppt.doctorSpecialty}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300 flex justify-between font-mono font-medium">
                      <span>Time: {activeAppt.time}</span>
                      <span>Date: {activeAppt.date}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('appointments')}
                      className="w-full py-1 text-[11px] text-center bg-teal-800 text-teal-200 rounded-md font-semibold hover:bg-teal-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="mt-4 p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500">
                  Click a highlighted date above to check booked session details.
                </p>
              </div>
            )}
          </div>

          {/* Quick Doctor Consultation Slot Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex gap-3.5 items-center">
            <div className="p-3 bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 rounded-xl shrink-0 shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Immediate Triage</h4>
              <p className="text-sm font-bold text-slate-200 mt-0.5 leading-tight">Emergency? Call Emergency services or start an instant 24/7 tele-triage consult.</p>
              <button 
                onClick={() => onNavigate('consultations')}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 mt-1.5"
              >
                Access Triage Room
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High Heart Rate Warning alert modal */}
      {showHighHRAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2.5 bg-red-500/15 rounded-xl border border-red-500/30">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm md:text-base">High Heart Rate Detected</h4>
                <p className="text-[10px] font-mono uppercase tracking-wider text-red-500 font-bold">Clinical Triage Alert</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Your real-time physiological tracker recorded an elevated resting spike at <span className="font-bold text-slate-100 font-mono text-xs bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">{alertHRValue} BPM</span>. Rest-baseline normal heart rhythm is typically 60-90 BPM.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block mb-1">Recommended Response Action:</span>
              <p>● Breathe slowly and sit in an upright position.</p>
              <p>● Sip small volumes of normal room-temperature water.</p>
              <p>● Access the Telemedicine Consultation Chamber if symptoms linger.</p>
            </div>

            <div className="flex gap-2.5">
              <button 
                type="button"
                onClick={() => {
                  onNavigate('consultations');
                  setShowHighHRAlert(false);
                  setHasDismissedAlert(true);
                }}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:from-teal-600 hover:to-cyan-600 transition"
              >
                Consult Chamber
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowHighHRAlert(false);
                  setHasDismissedAlert(true);
                }}
                className="px-4 py-2 bg-slate-800 text-slate-350 hover:text-slate-250 text-xs font-semibold rounded-xl transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
