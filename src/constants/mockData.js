// Mock Data for Shubhanu Prototype

export const AVATAR_STYLES = [
  {
    id: 'fantasy',
    name: 'Fantasy Hero',
    world: 'World 1 — The Number Kingdom',
    color: '#8b5cf6', // Violet
    emoji: '⚔️',
    description: 'A magical knight equipped with a solar-powered shield and light sword, destined to solve ancient math puzzles.'
  },
  {
    id: 'space',
    name: 'Space Explorer',
    world: 'World 3 — The Science Planet',
    color: '#06b6d4', // Cyan
    emoji: '🚀',
    description: 'An astro-pioneer with a high-tech scanner suit, navigating weightless physics challenges across galaxies.'
  },
  {
    id: 'jungle',
    name: 'Jungle Ranger',
    world: 'World 2 — The Word Forest',
    color: '#10b981', // Emerald
    emoji: '🦁',
    description: 'A wildlands naturalist capable of translating phonetic calls and decoding letters written on ancient leaves.'
  },
  {
    id: 'ocean',
    name: 'Ocean Diver',
    world: 'World 4 — The History Vault',
    color: '#3b82f6', // Ocean Blue
    emoji: '🐙',
    description: 'A deep-sea archaeologist unlocking historical scrolls buried in sunken pirate galleons and coral caves.'
  }
];

export const ONBOARDING_PHOTOS = [
  {
    id: 'photo_boy',
    name: 'Aarav (Age 6)',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1602030028438-4cf153cabb9e?auto=format&fit=crop&q=80&w=400',
    segmentationPoints: 'M 130 180 C 130 110, 270 110, 270 180 C 270 250, 130 250, 130 180 Z M 100 320 C 130 260, 270 260, 300 320 L 280 400 L 120 400 Z'
  },
  {
    id: 'photo_girl',
    name: 'Shubhra (Age 5)',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1595064019314-e58b5ac49f63?auto=format&fit=crop&q=80&w=400',
    segmentationPoints: 'M 135 175 C 135 105, 265 105, 265 175 C 265 245, 135 245, 135 175 Z M 95 325 C 125 255, 275 255, 305 325 L 290 400 L 110 400 Z'
  }
];

