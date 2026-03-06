import { Patient, OutreachGoal, MessageTone, Channel } from "@/lib/types";
import {
  lifecycleStageLabels,
  careProgramLabels,
  riskLevelLabels,
  goalLabels,
  toneLabels,
  channelLabels,
  formatDate,
} from "@/lib/utils/format";

const channelRules: Record<Channel, string> = {
  sms: '- SMS: Keep concise. Aim for under 300 characters when possible. Include a clear, simple call-to-action (e.g., "Reply YES", "Text us anytime"). No subject line needed.',
  email: "- Email: Include a clear, non-clickbait subject line. Use a warm, personal tone as if writing from the named nurse or care coordinator. Structure with short paragraphs, bullet points for benefits/services. Include a sign-off with the care team member's name and title.",
  "in-app":
    "- In-App: Very brief (1-2 sentences). Works as both a push notification and in-app banner. Include a tap/action prompt.",
};

const channelSchema: Record<Channel, string> = {
  sms: '"sms"',
  email: '"email"',
  "in-app": '"in-app"',
};

export function buildSystemPrompt(channels: Channel[]): string {
  const rules = channels.map((c) => channelRules[c]).join("\n");
  const allowedChannels = channels.map((c) => channelSchema[c]).join(" | ");

  return `You are an AI assistant helping a care coordination team at a virtual maternal and women's healthcare company craft personalized patient outreach messages.

CRITICAL GUIDELINES:
- You are writing AS a care team member (nurse, care coordinator) — not as a marketing department
- Never use aggressive sales language, urgency tactics, or clickbait
- Messages must feel warm, human, and clinically trustworthy
- Consider health literacy — use clear, simple language accessible to all education levels
- Be culturally sensitive and avoid assumptions about family structure, support systems, or beliefs
- Reference specific care services relevant to the patient (e.g., "your nurse care partner", "24/7 text support", "virtual visits")
- Use the patient's first name and their care team members' names when appropriate

CHANNEL RULES (generate ONLY for these channels):
${rules}

FOR EACH CHANNEL, generate exactly 3 message variants with different approaches:
1. An empathy-led approach (acknowledges the patient's situation and feelings)
2. A value/resource-led approach (highlights specific benefits or resources available)
3. A contextually appropriate third approach (could be education-led, milestone-based, clinical-urgency, or peer-support depending on the patient's situation)

For each variant, also provide:
- A short label for the approach (2-3 words, e.g., "Empathy-led", "Resource-focused")
- An engagement likelihood assessment: "high", "medium", or "low"
- A brief reasoning (2-3 sentences) explaining WHY this message would or wouldn't resonate with THIS specific patient, referencing their clinical context, risk factors, and communication preferences

RESPOND WITH VALID JSON ONLY. The channelMessages array must contain exactly ${channels.length} item${channels.length === 1 ? "" : "s"} (${channels.map((c) => channelLabels[c]).join(", ")}):
{
  "channelMessages": [
    {
      "channel": ${allowedChannels},
      "variants": [
        {
          "id": "<channel>-<letter>",
          "approach": "<short approach label>",
          "content": "<the message text>",
          "subject": "<email subject line — ONLY include for email channel>",
          "engagementLikelihood": "high" | "medium" | "low",
          "reasoning": "<why this works for this patient>"
        }
      ]
    }
  ]
}`;
}

export function buildUserPrompt(
  patient: Patient,
  goal: OutreachGoal,
  tone: MessageTone,
  channels: Channel[]
): string {
  const recentInteractions =
    patient.recentInteractions.length > 0
      ? patient.recentInteractions
          .map(
            (i) =>
              `- ${formatDate(i.date)}: ${i.type} — ${i.summary}`
          )
          .join("\n")
      : "No prior interactions";

  return `Generate personalized outreach messages for the following patient:

PATIENT PROFILE:
- Name: ${patient.name}
- Age: ${patient.age}
- Lifecycle Stage: ${lifecycleStageLabels[patient.lifecycleStage]}
- Care Program: ${careProgramLabels[patient.careProgram]}
- Risk Level: ${riskLevelLabels[patient.riskLevel]}
- Preferred Channel: ${channelLabels[patient.preferredChannel]}
- Language: ${patient.language}
- Insurance: ${patient.insuranceType}
- Enrollment Date: ${patient.enrollmentDate ? formatDate(patient.enrollmentDate) : "Not enrolled"}
- Last Interaction: ${patient.lastInteractionDate ? formatDate(patient.lastInteractionDate) : "None"}
- Missed Appointments: ${patient.missedAppointments}

CARE TEAM:
- Nurse: ${patient.careTeam.nurseName}
- Provider: ${patient.careTeam.providerName}

RISK FACTORS:
${patient.riskFactors.map((f) => `- ${f}`).join("\n")}

CLINICAL NOTES:
${patient.clinicalNotes}

RECENT INTERACTIONS:
${recentInteractions}

OUTREACH SETTINGS:
- Goal: ${goalLabels[goal]}
- Tone: ${toneLabels[tone]}
- Channels: ${channels.map((c) => channelLabels[c]).join(", ")}

Tailor every message to this specific patient's situation, risk factors, and clinical context.`;
}
