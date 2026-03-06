import { GenerateResponse, Channel } from "@/lib/types";

// High-quality pre-generated mock responses for demo mode.
// Each patient has a default scenario keyed by `${patientId}-${goal}-${tone}`.

const mockData: Record<string, GenerateResponse> = {};

// ─────────────────────────────────────────────
// MARIA — Eligible, never enrolled, first pregnancy
// Most natural scenario: enrollment, warm-supportive
// ─────────────────────────────────────────────
mockData["maria-enrollment-warm-supportive"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Maria, this is Sarah Thompson from your care team! Congrats on your pregnancy. Your employer benefit includes a dedicated nurse partner (that's me!) for your entire journey — from questions at midnight to help finding the right OB. No cost to you. Can I tell you more? Just reply YES.",
          engagementLikelihood: "high",
          reasoning:
            "Leads with congratulations to create a positive first impression. Names the nurse directly to establish a human connection from the start. Emphasizes the no-cost aspect since she's on an employer plan. The midnight question example makes the benefit tangible and relatable for a first-time mom who doesn't yet know what she doesn't know.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Maria, did you know your Aetna plan includes free virtual pregnancy care through your care plan? That means 24/7 nurse access, specialist visits, and personalized support — all from home. Text LEARN to get started.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with the insurance connection which adds credibility and explains why she's being contacted. Lists concrete benefits concisely. However, it's less personal than variant A since it doesn't name the nurse or acknowledge the emotional aspect of a first pregnancy.",
        },
        {
          id: "sms-c",
          approach: "Peer-support",
          content:
            "Hi Maria! Many first-time moms tell us the hardest part is knowing what questions to ask. That's where your dedicated nurse comes in — think of it as having a knowledgeable friend who's always a text away. Interested? Reply YES.",
          engagementLikelihood: "high",
          reasoning:
            "Addresses the specific anxiety of being a first-time parent without assuming she's anxious. The 'knowledgeable friend' framing makes the service feel approachable rather than clinical. Social proof ('many first-time moms') normalizes her experience.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Welcome to a supported pregnancy, Maria",
          content:
            "Hi Maria,\n\nCongratulations on your pregnancy! I'm Sarah Thompson, a registered nurse on your care team, and I'd love to be part of your care team.\n\nThrough your employer benefit with Aetna, you have access to something really special — a dedicated nurse partner who's available 24/7 by text, phone, or video. That's me.\n\nHere's what that actually looks like:\n\n• Text me at 2 AM when you can't sleep and have a weird symptom — I'll answer\n• Get connected with OB-GYNs, nutritionists, and mental health specialists — no referral needed\n• Receive personalized guidance for every stage of your pregnancy\n• All of this at no cost to you\n\nI know a first pregnancy can feel overwhelming — so much information, so many opinions. My job is to be your trusted guide through it all.\n\nWould you like to schedule a quick 15-minute intro call? I'd love to learn about you and how I can best support you.\n\nWarmly,\nSarah Thompson, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Deeply personal and warm without being presumptuous. Uses specific, relatable examples (2 AM texts, weird symptoms) that make the benefit tangible. Acknowledges the information overload of first pregnancies. The 15-minute ask is low-commitment. Signed from the actual nurse to establish the relationship from email one.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "Your Aetna plan includes something you should know about",
          content:
            "Hi Maria,\n\nI'm reaching out because your employer plan through Aetna includes a benefit many people don't know about: free, comprehensive pregnancy support through your care plan.\n\nHere's what's included at no extra cost:\n\n• A dedicated nurse partner available 24/7 by text, phone, or video\n• Virtual visits with OB-GYNs, maternal-fetal medicine specialists, nutritionists, and therapists\n• Personalized care plans based on your specific pregnancy\n• Support from preconception through postpartum\n\nYour care team partners with leading health plans to provide this support because better-supported pregnancies lead to better outcomes — for both moms and babies.\n\nGetting started takes about 5 minutes. Just reply to this email or call us anytime.\n\nYour Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Takes a more informational approach, which may work well for someone who is analytical or wants to understand the 'why' before engaging. The insurance framing adds legitimacy. Less emotionally warm than variant A, but covers more concrete details about what's available. The 5-minute time investment is a very low barrier.",
        },
        {
          id: "email-c",
          approach: "Education-led",
          subject: "12 weeks pregnant? Here's what to expect this trimester",
          content:
            "Hi Maria,\n\nAt 12 weeks, you're wrapping up your first trimester — a huge milestone! Here are a few things that might be on your mind right now:\n\n• Your next prenatal visit and what screening tests to expect\n• When (and how) to share the news at work\n• Managing first-trimester fatigue as it starts to ease\n• Starting to think about your birth preferences\n\nAs your nurse partner through your care plan, I can help with all of this — and anything else that comes up along the way. Your employer benefit gives you 24/7 access to me and a full team of specialists.\n\nThe best part? Many of my patients say they wish they'd connected with us sooner.\n\nReady to chat? Just reply to this email.\n\nSarah Thompson, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Uses the specific gestational age from her clinical data to demonstrate relevance and timeliness. The content preview (what to expect) gives immediate value before asking for anything. Social proof at the end creates gentle urgency without pressure. This approach works well for someone who hasn't engaged yet because it leads with helpfulness.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Welcome, Maria! Your nurse partner Sarah is ready to support your pregnancy journey. Tap to say hi and schedule your intro call.",
          engagementLikelihood: "high",
          reasoning:
            "Brief, warm, and personal. Uses the nurse's name immediately. Clear single action. Works well as both a push notification and in-app welcome banner for a first-time user.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "Your pregnancy benefit is active! Get 24/7 nurse access, specialist visits, and personalized care — all free through your employer plan. Tap to explore.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with the activation status which creates a sense of something waiting to be claimed. Lists key benefits quickly. The 'explore' CTA is low-pressure for someone who hasn't decided to engage yet.",
        },
        {
          id: "inapp-c",
          approach: "Education-led",
          content:
            "12 weeks — your first trimester is almost done! Your care team has a personalized milestone update ready. Tap to view.",
          engagementLikelihood: "high",
          reasoning:
            "Milestone-based messaging creates curiosity and relevance using her specific gestational age. The promise of a 'personalized update' gives a reason to tap that feels valuable rather than transactional.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// MARIA — Eligible, never enrolled, first pregnancy
// Scenario: enrollment, casual-friendly
// ─────────────────────────────────────────────
mockData["maria-enrollment-casual-friendly"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hey Maria! It's Sarah from your care team. Congrats on the pregnancy!! Your employer benefit includes a free nurse partner (hi, that's me) for the whole journey. Literally text me anything — weird symptoms, 3 AM worries, all of it. Wanna hear more? Just reply YES!",
          engagementLikelihood: "high",
          reasoning:
            "The casual, enthusiastic tone mirrors how a friend would share exciting news. Using 'that's me' and 'literally text me anything' makes the benefit feel accessible rather than corporate. For a 28-year-old first-time mom, this tone feels natural and disarming — it breaks through the noise of formal healthcare communications she's probably already receiving from her OB's office.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Maria! So your Aetna plan has this awesome perk — free pregnancy support through your care plan. We're talking 24/7 nurse texts, specialist visits, the whole deal. Zero cost. I'm Sarah, your nurse, and I'm already here for you. Text LEARN to get the details!",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with the benefit discovery angle, which works well for someone who may not know about employer perks. The conversational phrasing ('this awesome perk,' 'the whole deal') keeps it light. However, listing benefits without connecting emotionally to her first pregnancy may feel slightly transactional compared to variant A.",
        },
        {
          id: "sms-c",
          approach: "Social-proof",
          content:
            "Hey Maria, Sarah here from your care team! Fun fact: most first-time moms I work with say their #1 relief is being able to text their nurse at random hours with 'is this normal??' questions. That could be us! It's free through your job. Reply YES if you're in.",
          engagementLikelihood: "high",
          reasoning:
            "The 'is this normal??' framing is deeply relatable for first-time moms and creates an instant mental picture of how she'd use the service. Social proof from other first-time moms normalizes the experience. The playful tone ('that could be us!') positions the relationship as collaborative rather than clinical, which aligns with how a younger patient might prefer to engage.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "So... you're having a baby!",
          content:
            "Hey Maria!\n\nFirst of all — congratulations!! A first pregnancy is such a wild, exciting, slightly terrifying ride, and I'm so glad I get to be part of your support system.\n\nI'm Sarah Thompson, a registered nurse on your care team, and through your employer benefit with Aetna, I'm basically your pregnancy bestie who also happens to have medical training. Here's what that actually means:\n\n• You can text me at literally any hour — 'Is this cramp normal?' at 2 AM? I got you\n• Need help finding a great OB, nutritionist, or therapist? I'll set it up\n• Want someone to talk through all the stuff Google is scaring you about? That's my favorite thing to do\n• All of this is completely free through your employer plan\n\nI know there's about a million things coming at you right now, so no pressure at all. But if you want to hop on a quick 15-minute call to meet each other and figure out how I can help, I'd love that.\n\nJust reply to this email or text me — whatever's easier!\n\nTalk soon,\nSarah",
          engagementLikelihood: "high",
          reasoning:
            "The casual, warm email reads like a message from a friend rather than a healthcare outreach. Phrases like 'pregnancy bestie who also happens to have medical training' and 'I got you' create immediate rapport. Acknowledging that Google is scary is a real, relatable first-pregnancy experience that shows Sarah understands her world. Signing off as just 'Sarah' (no credentials) reinforces the casual tone.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "Your job gave you a really cool pregnancy perk",
          content:
            "Hey Maria!\n\nI wanted to make sure you know about this because honestly, a lot of people miss it — your employer plan through Aetna includes free pregnancy care through your care plan.\n\nHere's the rundown:\n\n• Your own nurse partner (that's me — Sarah!) available 24/7 by text, phone, or video\n• Virtual visits with OB-GYNs, nutritionists, mental health specialists — no referral hoops\n• Personalized support from now through postpartum\n• Totally free. Like, actually free. No copays, no surprises\n\nI've worked with tons of first-time moms and honestly, the ones who connect early always say they're glad they did. Not because anything was wrong — just because having someone in your corner makes everything feel less overwhelming.\n\nWant to chat? Reply here or shoot me a text. I'm pretty easy to get ahold of.\n\nSarah Thompson, RN\nYour Nurse Care Partner",
          engagementLikelihood: "medium",
          reasoning:
            "The 'hidden perk' framing creates curiosity and a sense of insider knowledge. Emphasizing 'actually free' with repetition addresses skepticism that younger patients often have about too-good-to-be-true benefits. The social proof about first-time moms connecting early creates gentle urgency without pressure. Slightly more informational than variant A, which may work better for someone who needs the practical details before committing emotionally.",
        },
        {
          id: "email-c",
          approach: "Milestone-based",
          subject: "12 weeks! Here's what's coming up next",
          content:
            "Hey Maria!\n\nYou're almost through the first trimester — that's a big deal!\n\nI'm Sarah, a nurse on your care team, and I wanted to pop in with a few things that are probably on your radar right now:\n\n• That first big ultrasound is coming up (so exciting!)\n• Energy levels should start bouncing back soon — finally\n• It's around the time most people start sharing the news (if you haven't already)\n• Time to start thinking about prenatal screening options\n\nHere's the thing — you don't have to navigate any of this alone. Through your employer benefit, you have me as your dedicated nurse partner. I'm available 24/7, totally free, and I genuinely love helping first-time moms figure things out.\n\nWant to connect? Just reply to this email. Even if it's just a 'hey, I have a quick question' — that's perfect.\n\nSarah Thompson, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Leading with her specific gestational age and upcoming milestones provides immediate value and demonstrates that this isn't a generic mass email. The casual tone around exciting milestones (ultrasound, sharing the news) matches the emotional energy of early pregnancy. Ending with permission to send 'just a quick question' lowers the barrier dramatically — she doesn't have to commit to a full relationship upfront.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hey Maria! Your nurse Sarah is here and ready to be your pregnancy text buddy. Tap to say hi!",
          engagementLikelihood: "high",
          reasoning:
            "The 'text buddy' framing is casual and inviting for a younger patient. Using the nurse's first name creates familiarity. 'Say hi' is the lowest-friction CTA possible — no commitment implied.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "Free pregnancy perk alert! Your employer plan includes 24/7 nurse access, specialist visits, and more. Tap to check it out.",
          engagementLikelihood: "medium",
          reasoning:
            "The 'perk alert' framing grabs attention and positions the benefit as something exciting to discover rather than a healthcare obligation. Lists key features quickly. May feel slightly less personal than variant A but works well as a discovery prompt.",
        },
        {
          id: "inapp-c",
          approach: "Milestone-based",
          content:
            "Almost through trimester one! Your care team has tips for what's coming next. Tap to see your 12-week update.",
          engagementLikelihood: "high",
          reasoning:
            "The milestone celebration creates positive emotion and the promise of 'what's coming next' taps into the natural curiosity of a first-time pregnancy. Gestational-age specificity makes it feel personal and timely rather than generic.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// MARIA — Eligible, never enrolled, first pregnancy
// Scenario: educational, clinical-informative
// ─────────────────────────────────────────────
mockData["maria-educational-clinical-informative"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Maria, this is Sarah Thompson, RN, from your care team. At 12 weeks, key prenatal screenings are approaching. Your employer plan through Aetna includes a dedicated nurse to guide you through each step — at no cost. May I share what to expect this trimester? Reply YES.",
          engagementLikelihood: "high",
          reasoning:
            "Opens with clinical credentials (RN) to establish authority. References the specific gestational window and upcoming screenings to create timely relevance. Framing the outreach around clinical guidance rather than enrollment makes the message feel informational rather than promotional. The question format respects her autonomy.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Maria, studies show that patients with a dedicated nurse partner report higher satisfaction and fewer complications during pregnancy. Through your Aetna employer benefit, you have access to this level of support at no cost — including 24/7 clinical guidance. Text LEARN for details.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with evidence-based framing to appeal to an analytically-minded patient. Connects the research to her specific available benefit. However, the impersonal, data-driven opening may feel less engaging for someone who hasn't yet built trust with the care team. Works best for patients who respond to evidence over emotion.",
        },
        {
          id: "sms-c",
          approach: "Anticipatory-guidance",
          content:
            "Maria, at 12 weeks your provider will likely discuss nuchal translucency screening, NIPT options, and second-trimester planning. Your dedicated nurse, Sarah Thompson, can help you prepare and understand your options. No cost through your employer. Reply YES to connect.",
          engagementLikelihood: "high",
          reasoning:
            "Demonstrates clinical depth by naming specific upcoming procedures (NT screening, NIPT). For a first-time mother navigating unfamiliar medical terminology, having someone who can explain these tests is immediately valuable. The specificity signals genuine clinical expertise rather than generic outreach.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Your first trimester: a clinical guide to what's ahead",
          content:
            "Dear Maria,\n\nI'm Sarah Thompson, a registered nurse on your care team. I'm reaching out because your employer benefit through Aetna provides you with dedicated pregnancy care support, and as a first-time mother approaching the end of your first trimester, this is an ideal time to connect.\n\nAt 12 weeks, several important clinical milestones are on the horizon:\n\n• Prenatal screening decisions — Your provider may offer nuchal translucency ultrasound, cell-free DNA testing (NIPT), or both. Understanding the sensitivity and specificity of each test can help you make informed decisions.\n\n• Transition to the second trimester — Many patients experience a reduction in nausea and fatigue around weeks 13-14, along with the beginning of visible changes. This is a good time to establish nutrition and exercise patterns that support fetal development.\n\n• Care coordination — If you haven't yet established a full prenatal care schedule, weeks 12-16 are the recommended window for second-trimester planning, including anatomy scan scheduling.\n\n• Mental health baseline — Research indicates that proactive mental health support during pregnancy reduces the risk of postpartum depression by up to 40%. Early screening is part of our standard practice.\n\nAs your dedicated nurse partner, I provide evidence-based guidance at every stage — available 24/7 by text, phone, or video. My role is to complement your OB's care by offering the continuous, accessible support that traditional visit schedules often can't provide.\n\nAll of this is included in your employer benefit at no additional cost.\n\nI'd welcome the opportunity to schedule a 15-minute introductory call to discuss your pregnancy goals and answer any questions. Please reply to this email at your convenience.\n\nBest regards,\nSarah Thompson, RN\nNurse Care Partner\nDr. Lisa Chen, Supervising Provider",
          engagementLikelihood: "high",
          reasoning:
            "The clinical depth — naming specific tests, citing research statistics, referencing evidence-based practices — establishes immediate credibility. For a first-time mother who may be researching everything extensively, this email positions Sarah as a knowledgeable guide rather than a generic support person. Including the mental health statistic addresses a concern she may not yet know to have. Mentioning Dr. Lisa Chen adds institutional authority.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "Understanding your prenatal care benefits through Aetna",
          content:
            "Dear Maria,\n\nI'm writing to ensure you're aware of a comprehensive pregnancy support benefit available through your employer plan with Aetna.\n\nYour care benefit provides evidence-based maternal care that supplements your existing prenatal visits. Here is what the research supports and what your benefit includes:\n\n• Dedicated nurse partner — Continuous nursing support has been associated with improved pregnancy outcomes, including reduced preterm birth rates and lower rates of emergency department utilization. Your nurse (Sarah Thompson, RN) is available 24/7.\n\n• Specialist access — Virtual consultations with OB-GYNs, maternal-fetal medicine specialists, registered dietitians, and licensed therapists. No referrals required.\n\n• Personalized care planning — Using your clinical history and current pregnancy data, your care team develops individualized guidance for nutrition, exercise, screening decisions, and birth planning.\n\n• Postpartum continuity — Support extends through the fourth trimester, a period research increasingly identifies as critical for maternal health outcomes.\n\nCost: Fully covered by your employer benefit. No copays, deductibles, or out-of-pocket expenses.\n\nGetting started requires approximately 15 minutes for an introductory consultation. You can reply to this email or contact us directly.\n\nSarah Thompson, RN\nClinical Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Takes a systematic, benefits-oriented approach grounded in clinical evidence. The structured format (what research supports, what's included, what it costs) appeals to an information-gathering mindset. Less emotionally engaging than variant A, but provides the kind of detailed, factual overview that some patients need before making a decision. The clinical citations add weight without being overwhelming.",
        },
        {
          id: "email-c",
          approach: "Anticipatory-guidance",
          subject: "Prenatal screening at 12 weeks: what you should know",
          content:
            "Dear Maria,\n\nAs you approach the end of your first trimester, I wanted to share some clinical context about what's ahead. First pregnancies come with a steep learning curve, and part of my role as your dedicated nurse partner is to help you navigate it with confidence.\n\nHere is what to anticipate in the coming weeks:\n\nWeeks 12-14: Screening Decisions\nYour provider may recommend first-trimester screening, which can include a nuchal translucency ultrasound and/or non-invasive prenatal testing (NIPT). These are optional but provide valuable information about chromosomal conditions. I can walk you through the evidence behind each option.\n\nWeeks 14-18: Physical Transition\nMost patients notice improved energy, reduced nausea, and the beginning of visible pregnancy. This is an optimal time to establish exercise habits — current ACOG guidelines recommend 150 minutes of moderate-intensity activity per week for uncomplicated pregnancies.\n\nWeeks 18-22: Anatomy Scan\nThe mid-pregnancy ultrasound is a detailed assessment of fetal development. Understanding what's being evaluated can help you feel prepared and engaged during the appointment.\n\nOngoing: Your Questions Matter\nNo question is too small or too early. First-time mothers often hesitate to reach out because they're unsure whether a concern is 'worth' asking about. Clinically, early communication leads to better outcomes.\n\nAll of this guidance is available to you at no cost through your employer benefit with Aetna. I'd welcome the chance to discuss your specific questions.\n\nSarah Thompson, RN\nNurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "This anticipatory-guidance approach provides substantial educational value upfront, establishing trust before asking for engagement. The week-by-week breakdown gives Maria a clinical roadmap that she can't easily find in a single Google search. Citing ACOG guidelines adds authority. The note about first-time mothers hesitating to ask questions directly addresses a common barrier and normalizes seeking support. This email works because it teaches first and sells second.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Maria, at 12 weeks you have important prenatal screenings ahead. Your nurse Sarah can walk you through the options. Tap to connect.",
          engagementLikelihood: "high",
          reasoning:
            "Clinical specificity (12 weeks, prenatal screenings) creates immediate relevance and signals expertise. The offer to explain screening options addresses a real information need for first-time mothers facing unfamiliar medical decisions.",
        },
        {
          id: "inapp-b",
          approach: "Resource-focused",
          content:
            "Your employer benefit includes evidence-based pregnancy support — nurse access, specialist visits, and personalized care planning. All at no cost. Tap to learn more.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with the clinical quality of the benefit rather than the emotional appeal. The term 'evidence-based' signals rigor, which differentiates this from generic wellness apps. Concise format works well for a notification while covering key value points.",
        },
        {
          id: "inapp-c",
          approach: "Anticipatory-guidance",
          content:
            "First trimester nearly complete. Your care team has a clinical guide for weeks 12-20 ready for you. Tap to view.",
          engagementLikelihood: "high",
          reasoning:
            "The promise of a structured clinical guide appeals to information-seeking first-time mothers. The specific week range (12-20) creates a sense of curated, relevant content rather than a generic resource. Milestone framing adds positive reinforcement.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// ASHLEY — Enrolled 2 weeks ago, hasn't scheduled
// Most natural scenario: onboarding, warm-supportive
// ─────────────────────────────────────────────
mockData["ashley-onboarding-warm-supportive"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Ashley, it's Michelle from your care team! I know life with a retail schedule can be hectic. I'd love to set up your first virtual visit — we have evening and weekend slots that might work better. What days are usually good for you?",
          engagementLikelihood: "high",
          reasoning:
            "Acknowledges her specific barrier (irregular retail hours) without making her feel judged for not scheduling yet. Offering evening/weekend slots directly addresses the obstacle. Asking for her preference gives her control and makes responding easy.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Ashley, quick reminder: your care team is ready for you! With your history, Dr. Okafor wants to review your care plan early. We have flexible virtual appointments — even evenings. Reply BOOK and I'll find a time.",
          engagementLikelihood: "high",
          reasoning:
            "References her clinical history (prior preterm birth) to convey importance without being alarming. Names the specific provider to build trust. The reply keyword reduces friction — she doesn't have to figure out scheduling herself.",
        },
        {
          id: "sms-c",
          approach: "Education-led",
          content:
            "Hi Ashley — at 18 weeks, this is a great time to connect with your care team. Your nurse Michelle can walk you through what to watch for given your previous pregnancy. Text us when you're ready!",
          engagementLikelihood: "medium",
          reasoning:
            "Uses gestational timing to create relevance. References her previous pregnancy tactfully without detailing complications. Slightly less proactive than variants A/B — 'text us when ready' puts the onus on her, which may result in lower conversion for someone who's already shown delay.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Let's find a time that actually works for you, Ashley",
          content:
            "Hi Ashley,\n\nI'm Michelle Rivera, your nurse care partner on your care team. I'm so glad you enrolled — and I completely understand that finding time for one more appointment can feel impossible, especially with a demanding work schedule.\n\nHere's the thing: your first visit doesn't have to be complicated. It's a casual 20-minute video call where we'll:\n\n• Get to know each other\n• Review your pregnancy history so we can plan ahead\n• Set up your 24/7 text access (so you can reach me anytime — even from the break room)\n• Answer any questions you have right now\n\nI have availability:\n• Weekday evenings (6-9 PM)\n• Saturday mornings\n• Or whenever works for you — we're flexible\n\nJust reply with a day/time that works, and I'll confirm it.\n\nLooking forward to meeting you,\nMichelle Rivera, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses the scheduling barrier with specific flexible times. Sets clear expectations about the first visit (20 min, casual, video) to reduce anxiety about time commitment. The break room reference shows understanding of her daily reality. Lists what she'll get from the visit so she sees the value upfront.",
        },
        {
          id: "email-b",
          approach: "Clinical-context",
          subject: "Your care team is ready for your 18-week check-in",
          content:
            "Hi Ashley,\n\nAt 18 weeks, you're at an important point in your pregnancy — and given your history, your care team wants to make sure you have everything you need going forward.\n\nDr. James Okafor, your maternal-fetal medicine specialist, and I have put together a preliminary care plan for you. We'd love to walk you through it in a brief virtual visit. Here's what we'll cover:\n\n• Monitoring plan given your history of preterm birth and gestational hypertension\n• What to watch for and when to reach out\n• Setting up quick-access communication so you can text us anytime\n• Any questions or concerns on your mind\n\nThis visit is about 20 minutes and available at times that work with your schedule — including evenings and weekends.\n\nReply to this email or text us to book.\n\nMichelle Rivera, RN & Dr. James Okafor, MFM\nYour Care Team",
          engagementLikelihood: "high",
          reasoning:
            "Takes a more clinical approach that emphasizes the medical rationale for connecting. Naming the MFM specialist adds authority. Mentioning the preliminary care plan creates a sense that something concrete is waiting for her. Still offers scheduling flexibility. This may resonate more with someone who responds to medical guidance.",
        },
        {
          id: "email-c",
          approach: "Peer-support",
          subject: "What other moms wish they'd known at 18 weeks",
          content:
            "Hi Ashley,\n\nA lot of the moms I work with tell me the same thing: 'I wish I'd set up my care team earlier.'\n\nAt 18 weeks, you're in a sweet spot — things are starting to feel more real, but you still have time to plan. And with your second pregnancy, you already know that having the right support makes all the difference.\n\nI'm Michelle, your nurse partner on your care team. Here's how I can help right now:\n\n• Review your birth experience from last time and plan for this one\n• Set up monitoring for things we want to keep an eye on\n• Be available 24/7 via text for anything — big or small\n\nLet's set up a quick intro call this week. I have evening slots available if that's easier.\n\nMichelle Rivera, RN\nYour Nurse Care Partner",
          engagementLikelihood: "medium",
          reasoning:
            "Uses social proof and her experience as a second-time mom as entry points. The 'sweet spot' framing creates gentle urgency. References learning from her previous experience without detailing complications. Slightly less clinical than variant B, which may be better or worse depending on her preferences.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hey Ashley! Your nurse Michelle has evening and weekend slots ready. Tap to book your 20-min intro call.",
          engagementLikelihood: "high",
          reasoning:
            "Immediately addresses the scheduling barrier. Specific time commitment (20 min) and flexible options reduce friction. Short and actionable for a push notification.",
        },
        {
          id: "inapp-b",
          approach: "Clinical-context",
          content:
            "At 18 weeks, your care team has a personalized plan ready for you. Tap to schedule your first virtual visit with Dr. Okafor.",
          engagementLikelihood: "high",
          reasoning:
            "Creates curiosity about the personalized plan. Using the doctor's name adds clinical authority. The gestational timing creates relevance and gentle urgency.",
        },
        {
          id: "inapp-c",
          approach: "Value-focused",
          content:
            "You mentioned wanting 24/7 text support — let's get that set up! Book your intro call to activate full access.",
          engagementLikelihood: "medium",
          reasoning:
            "References something she specifically expressed interest in during enrollment. Framing the visit as 'activating' something she wants reframes it from obligation to benefit. However, it focuses on a single feature rather than the full picture.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// ASHLEY — Enrolled 2 weeks ago, hasn't scheduled
// Scenario: appointment-reminder, urgent-action
// ─────────────────────────────────────────────
mockData["ashley-appointment-reminder-urgent-action"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Ashley, this is Michelle Rivera, RN from Dr. Okafor's office. I know juggling work and a toddler makes scheduling hard — but at 18 weeks with your history, getting your first prenatal visit on the books is really important for you and baby. Can I find a time that works around your schedule? Reply or call me.",
          engagementLikelihood: "high",
          reasoning:
            "Acknowledges the real barriers Ashley faces — irregular retail hours and an existing child — without judgment. Leading with empathy and offering to do the scheduling work herself removes friction. For a Medicaid patient who may have had impersonal healthcare experiences, a named nurse reaching out personally builds trust.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Ashley, you're at 18 weeks and we haven't seen you yet. With your previous preterm birth, Dr. Okafor wants to start monitoring early — there are specific things we can do NOW that improve outcomes. We have early morning and evening slots to fit your work schedule. Text BOOK to get started.",
          engagementLikelihood: "high",
          reasoning:
            "Frames the visit around actionable clinical value — 'specific things we can do NOW' — which appeals to a patient who may feel appointments are passive. Mentioning flexible scheduling directly addresses her retail-hour barrier. The direct tone conveys urgency without guilt.",
        },
        {
          id: "sms-c",
          approach: "Timeline-anchored",
          content:
            "Hi Ashley, Michelle here. At 18 weeks, you're entering a window where we'd normally start cervical length monitoring given your preterm history. Dr. Okafor has a few openings this week — I can hold one for you. What days work best? Just reply here.",
          engagementLikelihood: "medium",
          reasoning:
            "Uses a specific clinical milestone (cervical length monitoring) to ground the urgency in her actual care timeline. The offer to hold a spot creates gentle scarcity. Slightly lower engagement because the clinical detail may feel intimidating to a patient who hasn't yet established trust with the practice.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "We're here for you, Ashley — let's get your first visit scheduled",
          content:
            "Hi Ashley,\n\nI'm Michelle Rivera, a registered nurse on Dr. James Okafor's maternal-fetal medicine team. I wanted to reach out personally because I see you enrolled about two weeks ago, and I'd love to help you get your first prenatal appointment on the calendar.\n\nI understand that with a little one at home and a work schedule that changes week to week, finding time for appointments can feel like one more impossible thing to fit in. But at 18 weeks — especially with your history — this is a visit we really don't want to delay.\n\nDr. Okafor specializes in pregnancies like yours, and our first appointment together will give us a clear picture of how you and baby are doing. We offer early morning, evening, and some weekend availability specifically for patients with non-traditional work hours.\n\nYou can reply to this email and I'll find a slot that works for you.\n\nTake care,\nMichelle Rivera, RN\nMaternal-Fetal Medicine Team\nDr. James Okafor's Office",
          engagementLikelihood: "high",
          reasoning:
            "Leads with warmth and personal connection, which is critical for a patient who enrolled but hasn't followed through. Naming the specific scheduling accommodations (early, evening, weekend) directly solves her stated barrier. The tone is inviting rather than clinical, helping build trust.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "Ashley — important next steps for your 18-week care plan",
          content:
            "Hi Ashley,\n\nWelcome to Dr. Okafor's practice. I'm reaching out because you're now at 18 weeks, and there are time-sensitive steps in your care plan that we'd like to get started.\n\nBecause of your previous preterm birth and history of gestational hypertension, Dr. Okafor will want to:\n\n• Establish a baseline blood pressure monitoring plan\n• Begin cervical length assessments\n• Review any medications or supplements you're currently taking\n• Connect you with our Medicaid care coordination team, who can help with transportation, appointment scheduling, and other support\n\nThese aren't just routine boxes to check — they're specific to your history and can make a real difference in how this pregnancy goes.\n\nWe've built our schedule with working parents in mind. If you let me know your typical shift pattern, I'll find an opening that doesn't cost you hours.\n\nReply to this email and I'll handle it.\n\nMichelle Rivera, RN\nDr. James Okafor, MFM",
          engagementLikelihood: "high",
          reasoning:
            "Itemizing the specific clinical actions transforms the appointment from an abstract obligation into a concrete set of valuable services. Mentioning the Medicaid care coordination team signals that this practice understands her insurance context. Offering to work around her shift pattern shows practical respect for her time.",
        },
        {
          id: "email-c",
          approach: "Clinical-stakes",
          subject: "Your care window at 18 weeks — Dr. Okafor's recommendation",
          content:
            "Hi Ashley,\n\nI'm writing on behalf of Dr. James Okafor, who reviewed your intake information when you enrolled two weeks ago. He asked me to reach out directly.\n\nAt 18 weeks with a history of preterm birth and gestational hypertension, you're entering a period where early monitoring gives us the best ability to intervene if needed. Patients with your profile who establish care by 20 weeks have significantly better outcomes than those who start later.\n\nThis isn't about adding stress to your plate — it's about giving us the best chance to support a healthy, full-term pregnancy. Dr. Okafor has specific experience with exactly this type of pregnancy.\n\nWe have availability this week, including times outside standard business hours. I can also arrange a phone pre-visit if that's easier as a first step.\n\nPlease reach out — I'm here to help make this easy.\n\nMichelle Rivera, RN\nMaternal-Fetal Medicine",
          engagementLikelihood: "medium",
          reasoning:
            "Invoking the physician's direct request adds clinical authority. The 20-week benchmark creates a specific, non-arbitrary deadline. However, this approach carries moderate risk for Ashley — if she's avoiding scheduling due to anxiety about her preterm history, emphasizing clinical stakes could trigger avoidance. The phone pre-visit offer partially mitigates this.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Welcome, Ashley! Your nurse Michelle is ready to help you schedule your first visit with Dr. Okafor — we have evening and weekend slots to fit your schedule. Tap here to book or message Michelle.",
          engagementLikelihood: "high",
          reasoning:
            "Warm, brief, and immediately actionable. Mentioning flexible scheduling removes the primary barrier before Ashley even has to think about it. The option to message the nurse directly lowers the commitment threshold.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "You're at 18 weeks, Ashley. Dr. Okafor has a personalized monitoring plan ready for you based on your history — your first visit will get it started. Book now to secure a time that works.",
          engagementLikelihood: "medium",
          reasoning:
            "Positions the visit as something already prepared and waiting for her, creating a sense of momentum. The personalization cue ('based on your history') signals this isn't generic care.",
        },
        {
          id: "inapp-c",
          approach: "Milestone-based",
          content:
            "At 18 weeks, now is the ideal window to start the monitoring Dr. Okafor recommends for your pregnancy. Michelle can find a time that fits your work schedule — tap to connect.",
          engagementLikelihood: "medium",
          reasoning:
            "Uses the pregnancy milestone to anchor urgency naturally. Keeps the focus on the care team doing the work of scheduling, which reduces effort for a busy retail worker.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// ASHLEY — Enrolled 2 weeks ago, hasn't scheduled
// Scenario: educational, clinical-informative
// ─────────────────────────────────────────────
mockData["ashley-educational-clinical-informative"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Ashley, it's Michelle from Dr. Okafor's team. Since you experienced preterm birth before, I wanted to share: research shows that early cervical monitoring starting around 16-20 weeks can help us catch changes early and take steps to protect this pregnancy. We're here to answer any questions.",
          engagementLikelihood: "high",
          reasoning:
            "Wraps clinical evidence in a caring frame. For a patient who may carry anxiety from a previous preterm birth, normalizing the monitoring as proactive and protective — rather than reactive to a problem — reduces fear. The emotional tone makes clinical information feel accessible.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Ashley — did you know that patients with a prior preterm birth may benefit from progesterone therapy or a cerclage? These are evidence-based options Dr. Okafor evaluates at your first MFM visit. Your Medicaid plan covers these fully. Want to learn more? Reply YES.",
          engagementLikelihood: "medium",
          reasoning:
            "Introduces specific, actionable clinical interventions that give Ashley a reason to engage beyond passive monitoring. Mentioning Medicaid coverage preemptively addresses cost concerns. The clinical terminology signals specialist-level care that's different from a standard OB visit.",
        },
        {
          id: "sms-c",
          approach: "Reassurance-led",
          content:
            "Hi Ashley, Michelle here. Every pregnancy is different, and having had a preterm birth before doesn't mean it will happen again. At 18 weeks, Dr. Okafor can assess your specific risk factors and build a plan. Many of our patients in similar situations carry to full term with the right support.",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses the anxiety that likely accompanies Ashley's awareness of her history. The reassurance is honest — it doesn't promise an outcome but reframes from fear to agency. Mentioning other patients normalizes her experience, which is important for a patient who hasn't yet established trust with this care team.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "What your history means for this pregnancy — and what we can do about it",
          content:
            "Hi Ashley,\n\nI'm Michelle Rivera, a registered nurse on Dr. Okafor's maternal-fetal medicine team. I wanted to take a moment to share some information that's specific to your pregnancy and your history.\n\nHaving experienced a preterm birth before, it's completely natural to have questions — or worries — about this pregnancy. I want you to know two things:\n\n1. A prior preterm birth does increase the statistical risk of another, but it absolutely does not determine the outcome. Many patients with your history carry to full term.\n\n2. There are specific, evidence-based steps we can take to reduce that risk, and the earlier we start, the more options we have.\n\nHere's what the research tells us:\n\n• Cervical length monitoring — Starting between 16 and 24 weeks, regular ultrasound measurements can detect shortening early. If we catch changes, we have interventions available.\n\n• Progesterone supplementation — For patients with a prior spontaneous preterm birth, vaginal progesterone has been shown to reduce the risk of recurrence by up to 45%.\n\n• Blood pressure management — With your history of gestational hypertension, early and consistent monitoring lets us distinguish between normal changes and patterns that need attention.\n\n• Care coordination — Our Medicaid support team can help with transportation, prescription access, and scheduling around non-standard work hours.\n\nDr. Okafor specializes in exactly this kind of pregnancy. If you have questions about any of this, reply to this email or call me directly.\n\nWarmly,\nMichelle Rivera, RN\nMaternal-Fetal Medicine Team",
          engagementLikelihood: "high",
          reasoning:
            "Acknowledges Ashley's likely emotional state before presenting clinical information, meaning she's more likely to absorb the content. Each intervention is explained in plain language with a clear benefit. Mentioning the Medicaid support team signals that this practice sees the whole patient. The length is justified because educational content needs space to be genuinely informative.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "Your 18-week pregnancy guide — tailored to your health history",
          content:
            "Hi Ashley,\n\nAs you reach 18 weeks, here's a quick guide to what's happening and what matters most for your specific pregnancy.\n\nWhere you are right now:\nAt 18 weeks, your baby is about 5.5 inches long and developing the myelin sheath that protects their nervous system. You may be feeling movement for the first time. Blood volume is increasing significantly — which is why blood pressure monitoring matters even more for someone with a history of gestational hypertension.\n\nWhat your history means at this stage:\n\n• Transvaginal cervical length measurement every 2 weeks starting now\n• Evaluation for progesterone supplementation\n• Serial blood pressure monitoring with home BP cuff (covered by your plan)\n• Growth ultrasounds starting at 28 weeks\n\nWhat Medicaid covers:\nAll of the above monitoring and interventions are covered under your Medicaid plan, including the home blood pressure monitor. Our care coordination team can also arrange transportation to appointments.\n\nThis is a lot of information, and you don't need to process it all at once. Dr. Okafor and I are here to walk through it with you whenever you're ready.\n\nMichelle Rivera, RN\nDr. James Okafor, MFM",
          engagementLikelihood: "medium",
          reasoning:
            "Takes a structured, informational approach that functions as a patient education resource. It's comprehensive and explicitly addresses Medicaid coverage. Moderate likelihood because the density of clinical detail might feel overwhelming for a patient who hasn't yet engaged with the practice. However, for information-seekers, this could be the most compelling variant.",
        },
        {
          id: "email-c",
          approach: "Clinical-narrative",
          subject: "A note from Dr. Okafor's team about your pregnancy care plan",
          content:
            "Hi Ashley,\n\nDr. Okafor asked me to share some information with you about what he'd like to focus on in your first visit and why timing matters at this stage.\n\nAs a maternal-fetal medicine specialist, Dr. Okafor works with patients who have histories like yours — a previous preterm birth combined with gestational hypertension. He's seen firsthand how much of a difference early, targeted monitoring makes.\n\nHere's his perspective on the three key priorities for your care:\n\n1. Cervical surveillance — The 16- to 24-week window is when cervical changes are most likely to begin in patients with a prior preterm birth. A transvaginal ultrasound can measure cervical length quickly and painlessly.\n\n2. Blood pressure baseline — Gestational hypertension in a previous pregnancy means your risk for recurrence is elevated. Establishing a reliable baseline now lets us distinguish between normal fluctuations and early signs of a problem.\n\n3. Care planning around your life — Dr. Okafor's team includes a Medicaid care coordinator who works with patients with non-traditional work schedules. We can cluster appointments, offer telehealth check-ins, and coordinate with your pharmacy.\n\nNone of this is meant to alarm you. It's meant to show you that there's a clear, well-researched plan available — and that the best time to start it is now, at 18 weeks.\n\nReply to this email or call when you're ready. We'll work around your schedule.\n\nMichelle Rivera, RN\nOn behalf of Dr. James Okafor, MFM",
          engagementLikelihood: "high",
          reasoning:
            "Framing the content as coming from the specialist physician adds clinical authority while the nurse's voice keeps it approachable. Organizing around three clear priorities makes the information digestible. The explicit note that this isn't meant to alarm her is important for a patient with anxiety-inducing history. Mentioning appointment clustering and telehealth shows awareness of her access barriers.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hi Ashley — at 18 weeks with your history, there are proven steps Dr. Okafor can take to support a healthy pregnancy. Tap to learn what cervical monitoring and blood pressure management can do for you.",
          engagementLikelihood: "high",
          reasoning:
            "Frames clinical interventions as supportive rather than reactive. The tap-to-learn CTA respects Ashley's autonomy to engage with information at her own pace.",
        },
        {
          id: "inapp-b",
          approach: "Resource-focused",
          content:
            "Patients with a prior preterm birth who start MFM monitoring by 20 weeks have significantly better outcomes. Your Medicaid plan fully covers the monitoring Dr. Okafor recommends. Learn more.",
          engagementLikelihood: "medium",
          reasoning:
            "Combines an evidence-based statistic with practical reassurance of Medicaid coverage. The deadline-adjacent framing (by 20 weeks) creates gentle urgency.",
        },
        {
          id: "inapp-c",
          approach: "Reassurance-led",
          content:
            "Having a previous preterm birth doesn't define this pregnancy, Ashley. Dr. Okafor has a specific care plan for patients with your history — and it starts with your first visit. Tap to see what's included.",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses the fear many patients with preterm history carry. The normalizing tone validates her experience without minimizing it. Positioning the care plan as already existing creates belonging rather than singling her out.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// KEISHA — At risk, missed 2 check-ins, high-risk pregnancy
// Most natural scenario: re-engagement, warm-supportive
// ─────────────────────────────────────────────
mockData["keisha-re-engagement-warm-supportive"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Keisha, it's Patricia from your care team. I've been thinking about you and just wanted to check in — no pressure. How are you and baby doing? I'm here whenever you're ready to talk. Just text back anytime.",
          engagementLikelihood: "high",
          reasoning:
            "Opens with genuine warmth and explicitly removes pressure, which is crucial for someone who may feel guilty about missed check-ins. Asks about both her and baby to show holistic concern. The open-ended 'text back anytime' respects her autonomy while keeping the door open.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Keisha, your nurse Patricia here. I found some programs that can help with glucose testing supplies and food support in your area. Want me to get that set up for you? Just reply YES.",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses known barriers (glucose strip costs, food insecurity) that may be driving disengagement. Instead of asking her for something, this offers something concrete. The specificity shows her care team has been paying attention and working on her behalf even during the gap.",
        },
        {
          id: "sms-c",
          approach: "Clinical-gentle",
          content:
            "Hi Keisha, at 30 weeks your care team wants to make sure everything is on track with your glucose levels. We can do a quick check-in by text — no appointment needed. Send your latest numbers when you can.",
          engagementLikelihood: "medium",
          reasoning:
            "Frames the clinical need (glucose monitoring at 30 weeks) without being alarmist. Offering a text-based check-in rather than a formal appointment dramatically lowers the barrier, especially given her transportation challenges. However, it asks her to do something (send numbers) rather than offering help first.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Checking in on you, Keisha",
          content:
            "Hi Keisha,\n\nIt's Patricia, your nurse care partner. I've been thinking about you and wanted to reach out.\n\nI know managing gestational diabetes on top of everything else can feel like a lot — and I want you to know that there's no judgment here, only support. You don't have to do this alone.\n\nA few things I'd love to help with whenever you're ready:\n\n• Reviewing your glucose levels together and adjusting your plan if needed\n• Connecting you with programs that can help with testing supplies\n• Exploring food assistance options in your area\n• Scheduling a flexible check-in that works with your life\n\nYou can text me anytime at your care team number, or just reply to this email. Even if you just want to vent — I'm here for it.\n\nTake care of yourself,\nPatricia Hawkins, RN\nYour Nurse Care Partner\n\nP.S. If getting to appointments has been a challenge, we have virtual options and can help figure out transportation too.",
          engagementLikelihood: "high",
          reasoning:
            "Deeply personalized to Keisha's situation: gestational diabetes, supply costs, food insecurity, and transportation — all from her clinical record. The P.S. addresses transportation, a documented barrier. The no-judgment framing is essential for someone who's missed appointments and may feel guilt or shame. Multiple low-friction response options (text, email, vent) make re-engaging feel safe.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "Resources we've found for you, Keisha",
          content:
            "Hi Keisha,\n\nYour care team has been working on some things behind the scenes that I think could really help:\n\n1. Glucose testing supply assistance — We've identified a program that can help cover the cost of testing strips and a new monitor if needed.\n\n2. Food support — There are local options for nutritious meal delivery and grocery assistance that work well for managing gestational diabetes.\n\n3. Transportation help — We can arrange rides for any appointments you need, or switch to virtual visits that you can do from home.\n\n4. Flexible check-ins — No need for formal appointments. You can text me your glucose numbers anytime and I'll review them same-day.\n\nNone of this requires a long call or appointment. Just reply to this email or text me, and I'll start getting things set up.\n\nYou're doing a great job, Keisha. Let us help make it a little easier.\n\nPatricia Hawkins, RN\nYour Care Team",
          engagementLikelihood: "high",
          reasoning:
            "Reframes the outreach entirely around what the care team can give rather than what they need from Keisha. Each resource directly maps to a documented barrier. The 'behind the scenes' framing communicates that her team has been working for her even during the gap. The encouraging closing line ('you're doing a great job') is affirming without being patronizing.",
        },
        {
          id: "email-c",
          approach: "Clinical update",
          subject: "30-week update from your care team",
          content:
            "Hi Keisha,\n\nAs you reach 30 weeks, I wanted to share some important updates about this stage of pregnancy with gestational diabetes.\n\nAt this point, Dr. Martinez typically recommends:\n\n• More frequent glucose monitoring — but we can make this easy via text\n• A check-in to review whether your current management plan needs any adjustments\n• Connecting with our nutritionist for practical, budget-friendly meal ideas\n• Planning ahead for the final weeks, including delivery preparation\n\nI know things have been busy, and that's okay. We can work around your schedule and keep things flexible — a 10-minute call or even a quick text exchange is enough to make sure you and baby are on track.\n\nWe've also identified resources for testing supplies and food support that I'd love to tell you about.\n\nReply here or text me anytime.\n\nPatricia Hawkins, RN & Dr. Rebecca Martinez, OB-GYN\nYour Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Takes a clinical approach grounded in the gestational timeline, which may feel more authoritative and motivating for some patients. Including Dr. Martinez's name adds medical weight. Acknowledges the gap ('things have been busy') without dwelling on it. Still addresses practical barriers (budget-friendly meals, flexible scheduling). May feel slightly more like an obligation than variants A/B.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hi Keisha — Patricia is checking in. No pressure, just wanted to see how you're doing. Tap to send her a message.",
          engagementLikelihood: "high",
          reasoning:
            "Mirrors the low-pressure SMS approach. 'No pressure' is key for re-engagement — it signals safety. Single clear action path. Works well as a push notification.",
        },
        {
          id: "inapp-b",
          approach: "Resource-focused",
          content:
            "Keisha, your care team found glucose supply assistance and food support programs for you. Tap to learn more.",
          engagementLikelihood: "high",
          reasoning:
            "Leads with a concrete, valuable offer that addresses known barriers. This isn't asking for anything — it's giving. Practical utility drives engagement better than check-in requests for disengaged patients.",
        },
        {
          id: "inapp-c",
          approach: "Milestone-based",
          content:
            "30 weeks! Your care team has a personalized update for this stage. Tap to view your pregnancy milestones.",
          engagementLikelihood: "medium",
          reasoning:
            "Uses gestational timing to create relevance and positive framing. The milestone concept provides a reason to re-engage that feels celebratory rather than corrective. May prompt less direct connection with the care team than variants A/B.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// KEISHA — At risk, missed 2 check-ins, high-risk pregnancy
// Scenario: re-engagement, urgent-action
// ─────────────────────────────────────────────
mockData["keisha-re-engagement-urgent-action"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Keisha, it's Patricia from Dr. Martinez's office. We haven't connected in a couple of weeks and I just wanted to check in — at 30 weeks, you and baby are at such an important stage. We're here for you, no judgment. Can we set up a quick call this week? Reply YES and I'll reach out.",
          engagementLikelihood: "high",
          reasoning:
            "Keisha was previously engaged, which suggests she values the care relationship. Leading with warmth and explicitly stating 'no judgment' addresses the guilt she may feel about missed check-ins. A simple YES reply lowers the effort barrier, which matters given her transportation challenges.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Keisha, this is Patricia from Dr. Martinez's team. We have updates on glucose supply assistance programs and food support resources for Medicaid patients in your area — these could make a real difference at 30 weeks with gestational diabetes. We'd love to connect you. Can we chat this week? Reply CALL.",
          engagementLikelihood: "high",
          reasoning:
            "Keisha's disengagement may be driven by overwhelm from real barriers — glucose strip costs and food insecurity. Leading with tangible resources reframes the check-in as something that benefits her materially, not just another clinical obligation. The specificity shows her care team has been paying attention.",
        },
        {
          id: "sms-c",
          approach: "Milestone-anchored",
          content:
            "Hi Keisha — Patricia here, your nurse at Dr. Martinez's office. You're at 30 weeks now, which means just about 10 weeks until you meet your baby! There are a few time-sensitive things we want to make sure are in place. Can we reconnect? I can call you or arrange a ride if getting here is tough.",
          engagementLikelihood: "high",
          reasoning:
            "Framing urgency around the positive milestone of meeting her baby channels clinical importance into excitement rather than anxiety. Proactively offering a ride addresses the transportation barrier before she has to ask, removing a key friction point for re-engagement.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "We miss you, Keisha — your care team is here when you're ready",
          content:
            "Dear Keisha,\n\nThis is Patricia Hawkins, RN, from Dr. Rebecca Martinez's office. I wanted to reach out personally because we haven't been able to connect for your last two check-ins, and I want you to know — we understand that life at 30 weeks pregnant is a lot, especially when you're managing gestational diabetes on top of everything else.\n\nThere's no judgment here. Whatever got in the way, we just want to make sure you and your baby have what you need for these final weeks.\n\nAt this stage of pregnancy, keeping an eye on your glucose levels is especially important because your body's insulin needs are changing quickly. We want to help you stay on top of that — not add more stress to your plate.\n\nIf getting to the office is difficult, we can arrange a phone or telehealth visit. If glucose strip costs have been a barrier, we have options to help with that too.\n\nYou were doing great with your care plan, and we'd love to pick back up wherever works for you.\n\nPlease call us at your convenience, or simply reply to this email and I'll set something up.\n\nWarmly,\nPatricia Hawkins, RN\nOn behalf of Dr. Rebecca Martinez, OB-GYN",
          engagementLikelihood: "high",
          reasoning:
            "This message validates Keisha's experience without minimizing the clinical importance of re-engagement. By naming the barriers (transportation, glucose strip costs) without waiting for her to raise them, it signals that the care team sees her whole situation. The warm but clinically grounded tone mirrors what a trusted nurse would actually say.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "Resources available for you — glucose supplies, food support & transportation",
          content:
            "Dear Keisha,\n\nThis is Patricia Hawkins, RN, from Dr. Martinez's practice. I'm reaching out because there are several support resources we've identified for you, and some of them are time-sensitive.\n\nHere's what we can help connect you with:\n\n• Glucose monitoring supplies — As a Medicaid patient, you may qualify for fully covered glucose strips and additional monitoring supplies at no cost.\n\n• Nutrition support — We've partnered with local food assistance programs that specifically support pregnant women managing gestational diabetes, including meal kits and grocery assistance.\n\n• Transportation to appointments — We can arrange free medical transportation for your prenatal visits through your Medicaid benefits — door to door.\n\nAt 30 weeks with gestational diabetes, consistent glucose monitoring is one of the most important things we can do to keep you and baby healthy through delivery. Your body's needs are shifting right now, and we want to make sure your care plan keeps up.\n\nWe've missed you at your last two check-ins and want to help remove anything that's been making it harder to stay connected.\n\nWould you be available for a call this week? I can work around your schedule.\n\nBest,\nPatricia Hawkins, RN\nDr. Rebecca Martinez, OB-GYN",
          engagementLikelihood: "high",
          reasoning:
            "This is likely the highest-performing variant because it leads with concrete, actionable value. Keisha's barriers are real and material — cost, food, transportation — and this message addresses all three with specific solutions rather than vague promises. The 'behind the scenes' framing communicates that her team has been working for her even during the gap.",
        },
        {
          id: "email-c",
          approach: "Care-continuity",
          content:
            "Dear Keisha,\n\nI hope you're doing well. This is Patricia Hawkins, your nurse in Dr. Rebecca Martinez's OB-GYN practice.\n\nYou're now at 30 weeks — an exciting milestone, and an important one clinically. I wanted to share a quick update on where things stand with your care plan.\n\nAt this stage of pregnancy, gestational diabetes management becomes especially important. Your insulin resistance typically peaks between weeks 28-36, which means glucose levels that were well-controlled earlier can start to shift. That's completely normal, but it does mean we want to be monitoring closely.\n\nWe haven't been able to connect for your last two scheduled check-ins, and I want to be straightforward with you: this is a window where staying in touch with your care team really matters. Not to alarm you — but because there are things we can do right now that make a meaningful difference.\n\nI also want to make sure the practical side isn't getting in the way. If glucose strip costs, getting to appointments, or managing meals have been challenging, please let us bring those into the conversation. That's part of our job.\n\nLet's find a time to reconnect — even 15 minutes by phone would be valuable.\n\nTake care,\nPatricia Hawkins, RN\nDr. Rebecca Martinez, OB-GYN",
          subject: "Your 30-week care update from Dr. Martinez's office",
          engagementLikelihood: "medium",
          reasoning:
            "Balances clinical transparency with respect for Keisha's autonomy. By framing the outreach as a routine care update rather than 'you missed your appointments,' it reduces shame. The straightforward explanation of why weeks 28-36 matter gives real information to make decisions with, respecting her intelligence and agency.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hi Keisha — your care team has been thinking of you. At 30 weeks, we'd love to reconnect and make sure you and baby have everything you need. Tap to schedule a check-in with Patricia.",
          engagementLikelihood: "medium",
          reasoning:
            "Short, warm, and non-judgmental. The phrase 'thinking of you' conveys care without pressure. Single clear CTA helps it stand out in a notification context.",
        },
        {
          id: "inapp-b",
          approach: "Resource-focused",
          content:
            "Keisha, free glucose supplies and meal support are available for you through Medicaid. Your nurse Patricia can set these up — tap to schedule a quick call.",
          engagementLikelihood: "high",
          reasoning:
            "Leading with the resource offer makes the value immediately visible. For a patient facing glucose strip costs and food insecurity, this is the most action-driving framing. The word 'free' is important given her financial barriers.",
        },
        {
          id: "inapp-c",
          approach: "Milestone-anchored",
          content:
            "You're 30 weeks along, Keisha — just 10 weeks to go! Your care team wants to check in on your gestational diabetes plan for the home stretch. We can arrange transportation if you need it.",
          engagementLikelihood: "medium",
          reasoning:
            "The countdown framing creates positive urgency tied to anticipation rather than worry. Mentioning transportation proactively removes a known barrier. This approach works well for patients who were previously engaged and may just need a nudge.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// KEISHA — At risk, missed 2 check-ins, high-risk pregnancy
// Scenario: appointment-reminder, urgent-action
// ─────────────────────────────────────────────
mockData["keisha-appointment-reminder-urgent-action"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Keisha, it's Patricia from Dr. Martinez's office. You have a prenatal visit coming up and we really want to see you — at 30 weeks with gestational diabetes, this appointment helps us make sure everything's on track. Need a ride? We can arrange free Medicaid transport. Reply RIDE or CONFIRM.",
          engagementLikelihood: "high",
          reasoning:
            "Combining warmth with a concrete barrier-removal offer (transportation) addresses the most likely reason Keisha might miss another appointment. The two-option reply format is simple and gives her agency. Naming gestational diabetes management as the purpose gives the visit clear value without fearmongering.",
        },
        {
          id: "sms-b",
          approach: "Resource-focused",
          content:
            "Keisha — reminder about your upcoming visit with Dr. Martinez. At this appointment we'll review your glucose plan, connect you with free test strip coverage, and discuss nutrition support available through Medicaid. Reply YES to confirm or CALL to reschedule.",
          engagementLikelihood: "high",
          reasoning:
            "Framing the appointment as the gateway to tangible resources transforms it from an obligation into an opportunity. For a patient dealing with glucose strip costs and food insecurity, knowing that free supplies and nutrition help are on the table gives a compelling reason to show up.",
        },
        {
          id: "sms-c",
          approach: "Clinical-warmth",
          content:
            "Keisha, this is your care team at Dr. Martinez's office. Your 30-week prenatal check is important — your body's glucose needs are shifting right now and we want to stay ahead of any changes together. We've got you. Reply YES or let us know what you need.",
          engagementLikelihood: "medium",
          reasoning:
            "The phrase 'we've got you' and 'together' reinforces the care relationship and signals support rather than surveillance. Explaining WHY the timing matters gives clinical context without scare tactics. The open-ended 'let us know what you need' invites her to name barriers.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Your upcoming prenatal visit — we're looking forward to seeing you, Keisha",
          content:
            "Dear Keisha,\n\nThis is Patricia Hawkins, RN, writing from Dr. Rebecca Martinez's office to remind you about your upcoming prenatal appointment.\n\nI know it's been a little while since we've seen you, and I want you to know that this visit is about supporting you — not catching up on what was missed. You're at 30 weeks now, and this is one of those moments in pregnancy where a check-in with your care team can make a real difference.\n\nWith gestational diabetes, your body is going through changes right now that affect how your glucose levels behave. Dr. Martinez will want to review your numbers, see how you're feeling, and adjust your care plan if anything needs tweaking.\n\nI also want to address a few things that might make getting here easier:\n\n• Transportation — We can arrange free door-to-door medical transport through your Medicaid coverage\n• Glucose supplies — If test strip costs have been an issue, we'll get that sorted at this visit\n• Nutrition support — We can connect you with local food programs designed for pregnant women managing blood sugar\n\nPlease confirm your appointment by replying to this email or calling our office. If you need to reschedule, that's okay too.\n\nLooking forward to seeing you,\nPatricia Hawkins, RN\nDr. Rebecca Martinez, OB-GYN",
          engagementLikelihood: "high",
          reasoning:
            "Prioritizes emotional safety by explicitly stating the visit isn't about accountability for missed check-ins. The structured list of barrier-removal resources makes it scannable and action-oriented while the overall tone stays warm and personal.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "What we'll cover at your 30-week visit — plus resources ready for you",
          content:
            "Dear Keisha,\n\nThis is Patricia Hawkins from Dr. Martinez's office. I'm writing to remind you about your upcoming prenatal appointment and share what we have lined up for you.\n\nWhat to expect at this visit:\n\n1. Glucose management review — At 30 weeks, insulin resistance is typically at its peak. Dr. Martinez will review your levels and make any adjustments needed.\n\n2. Free glucose monitoring supplies — We've identified Medicaid coverage options for your test strips and monitoring supplies at no cost to you.\n\n3. Nutrition and food support — We'll connect you with our food assistance program for pregnant patients managing gestational diabetes, including meal guidance and grocery support.\n\n4. Birth planning — With about 10 weeks to go, we'll start talking through your delivery plan.\n\nGetting here: Your Medicaid benefits include free medical transportation. Reply to this email and we'll arrange a pickup — door to door, no cost.\n\nThis visit is a chance for us to set you up with the support that makes the rest of your pregnancy more manageable.\n\nPlease confirm or reschedule by replying here or calling our office.\n\nBest,\nPatricia Hawkins, RN\nDr. Rebecca Martinez, OB-GYN",
          engagementLikelihood: "high",
          reasoning:
            "Transforms the appointment reminder into a clear value proposition. By listing exactly what Keisha will get from attending — free supplies, food support, clinical adjustments — it answers the implicit question 'why should I go?' The numbered format makes it easy to scan, and every item addresses one of her known barriers.",
        },
        {
          id: "email-c",
          approach: "Clinical-partnership",
          subject: "Keisha — a note from your care team about your 30-week check-in",
          content:
            "Dear Keisha,\n\nThis is Patricia Hawkins, your nurse, writing on behalf of both myself and Dr. Rebecca Martinez.\n\nYou're coming up on 30 weeks, and we wanted to talk to you directly about why this next prenatal visit matters — not to worry you, but because we believe you deserve to understand what's happening with your body right now.\n\nBetween weeks 28 and 36, gestational diabetes requires closer attention. Your placenta is producing more hormones that affect insulin, which means glucose levels that felt stable a few weeks ago may start to shift. This is completely normal, but it's also why we want to see you — so we can adjust your plan proactively.\n\nWe also know that managing gestational diabetes isn't just about medical visits. It's about having the right supplies, the right food, and the ability to actually get to your appointments. If any of those have been barriers:\n\n• Glucose strips and monitoring supplies covered through your Medicaid plan\n• Food assistance programs for gestational diabetes nutrition needs\n• Free medical transportation to and from your appointment\n\nWe've valued our relationship with you, Keisha. You've been an active participant in your care, and we want to continue that partnership through delivery.\n\nLet's get your appointment confirmed. Reply here, call us, or let us know what would make this easier.\n\nWith care,\nPatricia Hawkins, RN\nDr. Rebecca Martinez, OB-GYN",
          engagementLikelihood: "high",
          reasoning:
            "Takes a 'clinical partnership' approach — treating Keisha as a collaborator. The transparent explanation of what's happening physiologically respects her intelligence and gives real reasons to prioritize the visit. Acknowledging her previous engagement ('you've been an active participant') reinforces her identity as someone who cares about her health.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Keisha, your care team is looking forward to your 30-week prenatal visit. We're here to support you — tap to confirm your appointment or let us know if you need a ride.",
          engagementLikelihood: "medium",
          reasoning:
            "Warm and simple with a clear action. Proactively offering a ride removes a barrier before it becomes a reason to skip.",
        },
        {
          id: "inapp-b",
          approach: "Resource-focused",
          content:
            "Free glucose strips and nutrition support are ready for you at your next visit, Keisha. Tap to confirm your 30-week appointment with Dr. Martinez — we can arrange transportation too.",
          engagementLikelihood: "high",
          reasoning:
            "Leading with 'free glucose strips' immediately addresses her cost barrier and gives a tangible incentive to attend. Packing three value points into two sentences maximizes the impact of limited space.",
        },
        {
          id: "inapp-c",
          approach: "Milestone-anchored",
          content:
            "10 weeks to go, Keisha! Your 30-week visit with Dr. Martinez is coming up — an important check-in for your glucose plan as your body changes. Tap to confirm or reschedule.",
          engagementLikelihood: "medium",
          reasoning:
            "The countdown creates positive momentum. Mentioning 'as your body changes' gives a non-alarming clinical reason for the visit's importance. The option to reschedule reduces pressure and may prevent a no-show.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// JENNIFER — Midlife, perimenopause, engagement dropping
// Most natural scenario: re-engagement, warm-supportive
// ─────────────────────────────────────────────
mockData["jennifer-re-engagement-warm-supportive"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Jennifer, it's Angela from your care team. I know the HRT decision can feel overwhelming — there's no rush. I'm here when you're ready to talk it through, or if you just want to explore other options for managing symptoms. Text me anytime.",
          engagementLikelihood: "high",
          reasoning:
            "Directly acknowledges the decision point she's at (HRT) without pushing. The 'no rush' framing respects her process while the mention of 'other options' opens the door for continued engagement even if she decides against HRT. This meets her where she is rather than where the care team wants her to be.",
        },
        {
          id: "sms-b",
          approach: "Education-led",
          content:
            "Jennifer, many women find that perimenopause symptoms come in waves. Your nurse Angela has some new strategies for managing hot flashes and sleep disruption that other patients have found helpful. Interested? Reply YES.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with normalizing information (symptoms come in waves) and offers practical strategies. Peer proof ('other patients have found helpful') suggests relevance without being prescriptive. Less personal than variant A but may appeal to someone who wants actionable information.",
        },
        {
          id: "sms-c",
          approach: "Value-focused",
          content:
            "Hi Jennifer — reminder that your care benefit includes access to Dr. Sharma for perimenopause care and a mental health therapist for the anxiety side of things. Both are available virtually. Would either be helpful right now?",
          engagementLikelihood: "medium",
          reasoning:
            "Directly references both her physical symptoms (perimenopause) and emotional ones (anxiety) to show comprehensive care awareness. Naming the specific provider adds credibility. The question format invites engagement without assuming she needs it.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "No rush, Jennifer — just checking in",
          content:
            "Hi Jennifer,\n\nIt's Angela, your nurse partner on your care team. I wanted to reach out because it's been a few weeks since we last connected, and I want you to know I'm still here.\n\nI know the HRT decision isn't a simple one — it's deeply personal, and there's a lot of information to process. Whatever you decide, your care team is here to support you.\n\nIn the meantime, if you're looking for ways to manage your symptoms without committing to a big decision right now, I have some ideas:\n\n• Evidence-based strategies for hot flash management\n• Sleep hygiene techniques specifically for perimenopause\n• A check-in with our therapist about the anxiety and emotional changes (many women find this incredibly helpful)\n• Updated research on HRT that might help when you're ready to revisit the decision\n\nThere's no agenda here — just genuine support from someone who understands what this stage of life can feel like.\n\nReply anytime, or text me at your care team number.\n\nAngela Foster, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Masterfully addresses the HRT decision without pressure. Offers multiple intermediate steps that keep her engaged while she's deciding. Acknowledging this is 'deeply personal' shows respect for her autonomy. The therapist suggestion is positioned gently since anxiety is noted in her chart. The 'no agenda' line builds trust.",
        },
        {
          id: "email-b",
          approach: "Education-led",
          subject: "New approaches to perimenopause — without the big decisions",
          content:
            "Hi Jennifer,\n\nPerimenopause is one of those things that doesn't get talked about nearly enough — and when it does, the conversation often jumps straight to HRT or nothing.\n\nBut there's actually a lot in between. Here are some approaches my patients have found helpful:\n\n• Cognitive behavioral therapy for insomnia (CBT-I) — particularly effective for the sleep disruption side\n• Specific dietary adjustments that can reduce hot flash frequency\n• Targeted exercise routines that help with mood, sleep, and bone health\n• Mindfulness practices designed for hormonal transition symptoms\n\nDr. Priya Sharma, your women's health specialist, stays current on all of this and can help you build an approach that fits your life — with or without HRT in the picture.\n\nWould you like to schedule a conversation with her? Or feel free to text me with questions first.\n\nAngela Foster, RN\nYour Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Positions the outreach as educational rather than a check-in, which may feel less loaded for someone who's avoiding a medical decision. The 'with or without HRT' framing explicitly removes pressure. Concrete strategies give her value even if she doesn't respond. May appeal to her analytical side given her employer-plan demographic.",
        },
        {
          id: "email-c",
          approach: "Holistic-wellness",
          subject: "Taking care of the whole you, not just the symptoms",
          content:
            "Hi Jennifer,\n\nI've noticed that perimenopause conversations often focus only on the physical symptoms — the hot flashes, the sleep disruption. But the emotional side matters just as much.\n\nMany of the women I work with in this stage of life describe feeling a mix of things: uncertainty, frustration, sometimes anxiety about what's changing. If any of that resonates, I want you to know that's completely normal — and there's support available.\n\nYour care benefit includes:\n\n• Therapy sessions with providers who specialize in midlife transitions (virtual, flexible scheduling)\n• Regular check-ins with me to talk through whatever's on your mind\n• Access to Dr. Sharma for any medical questions — at your pace\n\nYou were really engaged when we started working together, and I valued our conversations. I'd love to continue them whenever you're ready.\n\nNo pressure. Just know the door is open.\n\nAngela Foster, RN\nYour Nurse Care Partner",
          engagementLikelihood: "high",
          reasoning:
            "Uniquely addresses the emotional and psychological dimensions of perimenopause, which is often overlooked. References her noted anxiety without labeling it. Acknowledging that she was previously engaged validates her past participation and signals that the door is open without guilt. The holistic framing differentiates this from standard medical follow-ups.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hi Jennifer — Angela here. No rush on the HRT decision. I have some other symptom management ideas to share whenever you're ready. Tap to message me.",
          engagementLikelihood: "high",
          reasoning:
            "Directly acknowledges where she left off (HRT decision) and explicitly depressurizes it. Offering alternatives keeps the door open. Brief and personal for a notification.",
        },
        {
          id: "inapp-b",
          approach: "Education-led",
          content:
            "New strategies for perimenopause symptoms — beyond HRT. Your care team has a personalized guide ready. Tap to explore.",
          engagementLikelihood: "medium",
          reasoning:
            "Curiosity-driven approach with the promise of new, personalized information. The 'beyond HRT' framing may appeal to someone who's hesitant about that path. Less personal than variant A but content-forward.",
        },
        {
          id: "inapp-c",
          approach: "Wellness-focused",
          content:
            "Struggling with sleep? Your care team therapist specializes in menopause-related insomnia. Tap to book a virtual session.",
          engagementLikelihood: "medium",
          reasoning:
            "Targets a specific, actionable symptom (sleep disruption) rather than the broader perimenopause picture. The specificity makes it feel relevant and immediately useful. Connects directly to a service rather than a general check-in.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// JENNIFER — Midlife, perimenopause, engagement dropping
// Scenario: win-back, casual-friendly
// ─────────────────────────────────────────────
mockData["jennifer-win-back-casual-friendly"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Jennifer, it's Angela from Dr. Sharma's office. I've been thinking about you — I know you were weighing a lot of decisions around how you've been feeling lately. No pressure at all, just wanted you to know we're still here and would love to catch up whenever you're ready.",
          engagementLikelihood: "high",
          reasoning:
            "Jennifer was previously engaged, so a warm personal check-in from a familiar nurse she's already built rapport with can reactivate that connection. The 'no pressure' framing respects her autonomy around the HRT decision. For a patient whose engagement is dropping rather than gone, this gentle touch feels like a friend reaching out — not a system reminder.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Hey Jennifer! Angela here. We just started offering 15-min virtual check-ins for perimenopause support — super low-key, pajamas totally acceptable. Could be a good way to talk through what's been going on with sleep and everything else without a big appointment. Want me to set one up?",
          engagementLikelihood: "medium",
          reasoning:
            "Reducing friction is key for a disengaging patient. A 15-minute virtual option removes the barriers of scheduling, commuting, and formality. Naming sleep specifically shows Angela remembers her concerns. The casual humor makes it feel less like a clinical obligation and more like an easy yes.",
        },
        {
          id: "sms-c",
          approach: "Social-proof",
          content:
            "Jennifer, hi! It's Angela. A few of my patients around your age have told me the hot flashes hit different this time of year. If that's you too, just know you don't have to white-knuckle it. We've got some new options to talk through whenever you want. Text me back anytime!",
          engagementLikelihood: "medium",
          reasoning:
            "Normalizing her experience through social proof ('a few of my patients') reduces the isolation that often accompanies perimenopause. The seasonal reference makes it feel timely rather than automated. Mentioning 'new options' creates gentle curiosity without pressuring the HRT decision.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Just checking in on you, Jennifer",
          content:
            "Hi Jennifer,\n\nIt's Angela — I hope this finds you well (or at least managing, because I know perimenopause doesn't always cooperate with 'well').\n\nI realized it's been a while since we connected, and I wanted to reach out personally. I know last time we spoke you were sorting through a lot — the hot flashes, the sleep stuff, whether HRT felt right for you. Those are big things to sit with, and there's no timeline on any of it.\n\nI just want you to know that Dr. Sharma and I are still very much in your corner. If anything has shifted, or if you just want to talk things through again with fresh eyes, we'd love to hear from you.\n\nNo agenda, no pressure. Just a genuine 'hey, we miss having you around.'\n\nWarmly,\nAngela Foster, RN\nDr. Priya Sharma's Women's Health Team",
          engagementLikelihood: "high",
          reasoning:
            "This email mirrors how a caring nurse would actually write to a patient she has a relationship with. The parenthetical humor about perimenopause not cooperating signals authenticity. Explicitly naming the topics Jennifer was wrestling with shows Angela genuinely remembers her, which is powerful for re-engagement. The 'no agenda' close removes the transactional feel.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "Something new that made me think of you",
          content:
            "Hi Jennifer,\n\nAngela here from Dr. Sharma's team — I wanted to share something that made me think of you.\n\nWe've started doing short virtual perimenopause check-ins (15 minutes, camera optional, no gown required). A lot of women have told us that a full appointment feels like a big commitment when they're still figuring out what they want to do, and honestly, that feedback made a lot of sense to us.\n\nGiven everything you were navigating — the sleep disruption, the anxiety, weighing your options on HRT — this might be a comfortable way to reconnect without any big decisions on the table.\n\nIf you're interested, you can just reply to this email and I'll get something on the calendar. Or if you'd rather call, text, or even just think about it for another month, that's completely fine too.\n\nThinking of you,\nAngela Foster, RN\nDr. Priya Sharma's Women's Health Team",
          engagementLikelihood: "high",
          reasoning:
            "The subject line creates curiosity without being clickbait. Framing the virtual check-in as something born from patient feedback makes Jennifer feel like part of a community. Listing multiple response options (reply, call, text, or wait) gives her full control, which is critical for someone whose disengagement may stem from feeling pressured about the HRT decision.",
        },
        {
          id: "email-c",
          approach: "Milestone-reflection",
          subject: "It's been about 6 months — how are you doing?",
          content:
            "Hi Jennifer,\n\nI was looking at my patient notes this morning and realized it's been about six months since we last connected. Time flies — except when you're having a hot flash at 3 AM, in which case time moves very slowly.\n\nI've been wondering how things have been going for you. Perimenopause has a way of evolving — symptoms shift, priorities change, and sometimes the things you weren't ready for six months ago start to feel different.\n\nIf that's where you are, or even if you just want to say hi and let us know how you're doing, Dr. Sharma and I would genuinely love to hear from you. Your UnitedHealthcare plan covers these visits fully, so there's no cost barrier either.\n\nAnd if now still isn't the right time? Totally okay. We'll be here.\n\nTake care of yourself,\nAngela Foster, RN\nDr. Priya Sharma's Women's Health Team",
          engagementLikelihood: "medium",
          reasoning:
            "The time-based framing gives Jennifer implicit permission — six months is long enough that her feelings about HRT may have evolved. The humor about hot flashes at 3 AM is specific enough to feel personal. Mentioning UnitedHealthcare coverage removes a potential objection. The closing reassurance that 'we'll be here' reduces urgency anxiety that can paradoxically push disengaging patients further away.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Hi Jennifer — Angela from Dr. Sharma's team here. We've missed you! Whenever you're ready to reconnect about how you've been feeling, we're just a tap away.",
          engagementLikelihood: "medium",
          reasoning:
            "'We've missed you' is personal without being guilt-inducing. The 'whenever you're ready' language respects Jennifer's timeline on the HRT decision and re-engagement alike.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "New: 15-min virtual perimenopause check-ins are now available — no big appointment needed. Angela and Dr. Sharma would love to catch up with you, Jennifer.",
          engagementLikelihood: "medium",
          reasoning:
            "Leading with the new, low-friction offering gives disengaging patients a reason to act now rather than 'someday.' Naming both Angela and Dr. Sharma reinforces the team relationship. The casual tone ('catch up') frames it as relational, not transactional.",
        },
        {
          id: "inapp-c",
          approach: "Social-proof",
          content:
            "Jennifer, many women revisit their perimenopause care plan around this stage — and we're here if you'd like to do the same. Book a quick check-in with Angela anytime.",
          engagementLikelihood: "medium",
          reasoning:
            "Social proof ('many women') normalizes the act of re-engaging after a gap, which reduces any embarrassment Jennifer might feel about having gone quiet. The word 'revisit' implies her plan still exists and she's not starting over.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// JENNIFER — Midlife, perimenopause, engagement dropping
// Scenario: educational, clinical-informative
// ─────────────────────────────────────────────
mockData["jennifer-educational-clinical-informative"] = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi Jennifer, it's Angela from Dr. Sharma's office. I know you've been dealing with sleep disruption and hot flashes — recent clinical guidance confirms these symptoms often intensify in the mid-40s and there are effective, evidence-based options. We'd love to walk you through what's new whenever you're ready.",
          engagementLikelihood: "medium",
          reasoning:
            "Leading with acknowledgment of her specific symptoms before pivoting to clinical evidence shows that the information isn't generic. The phrase 'recent clinical guidance' signals authority without being intimidating. For a patient considering HRT but undecided, knowing that guidance has evolved may prompt re-engagement.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Jennifer — Angela here. New research shows that cognitive behavioral therapy for insomnia (CBT-I) can reduce perimenopause sleep disruption by up to 50%, and it's fully covered under your UnitedHealthcare plan. Dr. Sharma can discuss whether this or other approaches fit your situation. Want me to schedule a consult?",
          engagementLikelihood: "high",
          reasoning:
            "Delivers a specific, actionable clinical fact (CBT-I efficacy data) tied to a symptom Jennifer has reported. Mentioning insurance coverage removes the cost question immediately. Importantly, this offers a non-HRT option, which may feel safer for a patient ambivalent about hormone therapy.",
        },
        {
          id: "sms-c",
          approach: "Research-update",
          content:
            "Hi Jennifer, Angela from Dr. Sharma's team. The Menopause Society recently updated their position on HRT safety for women in their 40s — the risk-benefit profile is more favorable than previously thought. If this is still on your mind, Dr. Sharma can review the latest data with you. No rush, just wanted you to have current info.",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses Jennifer's pending HRT decision with new evidence. Citing a specific professional society adds authority. The phrase 'more favorable than previously thought' creates an information gap — she'll want to know the details. 'No rush' respects her pace.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Understanding what's happening with your body right now",
          content:
            "Dear Jennifer,\n\nI'm reaching out because I know you've been experiencing hot flashes, sleep disruption, and anxiety — and I want to make sure you have access to the most current clinical understanding of what's driving these symptoms.\n\nAt 45, you're in what we call the menopause transition, when estrogen and progesterone levels fluctuate unpredictably. This hormonal variability — not just decline — is what causes vasomotor symptoms (hot flashes), disrupts sleep architecture, and can amplify anxiety through its effects on serotonin and GABA regulation.\n\nHere's what the evidence tells us:\n\n• Hot flashes affect approximately 80% of women during this transition, with average duration of 7-10 years\n• Sleep disruption in perimenopause is both hormone-driven and independently treatable\n• Anxiety during perimenopause has a physiological basis — it's not \"just stress\"\n\nUnderstanding the biology doesn't fix the symptoms, but many of my patients tell me it helps to know there's a clear explanation for what they're experiencing.\n\nDr. Sharma and I would be glad to review your specific symptom pattern and discuss the full range of management options — hormonal and non-hormonal — at your convenience. Your UnitedHealthcare coverage includes comprehensive perimenopause consultations.\n\nWith care,\nAngela Foster, RN\nDr. Priya Sharma, MD — Women's Health",
          engagementLikelihood: "high",
          reasoning:
            "Validates Jennifer's experience by explaining the physiological mechanisms behind each of her three reported symptoms. For an educated patient who's been researching HRT independently, this level of clinical detail signals expertise beyond what she'll find online. The framing that anxiety has 'a physiological basis' is particularly powerful — many perimenopausal women feel dismissed.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "New perimenopause management options covered by your plan",
          content:
            "Dear Jennifer,\n\nI wanted to update you on several evidence-based perimenopause management options that have become available or received updated clinical guidance since we last spoke.\n\nFor hot flashes:\n• Hormone replacement therapy (HRT): The Menopause Society's 2024 position statement reaffirms that for women under 60 or within 10 years of menopause onset, the benefits of HRT generally outweigh the risks. Low-dose transdermal estrogen carries the most favorable safety profile.\n• Fezolinetant (Veozah): A non-hormonal prescription option FDA-approved specifically for vasomotor symptoms. Clinical trials showed a 65% reduction in moderate-to-severe hot flashes.\n\nFor sleep disruption:\n• CBT-I (Cognitive Behavioral Therapy for Insomnia): Considered first-line treatment, with studies showing 50% improvement in sleep quality for perimenopausal women.\n• Sleep hygiene protocols tailored to hormonal fluctuations\n\nFor anxiety:\n• SSRIs at low doses have demonstrated efficacy for perimenopause-related anxiety independent of their antidepressant effects\n• Mindfulness-based stress reduction (MBSR) programs — your plan covers 8-week group sessions\n\nAll of these options are covered under your UnitedHealthcare employer plan, and several can be discussed and initiated in a single visit.\n\nDr. Sharma is particularly experienced with individualized perimenopause care plans, and I know she'd value the chance to review these options with you.\n\nBest regards,\nAngela Foster, RN\nDr. Priya Sharma, MD — Women's Health",
          engagementLikelihood: "high",
          reasoning:
            "Provides dense, immediately useful clinical information organized by Jennifer's exact symptoms. Including both HRT and non-HRT options for each symptom shows the team isn't steering her toward one decision. Specific data points (65% reduction, 50% improvement) build trust. Noting everything is covered under her plan removes logistical objections.",
        },
        {
          id: "email-c",
          approach: "Research-update",
          subject: "Updated clinical guidance on HRT — what's changed since we last spoke",
          content:
            "Dear Jennifer,\n\nI'm writing because I know the question of hormone replacement therapy was on your mind when we last met, and there have been meaningful updates in the clinical literature that I think you'd want to be aware of.\n\nThe large-scale WHI study, which originally raised concerns about HRT in the early 2000s, has now published 20+ years of follow-up data. The key findings for women in your age group:\n\n1. Women who initiated HRT between ages 40-50 showed no increased cardiovascular risk — and in some analyses, a reduced risk\n2. Breast cancer risk with combined HRT remains modestly elevated but is comparable to the risk associated with regular alcohol consumption or obesity — context that was missing from early reporting\n3. Transdermal estrogen (patches, gels) appears to carry lower clotting risk than oral formulations\n4. Quality-of-life improvements in vasomotor symptoms, sleep, mood, and bone density are well-documented and significant\n\nThe risk-benefit conversation around HRT has shifted substantially, particularly for women in their mid-40s with significant vasomotor and sleep symptoms — which describes your situation. This doesn't mean HRT is automatically the right choice, but it does mean the decision can be made with better data than was available even a few years ago.\n\nDr. Sharma stays current with this literature and would welcome the opportunity to walk you through how it applies to your specific health profile.\n\nI know this is a decision you want to make thoughtfully, and we respect that. When you're ready, we're here.\n\nSincerely,\nAngela Foster, RN\nDr. Priya Sharma, MD — Women's Health",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses the clinical question Jennifer has been sitting with — HRT safety. By presenting the evolved WHI data with nuance (acknowledging both reassuring findings and remaining risks), it positions the care team as balanced and trustworthy. The risk comparisons (alcohol, obesity) provide useful context for magnitude. For a patient whose disengagement may stem from decision paralysis, updated evidence gives her a reason to re-engage.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Jennifer, perimenopause symptoms like yours — hot flashes, sleep disruption, anxiety — have well-understood physiological causes and effective treatments. Dr. Sharma can walk you through the latest evidence.",
          engagementLikelihood: "medium",
          reasoning:
            "Validating that her symptoms have 'well-understood physiological causes' combats the dismissiveness many perimenopausal women encounter. The clinical tone matches the educational goal while remaining concise for in-app format.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "New: Non-hormonal options for perimenopause hot flashes are now available and covered by your UnitedHealthcare plan. Tap to learn about FDA-approved treatments Dr. Sharma recommends.",
          engagementLikelihood: "medium",
          reasoning:
            "For a patient ambivalent about HRT, highlighting a non-hormonal FDA-approved alternative is strategically valuable — it shows the care team has options beyond the decision she's stuck on. Mentioning coverage removes a barrier.",
        },
        {
          id: "inapp-c",
          approach: "Research-update",
          content:
            "Updated: Long-term HRT safety data for women in their 40s now available. The risk-benefit profile has shifted since your last visit. Dr. Sharma can review what's changed — schedule a consult anytime.",
          engagementLikelihood: "medium",
          reasoning:
            "'Has shifted since your last visit' implies she's missing something relevant, which is a strong motivator for an information-oriented patient. Pointing to Dr. Sharma maintains the personal clinical relationship.",
        },
      ],
    },
  ],
};

// Build a default fallback that's generic but still good quality
const defaultResponse: GenerateResponse = {
  provider: "mock",
  generatedAt: new Date().toISOString(),
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content:
            "Hi, this is your care team. We're thinking of you and just wanted to check in. How are you doing? We're here for you — text us anytime, day or night.",
          engagementLikelihood: "high",
          reasoning:
            "Simple, warm, and non-presumptuous. Opens with care and provides a clear channel for response. The 'day or night' reinforces 24/7 availability without being sales-focused.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Reminder: your care benefit gives you 24/7 access to your nurse care partner, specialists, and virtual visits — all at no cost. We're here whenever you need us. Reply HELLO to connect.",
          engagementLikelihood: "medium",
          reasoning:
            "Focuses on communicating the breadth of available benefits. The no-cost emphasis removes a common barrier. The reply keyword provides a simple action path.",
        },
        {
          id: "sms-c",
          approach: "Education-led",
          content:
            "Did you know your dedicated nurse can help answer health questions anytime by text? No appointment needed — just send a message whenever something comes up.",
          engagementLikelihood: "medium",
          reasoning:
            "Highlights the most accessible entry point (text questions, no appointment). Positions the service as easy and barrier-free. May be especially effective for patients who haven't tried the text feature yet.",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Empathy-led",
          subject: "Your care team is here for you",
          content:
            "Hi,\n\nI wanted to reach out personally to let you know that your care team is here for you.\n\nWhether you have a health question, need to schedule a visit, or just want to talk something through — we're available 24/7 by text, phone, or video.\n\nHere's what's available to you:\n\n• Your dedicated nurse care partner — available anytime\n• Virtual visits with specialists — no referral needed\n• Personalized health resources and guidance\n\nPlease don't hesitate to reach out for anything, big or small.\n\nYour Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Warm, professional, and comprehensive. Lists key services as reminders. Works as a general-purpose touchpoint for any lifecycle stage.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "A quick reminder about your care benefits",
          content:
            "Hi,\n\nJust a friendly reminder that your care benefits are active and ready whenever you need them:\n\n• Unlimited text access to your nurse care partner\n• Virtual visits with specialists across women's health, mental health, and nutrition\n• 24/7 support for any health questions or concerns\n• Personalized care based on your unique needs\n\nMany patients tell us that simply knowing support is a text away brings peace of mind.\n\nReply to this email or text us anytime to get started.\n\nYour Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Straightforward benefit reminder with social proof. Lists concrete services. Multiple response channels reduce friction. Works for both new and returning patients.",
        },
      ],
    },
    {
      channel: "in-app",
      variants: [
        {
          id: "inapp-a",
          approach: "Empathy-led",
          content:
            "Your care team is thinking of you. Tap to send a message or schedule a virtual visit.",
          engagementLikelihood: "medium",
          reasoning:
            "Brief and warm. Two clear action paths. Works as both push notification and in-app banner. Applicable to any lifecycle stage.",
        },
        {
          id: "inapp-b",
          approach: "Value-focused",
          content:
            "Your 24/7 care access is active. Text your nurse partner, book a visit, or explore your health resources. Tap to start.",
          engagementLikelihood: "medium",
          reasoning:
            "Emphasizes the always-on nature of the service. Multiple entry points give the patient choice. The 'active' framing creates a sense of something available to be used.",
        },
      ],
    },
  ],
};

export function getMockResponse(
  patientId: string,
  goal: string,
  tone: string,
  channels: string[]
): GenerateResponse {
  // Try patient-specific mock with exact match first
  const specificKey = `${patientId}-${goal}-${tone}`;
  let response = mockData[specificKey];

  // Try same patient + same goal (any tone)
  if (!response) {
    const goalKey = Object.keys(mockData).find(
      (k) => k.startsWith(`${patientId}-${goal}-`)
    );
    if (goalKey) response = mockData[goalKey];
  }

  // Try same patient + same tone (any goal)
  if (!response) {
    const toneKey = Object.keys(mockData).find(
      (k) => k.startsWith(`${patientId}-`) && k.endsWith(`-${tone}`)
    );
    if (toneKey) response = mockData[toneKey];
  }

  // Fall back to patient's first available scenario
  if (!response) {
    const patientKeys = Object.keys(mockData).filter((k) =>
      k.startsWith(`${patientId}-`)
    );
    if (patientKeys.length > 0) {
      response = mockData[patientKeys[0]];
    }
  }

  // Final fallback to generic default
  if (!response) {
    response = defaultResponse;
  }

  // Filter to requested channels only
  return {
    ...response,
    generatedAt: new Date().toISOString(),
    channelMessages: response.channelMessages.filter((cm) =>
      channels.includes(cm.channel)
    ),
  };
}