// High-Fidelity Curriculum & Branching Story nodes
export const STORY_CHAPTER = {
  chapterId: 1,
  worldId: 1,
  worldName: 'The Number Kingdom',
  title: 'The Gate of Count Castle',
  ageGroup: '5-7',
  difficulty: 'Beginner',
  
  // Chapter gameplay steps
  steps: [
    {
      id: 'intro',
      type: 'story',
      text_en: 'Greetings, young Hero! The Dark Dragon has locked the massive gates of Count Castle using three magical lock-puzzles, trapping the numbers inside! Shubh-Buddy needs your help. Look, the first lock requires a glowing key code!',
      text_hi: 'नमस्ते छोटे वीर! डार्क ड्रैगन ने काउंट कैसल के विशाल द्वारों को तीन जादुई पहेली-तालों से बंद कर दिया है, जिससे सारे नंबर अंदर कैद हो गए हैं! शुभ-बडी को आपकी मदद की ज़रूरत है। देखो, पहले ताले को खोलने के लिए एक चमकता हुआ कोड चाहिए!',
      text_es: '¡Saludos, joven héroe! ¡El Dragón Oscuro ha cerrado las puertas del Castillo de los Números con tres candados mágicos, atrapando los números dentro! ¡Shubh-Buddy necesita tu ayuda! ¡Mira, el primer candado necesita un código!',
      speaker: 'Shubh-Buddy',
      illustration: 'castle-gate'
    },
    {
      id: 'challenge_1',
      type: 'quiz',
      question_en: 'Shubh-Buddy finds 3 glowing Gold Keys and 4 glowing Silver Keys in the grass. How many magical keys do we have in total to unlock the gate?',
      question_hi: 'शुभ-बडी को घास में 3 चमकती हुई सोने की चाबियां और 4 चमकती हुई चांदी की चाबियां मिलती हैं। द्वार खोलने के लिए कुल कितनी जादुई चाबियां हैं?',
      question_es: 'Shubh-Buddy encuentra 3 llaves de oro brillantes y 4 llaves de plata brillantes en la hierba. ¿Cuántas llaves mágicas tenemos en total para abrir la puerta?',
      options_en: ['5 keys', '6 keys', '7 keys', '8 keys'],
      options_hi: ['5 चाबियां', '6 चाबियां', '7 चाबियां', '8 चाबियां'],
      options_es: ['5 llaves', '6 llaves', '7 llaves', '8 llaves'],
      answerIndex: 2, // '7 keys'
      hint_en: 'Count all of them together! Start at 3 and count up 4 times: 4, 5, 6, 7!',
      hint_hi: 'सबको एक साथ गिनें! 3 से शुरू करें और 4 बार आगे गिनें: 4, 5, 6, 7!',
      hint_es: '¡Cuéntalas todas juntas! Empieza en 3 y cuenta 4 más: ¡4, 5, 6, 7!',
      xpAward: 100
    },
    {
      id: 'transition_mid',
      type: 'story',
      text_en: 'Click! The first lock pops open! As the gate creaks open, a silly Mud Monster blocks the corridor! It grumbles: "To pass, you must solve my blob puzzle!" Shubh-Buddy says: "We can do this!"',
      text_hi: 'क्लिक! पहला ताला खुल गया! जैसे ही दरवाज़ा धीरे से खुलता है, एक मज़ेदार कीचड़ का राक्षस रास्ता रोक लेता है! वह बुदबुदाता है: "आगे जाने के लिए, तुम्हें मेरी कीचड़ पहेली को सुलझाना होगा!" शुभ-बडी कहता है: "हम यह कर सकते हैं!"',
      text_es: '¡Clic! ¡El primer candado se abre! Mientras la puerta cruje al abrirse, ¡un divertido Monstruo de Lodo bloquea el pasillo! Refunfuña: "¡Para pasar, debes resolver mi rompecabezas!" Shubh-Buddy dice: "¡Podemos hacerlo!"',
      speaker: 'Shubh-Buddy',
      illustration: 'mud-monster'
    },
    // Challenge 2 has adaptive branching in state
    {
      id: 'challenge_2_standard',
      type: 'quiz',
      question_en: 'The Mud Monster is made of 6 green blobs, and 4 brown blobs join it. How many slimy blobs form the monster now?',
      question_hi: 'कीचड़ का राक्षस 6 हरे गोलों से बना है, और 4 भूरे गोले उसमें और जुड़ जाते हैं। अब राक्षस में कुल कितने चिपचिपे गोले हैं?',
      question_es: 'El Monstruo de Lodo está hecho de 6 gotas verdes, y se le unen 4 gotas marrones. ¿Cuántas gotas viscosas forman el monstruo ahora?',
      options_en: ['8 blobs', '9 blobs', '10 blobs', '12 blobs'],
      options_hi: ['8 गोले', '9 गोले', '10 गोले', '12 गोले'],
      options_es: ['8 gotas', '9 gotas', '10 gotas', '12 gotas'],
      answerIndex: 2, // '10 blobs'
      hint_en: 'Think of ten-frames! 6 + 4 is a magic pair that equals exactly 10.',
      hint_hi: 'दस के फ्रेम के बारे में सोचें! 6 + 4 मिलकर एक जादुई जोड़ी बनाते हैं जो ठीक 10 के बराबर होती है।',
      hint_es: '¡Piensa en marcos de diez! 6 + 4 es un par mágico que es igual a exactamente 10.',
      xpAward: 120
    },
    {
      id: 'challenge_2_easy', // Routed if failed challenge_1 or struggled
      type: 'quiz',
      question_en: 'Let’s make it simpler! The monster splits into 3 small blobs on the left and 2 small blobs on the right. Count them! How many small blobs are there?',
      question_hi: 'चलो इसे और आसान बनाते हैं! राक्षस बाईं ओर 3 छोटे गोलों और दाईं ओर 2 छोटे गोलों में बंट जाता है। उन्हें गिनें! कुल कितने छोटे गोले हैं?',
      question_es: '¡Hagámoslo más simple! El monstruo se divide en 3 gotas pequeñas a la izquierda y 2 gotas pequeñas a la derecha. ¡Cuéntalas! ¿Cuántas gotas pequeñas hay?',
      options_en: ['4 blobs', '5 blobs', '6 blobs'],
      options_hi: ['4 गोले', '5 गोले', '6 गोले'],
      options_es: ['4 gotas', '5 gotas', '6 gotas'],
      answerIndex: 1, // '5 blobs'
      hint_en: 'Hold up 3 fingers on one hand and 2 fingers on the other. Count them: 1, 2, 3, 4, 5!',
      hint_hi: 'एक हाथ में 3 उंगलियां और दूसरे हाथ में 2 उंगलियां उठाएं। उन्हें गिनें: 1, 2, 3, 4, 5!',
      hint_es: 'Levanta 3 dedos en una mano y 2 dedos en la otra. Cuéntalos: ¡1, 2, 3, 4, 5!',
      xpAward: 75
    },
    {
      id: 'challenge_2_hard', // Routed if aced challenge_1 in 1 attempt super fast
      type: 'quiz',
      question_en: 'Extreme Challenge! The giant monster absorbs more mud: It has 12 glowing blobs, and merges with 15 crystal blobs. How many blobs does it have in total?',
      question_hi: 'महा चुनौती! विशाल राक्षस और अधिक कीचड़ सोख लेता है: इसके पास 12 चमकते गोले हैं, और यह 15 क्रिस्टल गोलों के साथ जुड़ जाता है। इसके पास कुल कितने गोले हैं?',
      question_es: '¡Desafío Extremo! El monstruo gigante absorbe más lodo: tiene 12 gotas brillantes y se fusiona con 15 gotas de cristal. ¿Cuántas gotas tiene en total?',
      options_en: ['25 blobs', '27 blobs', '29 blobs'],
      options_hi: ['25 गोले', '27 गोले', '29 गोले'],
      options_es: ['25 gotas', '27 gotas', '29 gotas'],
      answerIndex: 1, // '27 blobs'
      hint_en: 'Add the ones first: 2 + 5 = 7. Then add the tens: 10 + 10 = 20. Combine them to get 27!',
      hint_hi: 'पहले इकाई संख्या को जोड़ें: 2 + 5 = 7। फिर दहाई को जोड़ें: 10 + 10 = 20। कुल मिलाकर 27 हुए!',
      hint_es: 'Suma las unidades primero: 2 + 5 = 7. Luego suma las decenas: 10 + 10 = 20. ¡Combínalos para obtener 27!',
      xpAward: 200
    },
    {
      id: 'boss_intro',
      type: 'story',
      text_en: 'Splosh! The Mud Monster turns into harmless bubble-water! We are at the final inner vault chamber. The legendary Dragon lock stands before us. It displays a spinning pizza puzzle! Shubh-Buddy whispers: "This is a fraction quiz, the mini-boss lock!"',
      text_hi: 'छपाक! कीचड़ का राक्षस हानिरहित बुलबुले-पानी में बदल गया! हम आख़िरी कमरे में हैं। हमारे सामने पौराणिक ड्रैगन ताला है। इस पर एक घूमती हुई पिज़्ज़ा पहेली दिख रही है! शुभ-बडी फुसफुसाता है: "यह एक भिन्न (fraction) पहेली है, बहुत ज़रूरी ताला!"',
      text_es: '¡Chof! ¡El Monstruo de Lodo se convierte en agua con burbujas inofensiva! Estamos en la última cámara. El legendario candado del Dragón está ante nosotros. ¡Muestra un rompecabezas de pizza giratorio! Shubh-Buddy susurra: "¡Este es un juego de fracciones!"',
      speaker: 'Shubh-Buddy',
      illustration: 'boss-chest'
    },
    {
      id: 'challenge_boss',
      type: 'quiz',
      question_en: 'The Dragon Lock shows two halves of a delicious cheese pizza. If we slide 1 half (1/2) and the other 1 half (1/2) together, how many WHOLE pizzas do they make?',
      question_hi: 'ड्रैगन लॉक एक स्वादिष्ट पनीर पिज़्ज़ा के दो आधे हिस्से दिखाता है। यदि हम 1 आधे (1/2) और दूसरे 1 आधे (1/2) हिस्से को एक साथ जोड़ते हैं, तो वे कितने पूरे पिज़्ज़ा बनाते हैं?',
      question_es: 'El Candado del Dragón muestra dos mitades de una deliciosa pizza de queso. Si juntamos 1 mitad (1/2) y la otra mitad (1/2), ¿cuántas pizzas ENTERAS hacen?',
      options_en: ['1/2 pizza', '1 whole pizza', '2 whole pizzas'],
      options_hi: ['1/2 पिज़्ज़ा', '1 पूरा पिज़्ज़ा', '2 पूरे पिज़्ज़ा'],
      options_es: ['1/2 pizza', '1 pizza entera', '2 pizzas enteras'],
      answerIndex: 1, // '1 whole pizza'
      hint_en: 'Two halves make a whole! Imagine putting two semi-circles together.',
      hint_hi: 'दो आधे हिस्से मिलकर एक पूरा बनाते हैं! कल्पना करें कि दो अर्धवृत्तों को एक साथ रखा जा रहा है।',
      hint_es: '¡Dos mitades hacen un todo! Imagina poner dos semicírculos juntos.',
      xpAward: 250
    },
    {
      id: 'outro',
      type: 'reward',
      text_en: 'KABOOM! The dragon lock shatters into gold stars! The gates fly open, and all the trapped numbers sing and dance! You saved the Number Kingdom! Shubh-Buddy rewards you with the Math Wizard Badge! You are amazing!',
      text_hi: 'धमाका! ड्रैगन का ताला सोने के सितारों में टूट गया! दरवाज़े खुल गए, और सभी कैद नंबर गाने और नाचने लगे! आपने नंबर किंगडम को बचा लिया! शुभ-बडी आपको मैथ विज़ार्ड बैज देता है! आप कमाल हैं!',
      text_es: '¡KABOOM! ¡El candado del dragón se rompe en estrellas de oro! ¡Las puertas se abren y todos los números atrapados cantan y bailan! ¡Salvaste el Reino de los Números! ¡Shubh-Buddy te premia con la insignia de Mago de las Matemáticas! ¡Eres increíble!',
      speaker: 'System',
      illustration: 'celebrate-star'
    }
  ]
};

