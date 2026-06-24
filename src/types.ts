/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  availability: 'Available Today' | 'Next Available' | 'Next Week';
  experienceYears: number;
  education: string;
  bio: string;
  photoUrl: string;
  gender: 'M' | 'F';
  consultationFee: number;
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhoto: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  meetingLink?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  refills: number;
  doctorName: string;
  doctorId: string;
  dateIssued: string;
  status: 'Active' | 'Expired' | 'Pending Renewal';
}

export interface ActivityLog {
  id: string;
  type: 'appointment_confirmed' | 'appointment_cancelled' | 'prescription_renewed' | 'prescription_requested' | 'message_received';
  title: string;
  description: string;
  timestamp: string; // Humand readable e.g., "2 hours ago"
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: string; // "10:15 AM"
}
