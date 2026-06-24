/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Bookmark, 
  RefreshCw, 
  Check, 
  Lock, 
  CircleDot, 
  Activity,
  Heart,
  CalendarDays,
  Printer
} from 'lucide-react';
import { Prescription } from '../types';

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  onRequestRenewal: (prescriptionId: string) => void;
}

export default function PrescriptionsView({ prescriptions, onRequestRenewal }: PrescriptionsViewProps) {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const handlePrint = (rx: Prescription) => {
    // Elegant, sandbox-compatible iframe-based sandboxed print controller
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Medical Prescription RX - ${rx.medication}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #0f172a;
              margin: 45px;
              line-height: 1.6;
              background: #ffffff;
            }
            .header {
              border-bottom: 3px double #0d9488;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .hospital-title {
              font-size: 22px;
              font-weight: 850;
              color: #0f172a;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .license {
              font-size: 11px;
              color: #475569;
              text-transform: uppercase;
              margin-top: 5px;
              font-weight: 600;
            }
            .rx-symbol {
              font-size: 64px;
              font-family: Georgia, serif;
              font-style: italic;
              color: #0d9488;
              line-height: 1;
              margin: 10px 0 25px 0;
            }
            .grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .label {
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 700;
              color: #64748b;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            }
            .value {
              font-size: 14px;
              font-weight: 600;
              color: #1e293b;
            }
            .med-box {
              background-color: #f0fdfa;
              border: 1px solid #99f6e4;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 25px;
            }
            .medication {
              font-size: 20px;
              font-weight: 900;
              color: #0f766e;
              margin: 0 0 5px 0;
            }
            .dosage {
              font-size: 14px;
              font-weight: 700;
              color: #334155;
            }
            .instructions-label {
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 700;
              color: #64748b;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
              display: block;
            }
            .instructions {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 14px;
              border-radius: 8px;
              font-size: 13px;
              color: #334155;
              margin-bottom: 30px;
            }
            .footer-info {
              border-top: 1px dashed #cbd5e1;
              padding-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #64748b;
            }
            .stamp {
              border: 2px solid #0d9488;
              color: #0d9488;
              font-weight: 800;
              padding: 5px 10px;
              border-radius: 6px;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              transform: rotate(-2deg);
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="hospital-title">METRO CARE HOSPITAL</h1>
              <div class="license">Clinical Auth ID: #MC-2026-A1</div>
            </div>
            <div class="stamp">Verified Digital Rx</div>
          </div>
          
          <div class="rx-symbol">Rx</div>

          <div class="grid">
            <div>
              <div class="label">Patient Name</div>
              <div class="value">Elias Abdulhamid</div>
            </div>
            <div>
              <div class="label">Prescribing Physician</div>
              <div class="value">${rx.doctorName}</div>
            </div>
            <div>
              <div class="label">Date Prescribed</div>
              <div class="value">${rx.dateIssued}</div>
            </div>
            <div>
              <div class="label">Refills Appended</div>
              <div class="value">${rx.refills} left</div>
            </div>
          </div>

          <div class="med-box">
            <div class="label">Prescribed Medication Strength</div>
            <h2 class="medication">${rx.medication}</h2>
            <div class="dosage">Directions Dose: ${rx.dosage}</div>
          </div>

          <div>
            <span class="instructions-label">Directions for Use (Sig)</span>
            <div class="instructions">${rx.instructions}</div>
          </div>

          <div class="footer-info">
            <div>
              <strong>Secure Verification Reference:</strong> ${rx.id}<br>
              <em>This document is digitally signed and encrypted for outpatient pharmacy validation.</em>
            </div>
            <div>
              <strong>Rx Status:</strong> ${rx.status}
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 150);
            };
          </script>
        </body>
        </html>
      `);
      doc.close();
    }
  };

  const handleRequestRenewal = (rxId: string) => {
    onRequestRenewal(rxId);
    
    // Update local modal state to reflect live changes instantly
    if (selectedPrescription && selectedPrescription.id === rxId) {
      setSelectedPrescription(prev => prev ? { ...prev, status: 'Pending Renewal' } : null);
    }
    
    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Active & Historical Prescriptions</h1>
        <p className="text-sm text-slate-400">Review clinical dosage guidance, refill status limits, and request digital board renewals</p>
      </div>

      {/* Prescription Grid listing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Header labels */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-950 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850">
          <div className="col-span-4 select-none">Active Medication</div>
          <div className="col-span-3 select-none">Prescribing Doctor</div>
          <div className="col-span-2 select-none">Dosage Unit</div>
          <div className="col-span-2 select-none">Clinical Status</div>
          <div className="col-span-1 select-none text-right">Details</div>
        </div>

        {/* Prescription Rows */}
        <div className="divide-y divide-slate-800/60">
          {prescriptions.map((rx) => (
            <div 
              key={rx.id}
              onClick={() => setSelectedPrescription(rx)}
              className="grid grid-cols-12 gap-4 px-6 py-4.5 hover:bg-slate-950/60 transition duration-150 cursor-pointer items-center group text-sm"
              id={`rx-row-${rx.id}`}
            >
              {/* Medication details */}
              <div className="col-span-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${
                  rx.status === 'Active' ? 'bg-teal-500/10 text-teal-400' :
                  rx.status === 'Pending Renewal' ? 'bg-cyan-500/10 text-cyan-400' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-200 truncate group-hover:text-teal-400 transition-colors">
                    {rx.medication}
                  </p>
                  <span className="text-slate-600 text-[10px] font-mono block">Issued: {rx.dateIssued}</span>
                </div>
              </div>

              {/* Prescribing Doctor */}
              <div className="col-span-3 text-slate-350 font-medium truncate">
                {rx.doctorName}
              </div>

              {/* Dosage */}
              <div className="col-span-2 text-slate-400 font-mono font-medium">
                {rx.dosage}
              </div>

              {/* Status indicator pill */}
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  rx.status === 'Active' ? 'bg-teal-950/50 text-teal-400 border border-teal-900/40' :
                  rx.status === 'Pending Renewal' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-900/40 animate-pulse' :
                  'bg-slate-850 text-slate-500 border border-slate-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    rx.status === 'Active' ? 'bg-teal-400' :
                    rx.status === 'Pending Renewal' ? 'bg-cyan-400' :
                    'bg-slate-600'
                  }`} />
                  {rx.status}
                </span>
              </div>

              {/* Action link */}
              <div className="col-span-1 text-right text-teal-500 hover:text-teal-400 font-mono text-xs font-bold">
                Inspect RX
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RX Details Traditional Modal Frame */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* Modal Header */}
            <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
              <span className="text-xs font-extrabold text-slate-400 font-mono uppercase tracking-wider">Official Medication Board</span>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => handlePrint(selectedPrescription)}
                  className="px-2.5 py-1 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  title="Print RX receipt"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button 
                  onClick={() => setSelectedPrescription(null)}
                  className="text-slate-400 hover:text-white"
                  aria-label="close prescription detail modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slip Paper Sheet Style Body */}
            <div className="p-6 overflow-y-auto space-y-6 relative bg-gradient-to-b from-slate-900 to-slate-950">
              {/* Watermarked 'RX' emblem background */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/10 font-bold text-9xl pointer-events-none select-none font-mono">
                Rx
              </div>

              {/* Hospital details top banner */}
              <div className="flex justify-between items-start border-b border-dashed border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-300 tracking-tight">METRO CARE HOSPITAL RX</h4>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">License Cert: #MC-2026-A1</p>
                </div>
                <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400">
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>

              {/* Patient info & Issued by */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-550 block font-mono font-bold uppercase tracking-wider text-[10px]">Patient Name</span>
                  <span className="text-slate-300 font-semibold font-sans">Elias Abdulhamid</span>
                </div>
                <div>
                  <span className="text-slate-550 block font-mono font-bold uppercase tracking-wider text-[10px]">Issuer Physician</span>
                  <span className="text-slate-300 font-semibold font-sans">{selectedPrescription.doctorName}</span>
                </div>
              </div>

              {/* Medication core dosage */}
              <div className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Prescribed Agent</span>
                  <span className="text-xs bg-teal-500/10 text-teal-400 font-mono px-2 py-0.5 rounded border border-teal-500/20 font-bold">{selectedPrescription.dosage}</span>
                </div>
                <p className="font-black text-base text-teal-300 font-sans tracking-tight">{selectedPrescription.medication}</p>
              </div>

              {/* Detailed Directions summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Signature Directions for Use</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                  {selectedPrescription.instructions}
                </p>
              </div>

              {/* Refills and metadata */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-xs font-mono font-bold text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Refills Appended:</span>
                  <strong className="text-slate-200">{selectedPrescription.refills} left</strong>
                </div>
                <div className="w-px h-full bg-slate-800 mx-auto" />
                <div className="flex justify-between items-center">
                  <span>Control Status:</span>
                  <span className={`font-semibold px-2 py-0.5 text-[10px] rounded ${
                    selectedPrescription.status === 'Active' ? 'text-teal-400 bg-teal-500/10' :
                    selectedPrescription.status === 'Pending Renewal' ? 'text-cyan-400 bg-cyan-500/10' :
                    'text-slate-500 bg-slate-800'
                  }`}>
                    {selectedPrescription.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action controls footer */}
            <div className="h-16 px-5 border-t border-slate-800 flex items-center justify-between bg-slate-950 shrink-0 select-none">
              <span className="text-[10px] text-slate-500 font-mono font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" /> Digitally Autographed
              </span>

              {selectedPrescription.status === 'Expired' ? (
                <button
                  type="button"
                  onClick={() => handleRequestRenewal(selectedPrescription.id)}
                  className="px-4.5 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/10 animate-shake"
                  aria-label="Request digital renewal for expired prescription"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Request Renewal
                </button>
              ) : selectedPrescription.status === 'Active' ? (
                <button
                  type="button"
                  onClick={() => handleRequestRenewal(selectedPrescription.id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-300 rounded-xl text-xs font-semibold"
                  aria-label="Request early safety refill"
                >
                  Request Pre-refill Renewal
                </button>
              ) : (
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Pending Board Authorization
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern float-up toast notification */}
      {isSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-teal-500 text-slate-100 p-4.5 rounded-2xl shadow-2xl flex gap-3 max-w-sm animate-slideUp items-start">
          <div className="p-1.5 bg-teal-500 text-slate-950 rounded-lg shrink-0 mt-0.5">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <h5 className="text-sm font-bold leading-none text-teal-400">Renewal Requested</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your physician has been alerted via encrypted clinical channels to review and sign off online.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