// Shubh-Buddy Smart NLP Tutor replies based on age group and current context
export const NLP_RESPONSES = [
  {
    keywords: ['why', 'reason', 'use', 'addition', 'math'],
    '5-7': 'Math is like a super-power! Addition helps us count our toys, add up yummy strawberries, or see how many gold keys we collected to beat the Mud Monster! 🍎🧸',
    '8-11': 'Addition is the building block of all science and coding! It allows us to group quantities together, calculate scores in games, and measure speeds. Without addition, we couldn’t build rocket ships! 🚀',
    '12-14': 'Addition represents algebraic aggregation. It is the fundamental arithmetic operation. In programming, we use it for loop counters, accumulators, and vector math. It’s the origin of all algorithms! 💻'
  },
  {
    keywords: ['fraction', 'half', 'pizza', 'divided'],
    '5-7': 'Imagine a round pizza! If you cut it down the middle into 2 equal slices, each slice is called "one-half" (1/2). If you put both halves back, you get 1 whole yummy pizza again! 🍕',
    '8-11': 'Fractions represent parts of a whole. The bottom number (denominator) is how many equal pieces you cut it into, and the top number (numerator) is how many pieces you have. 2/2 equals 1! 📊',
    '12-14': 'Fractions are ratios of integers (rational numbers). A fraction a/b denotes a parts of a whole divided into b equal sections. Understanding fractions is critical for ratios, decimals, and probability calculations! 📐'
  },
  {
    keywords: ['who', 'shubh', 'buddy', 'avatar'],
    '5-7': 'I am Shubh-Buddy, your AI learning companion! I was inspired by a 5-year-old girl named Shubhra. I am here to help you solve quests, explain tough questions, and cheer for you! 🌟',
    '8-11': 'I am your personalized AI tutor. I track your quests, provide real-time hints when you get stuck, and translate complex lessons. I’m named after Pranav’s little sister, Shubhra! 🤖',
    '12-14': 'I am your adaptive NLP agent. I parse your questions using advanced LLM processing (Google Gemini 2.0) and generate contextually appropriate, safe, and curated educational prompts. 🧠'
  },
  {
    keywords: ['hindi', 'नमस्ते', 'क्या', 'गणित'],
    '5-7': 'नमस्ते! मैं आपका दोस्त शुभ-बडी हूँ। गणित एक जादू है जो हमें चीजें गिनने में मदद करता है। क्या आप मेरे साथ Count Castle को आज़ाद करेंगे? 🦁✨',
    '8-11': 'नमस्ते! मैं आपका एआई ट्यूटर हूँ। गणित का मतलब सिर्फ रटना नहीं, बल्कि समस्याओं को हल करना है। अगर आपको किसी भी सवाल में मदद चाहिए, तो मुझसे पूछें! 🌟',
    '12-14': 'नमस्ते! मैं शुभानु का एनएलपी (NLP) ट्यूटर सेवा हूँ। मैं आपकी शंकाओं को हिंदी और अंग्रेजी दोनों में सुलझा सकता हूँ। आपका स्वागत है! 📚'
  }
];

