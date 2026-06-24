/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, Appointment, Prescription, ActivityLog, ChatMessage } from '../types';

// Simulated current date: 2026-05-30
export const SIMULATED_TODAY = '2026-05-30';

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Elizabeth Vance',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewsCount: 312,
    availability: 'Available Today',
    experienceYears: 14,
    education: 'Harvard Medical School, MD in Cardiology',
    bio: 'Dr. Vance specialized in preventive cardiology, cardiovascular health, and non-invasive imaging. She is dedicated to tailoring care to each patient’s unique cardiovascular risk factors.',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 150,
    languages: ['English', 'Spanish']
  },
  {
    id: 'doc-2',
    name: 'Dr. James Sterling',
    specialty: 'Cardiology',
    rating: 4.8,
    reviewsCount: 224,
    availability: 'Next Available',
    experienceYears: 18,
    education: 'Johns Hopkins School of Medicine, Cardiovascular Fellowship',
    bio: 'Dr. Sterling is a recognized expert in heart failure management and coronary artery disease. He leverages latest clinical trials to create comprehensive, gentle recovery plans.',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 165,
    languages: ['English', 'German']
  },
  {
    id: 'doc-3',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviewsCount: 418,
    availability: 'Available Today',
    experienceYears: 11,
    education: 'Stanford University School of Medicine, Residency in Pediatrics',
    bio: 'Dr. Sarah is known for her warm, cheerful demeanor with children of all ages. She focuses on developmental milestones, childhood nutrition, and parent-support coaching.',
    photoUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 95,
    languages: ['English', 'French']
  },
  {
    id: 'doc-4',
    name: 'Dr. Noah Patel',
    specialty: 'Pediatrics',
    rating: 4.7,
    reviewsCount: 185,
    availability: 'Next Week',
    experienceYears: 8,
    education: 'Yale School of Medicine, Pediatric Residency',
    bio: 'Dr. Patel provides holistic pediatric care, addressing both physical health and psychological well-being. He is exceptionally patient-centric and advocates for outdoor developmental play.',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 100,
    languages: ['English', 'Hindi', 'Gujarati']
  },
  {
    id: 'doc-5',
    name: 'Dr. Maya Lin',
    specialty: 'Dermatology',
    rating: 4.8,
    reviewsCount: 295,
    availability: 'Available Today',
    experienceYears: 12,
    education: 'University of California, San Francisco (UCSF) Medical Center',
    bio: 'Specialist in custom medical dermatology for chronic conditions like eczema, psoriasis, acne, and advanced skin imaging audits for mole and oncology safety.',
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 120,
    languages: ['English', 'Mandarin']
  },
  {
    id: 'doc-6',
    name: 'Dr. Marcus Brody',
    specialty: 'Dermatology',
    rating: 4.7,
    reviewsCount: 154,
    availability: 'Next Available',
    experienceYears: 9,
    education: 'Columbia University Vagelos College of Physicians and Surgeons',
    bio: 'Dr. Brody is active in skin rejuvenative therapies, anti-aging solutions, allergy-related skin pathologies, and comprehensive telemedicine diagnostics.',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 115,
    languages: ['English']
  },
  {
    id: 'doc-7',
    name: 'Dr. Arthur Pendelton',
    specialty: 'Neurology',
    rating: 4.9,
    reviewsCount: 180,
    availability: 'Next Week',
    experienceYears: 22,
    education: 'Oxford Medical, PhD in Neural Dynamics, Harvard Residency',
    bio: 'Dr. Pendelton handles complex migraine syndromes, sleep disruptions, neuropathy, and early cognitive evaluations. He has a highly investigative diagnostic approach.',
    photoUrl: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 190,
    languages: ['English', 'French', 'Latin']
  },
  {
    id: 'doc-8',
    name: 'Dr. David Kim',
    specialty: 'Family Medicine',
    rating: 4.9,
    reviewsCount: 520,
    availability: 'Available Today',
    experienceYears: 15,
    education: 'University of Pennsylvania School of Medicine, Family Practice',
    bio: 'A compassionate primary provider who has served as first-point-of-contact for thousands of families. Experienced in preventive physicals, metabolic safety, and lifestyle changes.',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-64c6dc8ffc4d?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 80,
    languages: ['English', 'Korean']
  },
  {
    id: 'doc-9',
    name: 'Dr. Elena Rostova',
    specialty: 'Family Medicine',
    rating: 4.8,
    reviewsCount: 340,
    availability: 'Next Available',
    experienceYears: 13,
    education: 'McGill University Faculty of Medicine, Family Practitioner Residency',
    bio: 'Focused on longevity, women’s internal health, thyroid balance, risk mitigation, and robust digital integration for continuous digital bio-monitoring.',
    photoUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 85,
    languages: ['English', 'Russian']
  },
  {
    id: 'doc-10',
    name: 'Dr. Robert Chen',
    specialty: 'Family Medicine',
    rating: 4.7,
    reviewsCount: 265,
    availability: 'Next Available',
    experienceYears: 10,
    education: 'University of Washington School of Medicine, Family Practice MD',
    bio: 'Emphasizing physical diagnostics, primary sports care, muscle health, and routine screening standards. Dr. Chen believes in actionable, accessible healthcare workflows.',
    photoUrl: 'https://images.unsplash.com/photo-1651008011612-e79a42da4e6c?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 80,
    languages: ['English', 'Cantonese']
  },
  {
    id: 'doc-11',
    name: 'Dr. Chloe Beauchamp',
    specialty: 'Psychiatry',
    rating: 4.9,
    reviewsCount: 247,
    availability: 'Available Today',
    experienceYears: 16,
    education: 'Boston University Medical Campus, Psychiatry Leadership Fellow',
    bio: 'Dr. Beauchamp practices cognitive therapy and pharmacotherapy for ADHD, adult anxiety disorders, stress cycles, and clinical burnout. Dedicated to restoring emotional resilience.',
    photoUrl: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 140,
    languages: ['English', 'Spanish']
  },
  {
    id: 'doc-12',
    name: 'Dr. Kenji Takahashi',
    specialty: 'Psychiatry',
    rating: 4.8,
    reviewsCount: 198,
    availability: 'Next Week',
    experienceYears: 11,
    education: 'University of Tokyo Medical Science, Residency at Cornell Medicine',
    bio: 'Specialist in mindful cognitive-behavioral integration, trauma recovery protocols, and medical-psycho social balancing for modern high-pressure environments.',
    photoUrl: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 145,
    languages: ['English', 'Japanese']
  },
  {
    id: 'doc-13',
    name: 'Dr. Thomas Hunt',
    specialty: 'Orthopedics',
    rating: 4.8,
    reviewsCount: 211,
    availability: 'Available Today',
    experienceYears: 20,
    education: 'Duke University School of Medicine, Orthopaedic Surgical Science',
    bio: 'Expertise in non-surgical joint recovery, post-traumatic cartilage therapy, osteoarthritic maintenance, and personalized home rehabilitation templates.',
    photoUrl: 'https://images.unsplash.com/photo-1531594652722-e3d8c119c8f0?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'M',
    consultationFee: 160,
    languages: ['English']
  },
  {
    id: 'doc-14',
    name: 'Dr. Rachel Green',
    specialty: 'Orthopedics',
    rating: 4.7,
    reviewsCount: 132,
    availability: 'Next Week',
    experienceYears: 7,
    education: 'Northwestern University Feinberg School of Medicine, Sports Fellowship',
    bio: 'Dr. Green specializes in modern athletic recovery, joint physical health, ligament integrity, and telehealth diagnostic mobility panels.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 135,
    languages: ['English', 'Italian']
  },
  {
    id: 'doc-15',
    name: 'Dr. Sophia Martinez',
    specialty: 'Ophthalmology',
    rating: 4.8,
    reviewsCount: 169,
    availability: 'Available Today',
    experienceYears: 14,
    education: 'Baylor College of Medicine, Ophthalmology Fellowship',
    bio: 'Specializes in computer-vision eye fatigue diagnostics, dry eye syndromes, macular health reviews, and custom digital screen safety assessments.',
    photoUrl: 'https://images.unsplash.com/photo-1563820172-6a9a47781b24?auto=format&fit=crop&w=300&h=300&q=80',
    gender: 'F',
    consultationFee: 110,
    languages: ['English', 'Spanish', 'Portuguese']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Elizabeth Vance',
    doctorSpecialty: 'Cardiology',
    doctorPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300&q=80',
    date: '2026-06-02',
    time: '10:00 AM',
    status: 'Confirmed',
    notes: 'Routine cardiovascular progress review and echocardiology chart discussion.',
    meetingLink: '#/consultations'
  },
  {
    id: 'apt-2',
    doctorId: 'doc-3',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Pediatrics',
    doctorPhoto: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&h=300&q=80',
    date: '2026-06-05',
    time: '02:30 PM',
    status: 'Confirmed',
    notes: 'Prescription assessment, allergy check, and diet coaching checklist approval.',
    meetingLink: '#/consultations'
  },
  {
    id: 'apt-3',
    doctorId: 'doc-5',
    doctorName: 'Dr. Maya Lin',
    doctorSpecialty: 'Dermatology',
    doctorPhoto: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&h=300&q=80',
    date: '2026-05-31',
    time: '11:15 AM',
    status: 'Confirmed',
    notes: 'Follow-up on dermatitis ointment response and photos verification.',
    meetingLink: '#/consultations'
  },
  {
    id: 'apt-4',
    doctorId: 'doc-8',
    doctorName: 'Dr. David Kim',
    doctorSpecialty: 'Family Medicine',
    doctorPhoto: 'https://images.unsplash.com/photo-1582750433449-64c6dc8ffc4d?auto=format&fit=crop&w=300&h=300&q=80',
    date: '2026-05-24',
    time: '09:00 AM',
    status: 'Completed',
    notes: 'Completed spring comprehensive biomarker review. BP: 118/75 mmHg. Heart rate regular.',
    meetingLink: '#'
  },
  {
    id: 'apt-5',
    doctorId: 'doc-11',
    doctorName: 'Dr. Chloe Beauchamp',
    doctorSpecialty: 'Psychiatry',
    doctorPhoto: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=300&h=300&q=80',
    date: '2026-05-18',
    time: '03:00 PM',
    status: 'Completed',
    notes: 'Burnout cycle recovery timeline designed. Advised 45 min screen-off rest periods and sleep hygiene.',
    meetingLink: '#'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    medication: 'Lisinopril (Blood Pressure)',
    dosage: '10mg',
    instructions: 'Take 1 tablet daily in the morning with plenty of water. Monitor blood pressure weekly.',
    refills: 2,
    doctorName: 'Dr. Elizabeth Vance',
    doctorId: 'doc-1',
    dateIssued: '2026-05-20',
    status: 'Active'
  },
  {
    id: 'rx-2',
    medication: 'Montelukast (Allergy Management)',
    dosage: '10mg',
    instructions: 'Take 1 tablet daily before bed. Report immediately if persistent nightmares or fatigue occurs.',
    refills: 1,
    doctorName: 'Dr. David Kim',
    doctorId: 'doc-8',
    dateIssued: '2026-05-02',
    status: 'Active'
  },
  {
    id: 'rx-3',
    medication: 'Tacrolimus Topical Ointment 0.1%',
    dosage: 'Apply twice daily',
    instructions: 'Apply thin layer to affected skin areas on hands. Avoid heavy midday direct UV exposure.',
    refills: 0,
    doctorName: 'Dr. Maya Lin',
    doctorId: 'doc-5',
    dateIssued: '2026-02-15',
    status: 'Expired'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'appointment_confirmed',
    title: 'Dr. Elizabeth Vance confirmed appointment',
    description: 'Scheduled for June 2, 2026 at 10:00 AM on cardiovascular indicators follow-up.',
    timestamp: '2 hours ago'
  },
  {
    id: 'act-2',
    type: 'prescription_renewed',
    title: 'Lisinopril baseline refill completed',
    description: 'Dr. Vance renewed your prescription for 2 more months of refilled dosages.',
    timestamp: 'Yesterday'
  },
  {
    id: 'act-3',
    type: 'message_received',
    title: 'New chat message from Dr. Jenkins',
    description: '“Remember to log your daughter’s temperature logs inside our app catalog...”',
    timestamp: 'May 28, 2026'
  },
  {
    id: 'act-4',
    type: 'appointment_confirmed',
    title: 'Dr. Sarah Jenkins approved appointment',
    description: 'Scheduled for June 5, 2026 at 02:30 PM on pediatric assessment catalog.',
    timestamp: 'May 26, 2026'
  }
];

export const CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'doctor',
    text: 'Hello Elias! I am reviewing your blood pressure logs. The latest readings (122/78) look excellent since we started Lisinopril. How are you feeling?',
    timestamp: '10:01 AM'
  },
  {
    id: 'msg-2',
    sender: 'patient',
    text: 'Hi Dr. Vance! I feel greatly energized. Some slight lightheadedness on day 2 but that has fully resolved now.',
    timestamp: '10:03 AM'
  },
  {
    id: 'msg-3',
    sender: 'doctor',
    text: 'That is normal as your circulatory system adapts to lowered systemic resistance. Please maintain steady hydration.',
    timestamp: '10:05 AM'
  },
  {
    id: 'msg-4',
    sender: 'doctor',
    text: 'I have logged these notes. I will see you at our check-in next week to discuss keeping this dosage.',
    timestamp: '10:06 AM'
  }
];
