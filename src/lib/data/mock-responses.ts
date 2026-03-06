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
            "Hi Maria, this is Sarah Thompson from Pomelo Care! Congrats on your pregnancy. Your employer benefit includes a dedicated nurse partner (that's me!) for your entire journey — from questions at midnight to help finding the right OB. No cost to you. Can I tell you more? Just reply YES.",
          engagementLikelihood: "high",
          reasoning:
            "Leads with congratulations to create a positive first impression. Names the nurse directly to establish a human connection from the start. Emphasizes the no-cost aspect since she's on an employer plan. The midnight question example makes the benefit tangible and relatable for a first-time mom who doesn't yet know what she doesn't know.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Maria, did you know your Aetna plan includes free virtual pregnancy care through Pomelo Care? That means 24/7 nurse access, specialist visits, and personalized support — all from home. Text LEARN to get started.",
          engagementLikelihood: "medium",
          reasoning:
            "Leads with the insurance connection which adds credibility and explains why she's being contacted. Lists concrete benefits concisely. However, it's less personal than variant A since it doesn't name the nurse or acknowledge the emotional aspect of a first pregnancy.",
        },
        {
          id: "sms-c",
          approach: "Peer-support",
          content:
            "Hi Maria! Many first-time moms tell us the hardest part is knowing what questions to ask. That's where your Pomelo Care nurse comes in — think of it as having a knowledgeable friend who's always a text away. Interested? Reply YES.",
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
            "Hi Maria,\n\nCongratulations on your pregnancy! I'm Sarah Thompson, a registered nurse at Pomelo Care, and I'd love to be part of your care team.\n\nThrough your employer benefit with Aetna, you have access to something really special — a dedicated nurse partner who's available 24/7 by text, phone, or video. That's me.\n\nHere's what that actually looks like:\n\n• Text me at 2 AM when you can't sleep and have a weird symptom — I'll answer\n• Get connected with OB-GYNs, nutritionists, and mental health specialists — no referral needed\n• Receive personalized guidance for every stage of your pregnancy\n• All of this at no cost to you\n\nI know a first pregnancy can feel overwhelming — so much information, so many opinions. My job is to be your trusted guide through it all.\n\nWould you like to schedule a quick 15-minute intro call? I'd love to learn about you and how I can best support you.\n\nWarmly,\nSarah Thompson, RN\nYour Pomelo Care Nurse Partner",
          engagementLikelihood: "high",
          reasoning:
            "Deeply personal and warm without being presumptuous. Uses specific, relatable examples (2 AM texts, weird symptoms) that make the benefit tangible. Acknowledges the information overload of first pregnancies. The 15-minute ask is low-commitment. Signed from the actual nurse to establish the relationship from email one.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "Your Aetna plan includes something you should know about",
          content:
            "Hi Maria,\n\nI'm reaching out because your employer plan through Aetna includes a benefit many people don't know about: free, comprehensive pregnancy support through Pomelo Care.\n\nHere's what's included at no extra cost:\n\n• A dedicated nurse partner available 24/7 by text, phone, or video\n• Virtual visits with OB-GYNs, maternal-fetal medicine specialists, nutritionists, and therapists\n• Personalized care plans based on your specific pregnancy\n• Support from preconception through postpartum\n\nPomelo Care partners with leading health plans to provide this support because better-supported pregnancies lead to better outcomes — for both moms and babies.\n\nGetting started takes about 5 minutes. Just reply to this email or call us anytime.\n\nYour Pomelo Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Takes a more informational approach, which may work well for someone who is analytical or wants to understand the 'why' before engaging. The insurance framing adds legitimacy. Less emotionally warm than variant A, but covers more concrete details about what's available. The 5-minute time investment is a very low barrier.",
        },
        {
          id: "email-c",
          approach: "Education-led",
          subject: "12 weeks pregnant? Here's what to expect this trimester",
          content:
            "Hi Maria,\n\nAt 12 weeks, you're wrapping up your first trimester — a huge milestone! Here are a few things that might be on your mind right now:\n\n• Your next prenatal visit and what screening tests to expect\n• When (and how) to share the news at work\n• Managing first-trimester fatigue as it starts to ease\n• Starting to think about your birth preferences\n\nAs your nurse partner through Pomelo Care, I can help with all of this — and anything else that comes up along the way. Your employer benefit gives you 24/7 access to me and a full team of specialists.\n\nThe best part? Many of my patients say they wish they'd connected with us sooner.\n\nReady to chat? Just reply to this email.\n\nSarah Thompson, RN\nYour Pomelo Care Nurse Partner",
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
            "Hi Ashley, it's Michelle from your Pomelo Care team! I know life with a retail schedule can be hectic. I'd love to set up your first virtual visit — we have evening and weekend slots that might work better. What days are usually good for you?",
          engagementLikelihood: "high",
          reasoning:
            "Acknowledges her specific barrier (irregular retail hours) without making her feel judged for not scheduling yet. Offering evening/weekend slots directly addresses the obstacle. Asking for her preference gives her control and makes responding easy.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Ashley, quick reminder: your Pomelo Care team is ready for you! With your history, Dr. Okafor wants to review your care plan early. We have flexible virtual appointments — even evenings. Reply BOOK and I'll find a time.",
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
            "Hi Ashley,\n\nI'm Michelle Rivera, your nurse care partner at Pomelo Care. I'm so glad you enrolled — and I completely understand that finding time for one more appointment can feel impossible, especially with a demanding work schedule.\n\nHere's the thing: your first visit doesn't have to be complicated. It's a casual 20-minute video call where we'll:\n\n• Get to know each other\n• Review your pregnancy history so we can plan ahead\n• Set up your 24/7 text access (so you can reach me anytime — even from the break room)\n• Answer any questions you have right now\n\nI have availability:\n• Weekday evenings (6-9 PM)\n• Saturday mornings\n• Or whenever works for you — we're flexible\n\nJust reply with a day/time that works, and I'll confirm it.\n\nLooking forward to meeting you,\nMichelle Rivera, RN\nYour Pomelo Care Nurse Partner",
          engagementLikelihood: "high",
          reasoning:
            "Directly addresses the scheduling barrier with specific flexible times. Sets clear expectations about the first visit (20 min, casual, video) to reduce anxiety about time commitment. The break room reference shows understanding of her daily reality. Lists what she'll get from the visit so she sees the value upfront.",
        },
        {
          id: "email-b",
          approach: "Clinical-context",
          subject: "Your care team is ready for your 18-week check-in",
          content:
            "Hi Ashley,\n\nAt 18 weeks, you're at an important point in your pregnancy — and given your history, your care team wants to make sure you have everything you need going forward.\n\nDr. James Okafor, your maternal-fetal medicine specialist, and I have put together a preliminary care plan for you. We'd love to walk you through it in a brief virtual visit. Here's what we'll cover:\n\n• Monitoring plan given your history of preterm birth and gestational hypertension\n• What to watch for and when to reach out\n• Setting up quick-access communication so you can text us anytime\n• Any questions or concerns on your mind\n\nThis visit is about 20 minutes and available at times that work with your schedule — including evenings and weekends.\n\nReply to this email or text us to book.\n\nMichelle Rivera, RN & Dr. James Okafor, MFM\nYour Pomelo Care Team",
          engagementLikelihood: "high",
          reasoning:
            "Takes a more clinical approach that emphasizes the medical rationale for connecting. Naming the MFM specialist adds authority. Mentioning the preliminary care plan creates a sense that something concrete is waiting for her. Still offers scheduling flexibility. This may resonate more with someone who responds to medical guidance.",
        },
        {
          id: "email-c",
          approach: "Peer-support",
          subject: "What other moms wish they'd known at 18 weeks",
          content:
            "Hi Ashley,\n\nA lot of the moms I work with tell me the same thing: 'I wish I'd set up my care team earlier.'\n\nAt 18 weeks, you're in a sweet spot — things are starting to feel more real, but you still have time to plan. And with your second pregnancy, you already know that having the right support makes all the difference.\n\nI'm Michelle, your nurse partner at Pomelo Care. Here's how I can help right now:\n\n• Review your birth experience from last time and plan for this one\n• Set up monitoring for things we want to keep an eye on\n• Be available 24/7 via text for anything — big or small\n\nLet's set up a quick intro call this week. I have evening slots available if that's easier.\n\nMichelle Rivera, RN\nYour Pomelo Care Nurse Partner",
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
            "Hi Keisha, it's Patricia from your Pomelo Care team. I've been thinking about you and just wanted to check in — no pressure. How are you and baby doing? I'm here whenever you're ready to talk. Just text back anytime.",
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
            "Hi Keisha,\n\nIt's Patricia, your nurse care partner. I've been thinking about you and wanted to reach out.\n\nI know managing gestational diabetes on top of everything else can feel like a lot — and I want you to know that there's no judgment here, only support. You don't have to do this alone.\n\nA few things I'd love to help with whenever you're ready:\n\n• Reviewing your glucose levels together and adjusting your plan if needed\n• Connecting you with programs that can help with testing supplies\n• Exploring food assistance options in your area\n• Scheduling a flexible check-in that works with your life\n\nYou can text me anytime at your Pomelo number, or just reply to this email. Even if you just want to vent — I'm here for it.\n\nTake care of yourself,\nPatricia Hawkins, RN\nYour Pomelo Care Nurse Partner\n\nP.S. If getting to appointments has been a challenge, we have virtual options and can help figure out transportation too.",
          engagementLikelihood: "high",
          reasoning:
            "Deeply personalized to Keisha's situation: gestational diabetes, supply costs, food insecurity, and transportation — all from her clinical record. The P.S. addresses transportation, a documented barrier. The no-judgment framing is essential for someone who's missed appointments and may feel guilt or shame. Multiple low-friction response options (text, email, vent) make re-engaging feel safe.",
        },
        {
          id: "email-b",
          approach: "Resource-focused",
          subject: "Resources we've found for you, Keisha",
          content:
            "Hi Keisha,\n\nYour care team has been working on some things behind the scenes that I think could really help:\n\n1. Glucose testing supply assistance — We've identified a program that can help cover the cost of testing strips and a new monitor if needed.\n\n2. Food support — There are local options for nutritious meal delivery and grocery assistance that work well for managing gestational diabetes.\n\n3. Transportation help — We can arrange rides for any appointments you need, or switch to virtual visits that you can do from home.\n\n4. Flexible check-ins — No need for formal appointments. You can text me your glucose numbers anytime and I'll review them same-day.\n\nNone of this requires a long call or appointment. Just reply to this email or text me, and I'll start getting things set up.\n\nYou're doing a great job, Keisha. Let us help make it a little easier.\n\nPatricia Hawkins, RN\nYour Pomelo Care Team",
          engagementLikelihood: "high",
          reasoning:
            "Reframes the outreach entirely around what the care team can give rather than what they need from Keisha. Each resource directly maps to a documented barrier. The 'behind the scenes' framing communicates that her team has been working for her even during the gap. The encouraging closing line ('you're doing a great job') is affirming without being patronizing.",
        },
        {
          id: "email-c",
          approach: "Clinical update",
          subject: "30-week update from your Pomelo Care team",
          content:
            "Hi Keisha,\n\nAs you reach 30 weeks, I wanted to share some important updates about this stage of pregnancy with gestational diabetes.\n\nAt this point, Dr. Martinez typically recommends:\n\n• More frequent glucose monitoring — but we can make this easy via text\n• A check-in to review whether your current management plan needs any adjustments\n• Connecting with our nutritionist for practical, budget-friendly meal ideas\n• Planning ahead for the final weeks, including delivery preparation\n\nI know things have been busy, and that's okay. We can work around your schedule and keep things flexible — a 10-minute call or even a quick text exchange is enough to make sure you and baby are on track.\n\nWe've also identified resources for testing supplies and food support that I'd love to tell you about.\n\nReply here or text me anytime.\n\nPatricia Hawkins, RN & Dr. Rebecca Martinez, OB-GYN\nYour Pomelo Care Team",
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
            "Hi Jennifer, it's Angela from Pomelo Care. I know the HRT decision can feel overwhelming — there's no rush. I'm here when you're ready to talk it through, or if you just want to explore other options for managing symptoms. Text me anytime.",
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
            "Hi Jennifer — reminder that your Pomelo benefit includes access to Dr. Sharma for perimenopause care and a mental health therapist for the anxiety side of things. Both are available virtually. Would either be helpful right now?",
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
            "Hi Jennifer,\n\nIt's Angela, your nurse partner at Pomelo Care. I wanted to reach out because it's been a few weeks since we last connected, and I want you to know I'm still here.\n\nI know the HRT decision isn't a simple one — it's deeply personal, and there's a lot of information to process. Whatever you decide, your care team is here to support you.\n\nIn the meantime, if you're looking for ways to manage your symptoms without committing to a big decision right now, I have some ideas:\n\n• Evidence-based strategies for hot flash management\n• Sleep hygiene techniques specifically for perimenopause\n• A check-in with our therapist about the anxiety and emotional changes (many women find this incredibly helpful)\n• Updated research on HRT that might help when you're ready to revisit the decision\n\nThere's no agenda here — just genuine support from someone who understands what this stage of life can feel like.\n\nReply anytime, or text me at your Pomelo number.\n\nAngela Foster, RN\nYour Pomelo Care Nurse Partner",
          engagementLikelihood: "high",
          reasoning:
            "Masterfully addresses the HRT decision without pressure. Offers multiple intermediate steps that keep her engaged while she's deciding. Acknowledging this is 'deeply personal' shows respect for her autonomy. The therapist suggestion is positioned gently since anxiety is noted in her chart. The 'no agenda' line builds trust.",
        },
        {
          id: "email-b",
          approach: "Education-led",
          subject: "New approaches to perimenopause — without the big decisions",
          content:
            "Hi Jennifer,\n\nPerimenopause is one of those things that doesn't get talked about nearly enough — and when it does, the conversation often jumps straight to HRT or nothing.\n\nBut there's actually a lot in between. Here are some approaches my patients have found helpful:\n\n• Cognitive behavioral therapy for insomnia (CBT-I) — particularly effective for the sleep disruption side\n• Specific dietary adjustments that can reduce hot flash frequency\n• Targeted exercise routines that help with mood, sleep, and bone health\n• Mindfulness practices designed for hormonal transition symptoms\n\nDr. Priya Sharma, your women's health specialist, stays current on all of this and can help you build an approach that fits your life — with or without HRT in the picture.\n\nWould you like to schedule a conversation with her? Or feel free to text me with questions first.\n\nAngela Foster, RN\nYour Pomelo Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Positions the outreach as educational rather than a check-in, which may feel less loaded for someone who's avoiding a medical decision. The 'with or without HRT' framing explicitly removes pressure. Concrete strategies give her value even if she doesn't respond. May appeal to her analytical side given her employer-plan demographic.",
        },
        {
          id: "email-c",
          approach: "Holistic-wellness",
          subject: "Taking care of the whole you, not just the symptoms",
          content:
            "Hi Jennifer,\n\nI've noticed that perimenopause conversations often focus only on the physical symptoms — the hot flashes, the sleep disruption. But the emotional side matters just as much.\n\nMany of the women I work with in this stage of life describe feeling a mix of things: uncertainty, frustration, sometimes anxiety about what's changing. If any of that resonates, I want you to know that's completely normal — and there's support available.\n\nYour Pomelo Care benefit includes:\n\n• Therapy sessions with providers who specialize in midlife transitions (virtual, flexible scheduling)\n• Regular check-ins with me to talk through whatever's on your mind\n• Access to Dr. Sharma for any medical questions — at your pace\n\nYou were really engaged when we started working together, and I valued our conversations. I'd love to continue them whenever you're ready.\n\nNo pressure. Just know the door is open.\n\nAngela Foster, RN\nYour Pomelo Care Nurse Partner",
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
            "Struggling with sleep? Your Pomelo Care therapist specializes in menopause-related insomnia. Tap to book a virtual session.",
          engagementLikelihood: "medium",
          reasoning:
            "Targets a specific, actionable symptom (sleep disruption) rather than the broader perimenopause picture. The specificity makes it feel relevant and immediately useful. Connects directly to a service rather than a general check-in.",
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
            "Hi, this is your Pomelo Care team. We're thinking of you and just wanted to check in. How are you doing? We're here for you — text us anytime, day or night.",
          engagementLikelihood: "high",
          reasoning:
            "Simple, warm, and non-presumptuous. Opens with care and provides a clear channel for response. The 'day or night' reinforces 24/7 availability without being sales-focused.",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content:
            "Reminder: your Pomelo Care benefit gives you 24/7 access to your nurse care partner, specialists, and virtual visits — all at no cost. We're here whenever you need us. Reply HELLO to connect.",
          engagementLikelihood: "medium",
          reasoning:
            "Focuses on communicating the breadth of available benefits. The no-cost emphasis removes a common barrier. The reply keyword provides a simple action path.",
        },
        {
          id: "sms-c",
          approach: "Education-led",
          content:
            "Did you know your Pomelo Care nurse can help answer health questions anytime by text? No appointment needed — just send a message whenever something comes up.",
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
            "Hi,\n\nI wanted to reach out personally to let you know that your Pomelo Care team is here for you.\n\nWhether you have a health question, need to schedule a visit, or just want to talk something through — we're available 24/7 by text, phone, or video.\n\nHere's what's available to you:\n\n• Your dedicated nurse care partner — available anytime\n• Virtual visits with specialists — no referral needed\n• Personalized health resources and guidance\n\nPlease don't hesitate to reach out for anything, big or small.\n\nYour Pomelo Care Team",
          engagementLikelihood: "medium",
          reasoning:
            "Warm, professional, and comprehensive. Lists key services as reminders. Works as a general-purpose touchpoint for any lifecycle stage.",
        },
        {
          id: "email-b",
          approach: "Value-focused",
          subject: "A quick reminder about your care benefits",
          content:
            "Hi,\n\nJust a friendly reminder that your Pomelo Care benefits are active and ready whenever you need them:\n\n• Unlimited text access to your nurse care partner\n• Virtual visits with specialists across women's health, mental health, and nutrition\n• 24/7 support for any health questions or concerns\n• Personalized care based on your unique needs\n\nMany patients tell us that simply knowing support is a text away brings peace of mind.\n\nReply to this email or text us anytime to get started.\n\nYour Pomelo Care Team",
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

  // Fall back to patient's default scenario if no exact match
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