export const NLP_FALLBACK = {
  '5-7': 'That is an interesting question! Shubh-Buddy thinks we should focus on opening the gate first. Let’s solve the addition challenge, and we can explore more secrets of the castle together! 🏰✨',
  '8-11': 'Great question! Let’s stay on track with our current mission in World 1 (The Number Kingdom). Once we master these fractional locks, I can explain more about that topic! 📚🔑',
  '12-14': 'Query acknowledged. To optimize our learning path, let’s resolve the active challenge in Chapter 1: The Gate of Count Castle. I will gladly deep-dive into other subjects after this chapter is flagged completed! 🧠⚙️'
};

// Parent Dashboard Analytics & Logs
export const PARENT_ANALYTICS = {
  childName: 'Shubhra Harad',
  age: 5,
  currentWorld: 'The Number Kingdom',
  streakDays: 6,
  totalXp: 1420,
  storyGems: 180,
  subjectMastery: [
    { subject: 'Mathematics (World 1)', value: 85, color: '#8b5cf6' },
    { subject: 'English (World 2)', value: 65, color: '#10b981' },
    { subject: 'Science (World 3)', value: 40, color: '#06b6d4' },
    { subject: 'General Knowledge (World 4)', value: 15, color: '#3b82f6' }
  ],
  weeklyActivity: [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 250 },
    { day: 'Wed', xp: 90 },
    { day: 'Thu', xp: 320 },
    { day: 'Fri', xp: 180 },
    { day: 'Sat', xp: 280 },
    { day: 'Sun', xp: 180 }
  ],
  badges: [
    { id: 'badge_1', title: 'First Quest', desc: 'Completed onboarding avatar setup', icon: '✨', date: 'May 19, 2026' },
    { id: 'badge_2', title: 'Streak Starter', desc: 'Maintained learning for 5 days', icon: '🔥', date: 'May 22, 2026' },
    { id: 'badge_3', title: 'Math Wizard', desc: 'Unlocked the gates of Count Castle', icon: '🧙‍♂️', date: 'Just now!' }
  ],
  weeklyReport: `
# WEEKLY PROGRESS REPORT: SHUBHRA HARAD
**Reporting Period**: May 19 – May 25, 2026
**Target Level**: Ages 5-7 | World 1: Mathematics

---

## 📈 Executive Summary
Shubhra had an exceptionally productive week! She accumulated **1,420 total XP** and established a healthy **6-day active streak**. Her learning velocity is **24% higher** than the initial diagnostic baseline. She successfully unlocked Chapter 1 of *The Number Kingdom*.

## 🌟 Strengths & Achievements
*   **Visual counting and simple quantities**: Shubhra answered counting questions (3 gold keys + 4 silver keys) on her first attempt with a response speed of 12 seconds.
*   **Narrative Engagement**: Completed 100% of narrated story prompts, indicating high audio-visual focus.
*   **Badge Earned**: Unlocked the **Math Wizard** badge by defeating the gate Mini-Boss.

## ⚠️ Opportunities for Growth
*   **Abstract Carrying Pacing**: During double-digit addition branching, Shubhra initially paused for 45 seconds before selecting an option, triggering an easier sub-branch. 
*   **Recommendation**: In the coming week, the Adaptive Engine will feed more visual "ten-frame" models to bridge physical grouping and abstract numerical addition.

## 🛡️ Screen Time & Safety Logs
*   **Total Screen Time**: 2 hours, 15 minutes (Average: 19 mins/day). Well within the safe limits.
*   **Safety Compliance**: 100% of NLP Buddy queries were education-safe. Zero external link requests flagged.
*   **DPDP Compliance**: All biometric avatar segments remain isolated in AWS S3 (private-bucket, HTTPS only).

*Report compiled by Google Gemini 2.0 Flash on behalf of Shubhanu Services.*
  `
};

