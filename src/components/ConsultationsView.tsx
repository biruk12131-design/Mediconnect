/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Send, 
  Sparkles, 
  Activity, 
  Smile, 
  CheckCircle,
  ChevronDown,
  MonitorPlay,
  Heart,
  Stethoscope,
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ChatMessage, Doctor } from '../types';

interface ConsultationsProps {
  chatHistory: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  activeDoctor: Doctor; // e.g. Dr. Vance by default
}

export default function ConsultationsView({ chatHistory, onSendMessage, activeDoctor }: ConsultationsProps) {
  // Call states
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Chat sender
  const [outgoingText, setOutgoingText] = useState('');
  const [chatSearchKeyword, setChatSearchKeyword] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Patient live webcam state (Optional advanced tech feature!)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [camPermissionError, setCamPermissionError] = useState(false);

  // Simulated Doctor's live telemetry indicators
  const [simulatedHeartRate, setSimulatedHeartRate] = useState(72);
  const [simulatedBp, setSimulatedBp] = useState('118/75');

  // Interactive Clinical Notes (UI only)
  const [clinicalNotes, setClinicalNotes] = useState(
    "PATIENT ASSESSMENT NOTES\n---\nSubject: Senior Telemedicine review for Lisinopril adjustment\nSymptoms: Mild transient daylight lightheadedness on Day 2; fully resolved.\nParameters checked:\n- BP: 118/75 mmHg (Steady)\n- Pulse: 72 bpm (Normal sinus)\nAdvice: Maintain daily 3-liters water hydration intake. Continue 10mg morning Lisinopril dosage."
  );

  // Autoscroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle local camera access
  useEffect(() => {
    if (isCallActive && !isCamOff) {
      navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 200 }, audio: false })
        .then(stream => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCamPermissionError(false);
        })
        .catch(err => {
          console.warn('Camera access not provided or unsupported in iframe:', err);
          setCamPermissionError(true);
        });
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive, isCamOff]);

  // Simulate pulse fluctuate
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setSimulatedHeartRate(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next > 82 ? 78 : next < 65 ? 68 : next;
      });
    }, 4000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleSendChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outgoingText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text: outgoingText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(newMsg);
    setOutgoingText('');

    // Simulate doctor quick automated reply to show full responsiveness!
    setTimeout(() => {
      const replies = [
        "Yes, absolutely correct Elias.",
        "Perfect. I have recorded that in your patient intake form.",
        "Please keep tracking that measurement. I am monitoring your telemetry log files.",
        "That is completely regular for this dosage stage."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const docReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'doctor',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSendMessage(docReply);
    }, 2500);
  };

  const handleToggleCall = () => {
    if (isCallActive) {
      // Ending call
      setIsCallActive(false);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    } else {
      // Re-connecting
      setIsCallActive(true);
      setIsMuted(false);
      setIsCamOff(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Telemedicine Consultation Chamber</h1>
        <p className="text-sm text-slate-400">Secure end-to-end clinical virtual video consult tunnel with WebRTC telemetry simulation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Grid: Video Screen and Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative bg-slate-950 aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
            {isCallActive ? (
              <>
                {/* Doctor's Main Camera view */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={activeDoctor.photoUrl} 
                    alt={activeDoctor.name}
                    className="w-full h-full object-cover brightness-[0.7] scale-105 select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Digital overlay scanner lines */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40" />
                  
                  {/* Pulsing signal waveform simulator */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none text-white/90">
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-teal-500/30">
                      <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping shrink-0" />
                      <span className="text-xs font-mono font-bold tracking-wide">Secure WebRTC: ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Patient Picture-in-Picture Local camera frame */}
                <div className="absolute top-4 right-4 w-32 md:w-44 bg-slate-900 aspect-video rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-lg z-10">
                  {isCamOff ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-500 font-mono">
                      <VideoOff className="w-5 h-5 mb-1" />
                      Cam Off
                    </div>
                  ) : camPermissionError ? (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-[9px] text-slate-400 text-center p-2 leading-tight">
                      <div className="w-6 h-6 rounded bg-slate-800 text-teal-400 flex items-center justify-center font-bold font-mono mb-1">
                        PI
                      </div>
                      <span>Elias (Mock Feed)</span>
                    </div>
                  ) : (
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Local identifier overlay */}
                  <div className="absolute bottom-1 left-2 text-[10px] text-white/80 bg-slate-950/60 px-1.5 py-0.5 rounded font-medium">
                    You (Elias)
                  </div>
                </div>

                {/* Top Corner Badge descriptors */}
                <div className="p-4 z-10 flex justify-between items-start pointer-events-none">
                  {/* Doctor badge label */}
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-750 p-2.5 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider leading-none">{activeDoctor.name}</h4>
                      <p className="text-[10px] text-teal-400 font-bold leading-none mt-1">{activeDoctor.specialty} Specialist</p>
                    </div>
                  </div>

                  {/* Telemetry Indicator Panel */}
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-750 px-3 py-2 rounded-2xl flex items-center gap-4 text-xs font-bold text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Heart className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                      <span>{simulatedHeartRate} <span className="text-[9px] text-slate-500">BPM</span></span>
                    </div>
                    <div className="w-px h-3.5 bg-slate-800" />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{simulatedBp} <span className="text-[9px] text-slate-500">SYS</span></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 z-10" />
              </>
            ) : (
              /* Call Terminated / Inactive state Screen */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <PhoneOff className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-lg font-bold text-slate-100">Consultation Session Suspended</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Virtual tunnel closed. All medication guidelines, intake notes, and prescriptions have been synchronized dynamically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleCall}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm rounded-xl transition"
                >
                  Initiate Video Connection
                </button>
              </div>
            )}
          </div>

          {/* Consultation Camera Action controls */}
          <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
            {/* Right side active mic cam buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!isCallActive}
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-xl border transition ${
                  isMuted 
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 hover:bg-rose-900/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                } disabled:opacity-30`}
                aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                disabled={!isCallActive}
                onClick={() => setIsCamOff(!isCamOff)}
                className={`p-3 rounded-xl border transition ${
                  isCamOff 
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 hover:bg-rose-900/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                } disabled:opacity-30`}
                aria-label={isCamOff ? "Enable video camera" : "Disable video camera"}
              >
                {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                type="button"
                disabled={!isCallActive}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`px-4.5 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isScreenSharing 
                    ? 'bg-teal-950/40 border-teal-500/50 text-teal-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                } disabled:opacity-30`}
                aria-label="Share computer display monitor feed"
              >
                <MonitorPlay className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Share Screen</span>
              </button>
            </div>

            {/* Left side Call action */}
            {isCallActive && (
              <button
                type="button"
                onClick={handleToggleCall}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/10"
                aria-label="End telemedicine checkup consultation camera link"
              >
                <PhoneOff className="w-4 h-4" />
                Leave Room
              </button>
            )}
          </div>

          {/* Interactive Doctor Notes Entry panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <FileSpreadsheet className="w-4.5 h-4.5 text-teal-400" /> Digital Clinical Ledger Notes
            </h3>
            <textarea 
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-500 leading-relaxed font-semibold resize-none"
              aria-label="Doctor treatment records"
            />
          </div>
        </div>

        {/* Right Grid: Chat Thread Messenger panel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between max-h-[80vh] min-h-[500px]">
          {/* Box Header */}
          <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <MessageCircle className="w-4.5 h-4.5 text-teal-400" /> Consult Chat Log
            </h3>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          </div>

          {/* Quick Keyword Search Filter element */}
          <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between gap-1.5 shrink-0">
            <input 
              type="text"
              placeholder="🔍 Search chat history by keyword..."
              value={chatSearchKeyword}
              onChange={(e) => setChatSearchKeyword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-600 font-sans shadow-inner"
              aria-label="Filter chat thread"
            />
            {chatSearchKeyword && (
              <button
                type="button"
                onClick={() => setChatSearchKeyword('')}
                className="text-[10px] text-slate-500 hover:text-teal-400 transition font-mono whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>

          {/* Chat scrolling thread bubble list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(() => {
              const filteredMatches = chatHistory.filter((msg) =>
                msg.text.toLowerCase().includes(chatSearchKeyword.toLowerCase())
              );
              
              if (filteredMatches.length === 0) {
                return (
                  <div className="py-8 text-center text-slate-500 text-[11px] font-mono">
                    No matching chat records found.
                  </div>
                );
              }
              
              return filteredMatches.map((msg) => {
                const isPatient = msg.sender === 'patient';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isPatient ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isPatient 
                        ? 'bg-teal-600 font-medium text-slate-950 rounded-tr-none' 
                        : 'bg-slate-950 text-slate-200 rounded-tl-none border border-slate-850'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{msg.timestamp}</span>
                  </div>
                );
              });
            })()}
            <div ref={chatBottomRef} />
          </div>

          {/* Message form sender inputs */}
          <form onSubmit={handleSendChatSubmit} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2 rounded-b-3xl">
            <input 
              type="text"
              placeholder="Ask Dr. Vance a question..."
              value={outgoingText}
              onChange={(e) => setOutgoingText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
              aria-label="Type message"
            />
            <button
              type="submit"
              disabled={!outgoingText.trim()}
              className="p-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-xl transition font-bold disabled:opacity-30 disabled:hover:bg-teal-500"
              aria-label="Send messenger text"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
