import { Patient } from "@/lib/types";

export const patients: Patient[] = [
  {
    id: "maria",
    name: "Maria Gonzalez",
    age: 28,
    lifecycleStage: "eligible",
    careProgram: "pregnancy",
    riskLevel: "low",
    preferredChannel: "sms",
    language: "English",
    insuranceType: "Employer plan (Aetna)",
    careTeam: {
      nurseName: "Sarah Thompson, RN",
      providerName: "Dr. Lisa Chen, OB-GYN",
    },
    riskFactors: ["First pregnancy", "No prior prenatal care established"],
    recentInteractions: [],
    clinicalNotes:
      "Eligible through employer benefit. First pregnancy, 12 weeks gestation based on health plan data. No previous engagement with Pomelo. Primary care physician referral noted in eligibility file.",
    enrollmentDate: null,
    lastInteractionDate: null,
    missedAppointments: 0,
  },
  {
    id: "ashley",
    name: "Ashley Williams",
    age: 34,
    lifecycleStage: "onboarding",
    careProgram: "pregnancy",
    riskLevel: "moderate",
    preferredChannel: "email",
    language: "English",
    insuranceType: "Medicaid (Managed Care)",
    careTeam: {
      nurseName: "Michelle Rivera, RN",
      providerName: "Dr. James Okafor, MFM",
    },
    riskFactors: [
      "History of preterm birth",
      "Gestational hypertension in prior pregnancy",
      "Second pregnancy",
    ],
    recentInteractions: [
      {
        date: "2025-02-20",
        type: "Enrollment call",
        summary:
          "Completed enrollment via phone. Expressed interest in 24/7 text support. Mentioned feeling overwhelmed with work schedule.",
      },
    ],
    clinicalNotes:
      "Enrolled 2 weeks ago via phone outreach. Has not yet scheduled initial virtual visit with care team. Prior pregnancy resulted in delivery at 35 weeks. Currently 18 weeks gestation. Works full-time as a retail manager with irregular hours.",
    enrollmentDate: "2025-02-20",
    lastInteractionDate: "2025-02-20",
    missedAppointments: 0,
  },
  {
    id: "keisha",
    name: "Keisha Johnson",
    age: 31,
    lifecycleStage: "at-risk",
    careProgram: "pregnancy",
    riskLevel: "high",
    preferredChannel: "sms",
    language: "English",
    insuranceType: "Medicaid",
    careTeam: {
      nurseName: "Patricia Hawkins, RN",
      providerName: "Dr. Rebecca Martinez, OB-GYN",
    },
    riskFactors: [
      "Gestational diabetes (diagnosed week 24)",
      "BMI > 30",
      "Limited transportation access",
      "Food insecurity noted",
    ],
    recentInteractions: [
      {
        date: "2025-01-15",
        type: "Virtual visit",
        summary:
          "Reviewed blood glucose log with nurse. Levels improving but inconsistent. Patient mentioned difficulty affording glucose testing strips.",
      },
      {
        date: "2025-01-22",
        type: "Missed check-in",
        summary: "Scheduled phone check-in — no answer. Voicemail left.",
      },
      {
        date: "2025-02-01",
        type: "Missed check-in",
        summary:
          "Second consecutive missed check-in. SMS sent with no response.",
      },
    ],
    clinicalNotes:
      "Was actively engaged for 3 months after enrollment. Gestational diabetes diagnosed at week 24, currently 30 weeks. Last two scheduled check-ins missed. Previously responsive to SMS. Social worker referral in progress for food assistance program. Transportation barriers noted — relies on public transit.",
    enrollmentDate: "2024-11-01",
    lastInteractionDate: "2025-01-15",
    missedAppointments: 2,
  },
  {
    id: "jennifer",
    name: "Jennifer Park",
    age: 45,
    lifecycleStage: "at-risk",
    careProgram: "midlife",
    riskLevel: "low",
    preferredChannel: "email",
    language: "English",
    insuranceType: "Employer plan (UnitedHealthcare)",
    careTeam: {
      nurseName: "Angela Foster, RN",
      providerName: "Dr. Priya Sharma, Women's Health",
    },
    riskFactors: [
      "Perimenopause symptoms (hot flashes, sleep disruption)",
      "Mild anxiety",
      "Family history of osteoporosis",
    ],
    recentInteractions: [
      {
        date: "2025-01-10",
        type: "Virtual visit",
        summary:
          "Discussed HRT options with provider. Patient requested time to think about it. Seemed engaged but uncertain.",
      },
      {
        date: "2025-01-25",
        type: "In-app message",
        summary:
          "Nurse sent follow-up message about HRT decision. Patient read but did not respond.",
      },
      {
        date: "2025-02-15",
        type: "Educational content",
        summary:
          "Sent article on managing perimenopause symptoms naturally. No engagement tracked.",
      },
    ],
    clinicalNotes:
      "Enrolled 4 months ago, initially very engaged with weekly check-ins. Engagement has tapered significantly over the past 6 weeks. Appears to be at a decision point regarding HRT. May benefit from peer support or additional education. No clinical urgency but sustained disengagement could lead to churn.",
    enrollmentDate: "2024-10-15",
    lastInteractionDate: "2025-01-10",
    missedAppointments: 0,
  },
];

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}