// Architecture Live Telemetry Mock
export const MICROSERVICES = [
  { id: 'auth', name: 'Auth Service', desc: 'Fastify | JWT & Refresh token validation', status: 'idle', color: '#a855f7' },
  { id: 'user', name: 'User Service', desc: 'Fastify | Child profiles & parental links', status: 'idle', color: '#a855f7' },
  { id: 'story', name: 'Story Engine', desc: 'FastAPI | Branching logic & content delivery', status: 'idle', color: '#ec4899' },
  { id: 'gamify', name: 'Gamification Service', desc: 'Node.js | Calculates XP, Badges & Streaks', status: 'idle', color: '#a855f7' },
  { id: 'avatar', name: 'Avatar Service', desc: 'FastAPI | SAM2 face mask & DreamBooth g4dn', status: 'idle', color: '#3b82f6' },
  { id: 'tutor', name: 'NLP Tutor Service', desc: 'FastAPI | Gemini Flash API contextual routing', status: 'idle', color: '#06b6d4' },
  { id: 'notify', name: 'Notification Service', desc: 'Node.js | FCM parental locking & progress alerts', status: 'idle', color: '#a855f7' },
  { id: 'analytics', name: 'Analytics Service', desc: 'Python | Logs RL weights & metrics', status: 'idle', color: '#ec4899' },
  { id: 'safety', name: 'Content Safety Service', desc: 'Python | OpenAI Moderation & Rekognition API', status: 'idle', color: '#eab308' }
];

export const DB_METRICS = {
  postgres: { name: 'PostgreSQL (AWS RDS)', tables: 'parents, children, progress, settings', status: 'Connected', records: 12 },
  mongodb: { name: 'MongoDB (Atlas Document)', collections: 'story_chapters, quests, dialog_logs', status: 'Connected', records: 48 },
  redis: { name: 'Redis (ElastiCache)', keys: 'sessions, leaderboards, streak_cache', status: 'Connected', records: 8 }
};
