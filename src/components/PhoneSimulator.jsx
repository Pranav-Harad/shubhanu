import React, { useState, useEffect, useRef } from 'react';
import { Camera, Volume2, HelpCircle, Trophy, MessageSquare, Shield, RefreshCw, X, ChevronRight, Play, Award, Lock, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AVATAR_STYLES, ONBOARDING_PHOTOS, STORY_CHAPTER, NLP_RESPONSES, NLP_FALLBACK } from '../constants/mockData';

// UI Bilingual Translations dictionary for layout elements
const UI_TEXT = {
  welcomeSub: {
    en: "We'll scan your photo, generate an amazing cartoon avatar, and build a magical story game starring YOU!",
    hi: "हम आपका फोटो स्कैन करेंगे, एक शानदार कार्टून अवतार बनाएंगे, और आपके अभिनय वाला एक जादुई कहानी खेल बनाएंगे!",
    es: "¡Escanearemos tu foto, generaremos un avatar de caricatura increíble y crearemos un juego con una historia mágica protagonizada por TI!"
  },
  startButton: {
    en: "Start My Adventure!",
    hi: "मेरी साहसिक यात्रा शुरू करें!",
    es: "¡Empieza mi aventura!"
  },
  uploadTitle: {
    en: "Upload Child Photo",
    hi: "बच्चे की फोटो डालें",
    es: "Cargar foto del niño"
  },
  uploadSub: {
    en: "Select a profile or upload any portrait photo from your computer:",
    hi: "एक प्रोफ़ाइल चुनें या अपने कंप्यूटर से कोई भी पोर्ट्रेट फोटो अपलोड करें:",
    es: "Selecciona un perfil o carga cualquier foto de retrato de tu computadora:"
  },
  backButton: {
    en: "← Back",
    hi: "← पीछे जाएं",
    es: "← Volver"
  },
  worldMapTitle: {
    en: "Select Story World",
    hi: "कहानी की दुनिया चुनें",
    es: "Selecciona el mundo"
  },
  worldMapSub: {
    en: "Master curriculums to unlock fantasy environments:",
    hi: "काल्पनिक वातावरणों को अनलॉक करने के लिए पाठ्यक्रम सीखें:",
    es: "Domina el aprendizaje para desbloquear mundos fantásticos:"
  },
  tutorTitle: {
    en: "Shubh-Buddy Tutor",
    hi: "शुभ-बडी ट्यूटर",
    es: "Tutor Shubh-Buddy"
  },
  tutorGreeting: {
    en: "Hi! I am your AI learning companion. Ask me *anything* about count castle, math additions, or fractions! I can explain in Hindi too! 🌟",
    hi: "नमस्ते! मैं आपका एआई मित्र हूँ। मुझसे काउंट कैसल, जोड़-घटाव या भिन्न (fractions) के बारे में कुछ भी पूछें! 🌟",
    es: "¡Hola! Soy tu compañero de aprendizaje. ¡Pregúntame lo que quieras sobre sumas, castillos o fracciones! 🌟"
  },
  tutorInput: {
    en: "Type standard or custom questions...",
    hi: "अपने सवाल यहाँ लिखें...",
    es: "Escribe tus preguntas aquí..."
  },
  easyBlob: {
    en: "Easy Math Blobs",
    hi: "आसान गणितीय गोले",
    es: "Gotas matemáticas simples"
  },
  trickyMonster: {
    en: "Tricky Math Monster!",
    hi: "कठिन गणितीय राक्षस!",
    es: "¡Monstruo matemático difícil!"
  },
  gateCastle: {
    en: "Castle Gate: Riddle 1",
    hi: "महल का दरवाज़ा: पहेली 1",
    es: "Puerta del castillo: Acertijo 1"
  },
  mudMonster: {
    en: "Friendly Slime Monster",
    hi: "मित्रतापूर्ण कीचड़ का राक्षस",
    es: "Monstruo de lodo amistoso"
  },
  fractionLock: {
    en: "Fraction Riddle Lock",
    hi: "भिन्न पहेली ताला",
    es: "Candado de fracciones"
  },
  questConquered: {
    en: "QUEST CONQUERED!",
    hi: "खोज पूरी हुई!",
    es: "¡MISION CONQUISTADA!"
  },
  questMastered: {
    en: "Quest Mastered!",
    hi: "खेल जीता!",
    es: "¡Misión completada!"
  },
  mathWizard: {
    en: "Math Wizard Title Gained",
    hi: "गणित जादूगर की उपाधि मिली",
    es: "Título de Mago de las Matemáticas"
  },
  continueBtn: {
    en: "Continue to Skill Tree",
    hi: "कौशल वृक्ष पर आगे बढ़ें",
    es: "Continuar al árbol de habilidades"
  },
  replayBtn: {
    en: "Replay Chapter",
    hi: "अध्याय फिर से खेलें",
    es: "Volver a jugar capítulo"
  },
  needHint: {
    en: "Need a hint?",
    hi: "मदद चाहिए?",
    es: "¿Necesitas ayuda?"
  },
  askShubh: {
    en: "Ask Shubh",
    hi: "शुभ से पूछें",
    es: "Preguntar a Shubh"
  },
  keepGoing: {
    en: "Keep Going! →",
    hi: "आगे बढ़ें! →",
    es: "¡Continuar! →"
  },
  nextQuest: {
    en: "Next Quest →",
    hi: "अगली पहेली →",
    es: "Siguiente misión →"
  }
};

// Canvas-based cartoon avatar renderer component
function CartoonAvatarCanvas({ skinColor = '#FCD34D', hairColor = '#3E2723', clothingColor = '#EF4444', size = 120, isAnimated = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let tick = 0;

    const render = () => {
      tick += 0.05;
      const bounce = isAnimated ? Math.sin(tick) * 3 : 0;
      
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      const cx = size / 2;
      const cy = size / 2;
      const scale = size / 120; // base scale

      // Draw background circle glow
      ctx.beginPath();
      ctx.arc(cx, cy, 55 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFDF9';
      ctx.fill();
      ctx.lineWidth = 3 * scale;
      ctx.strokeStyle = '#3E2723';
      ctx.stroke();

      // 1. Draw Body/Armor (Cape & Shoulders)
      ctx.beginPath();
      ctx.moveTo(cx - 30 * scale, cy + (35 + bounce) * scale);
      ctx.lineTo(cx + 30 * scale, cy + (35 + bounce) * scale);
      ctx.lineTo(cx + 40 * scale, cy + 60 * scale);
      ctx.lineTo(cx - 40 * scale, cy + 60 * scale);
      ctx.closePath();
      ctx.fillStyle = clothingColor;
      ctx.fill();
      ctx.lineWidth = 3 * scale;
      ctx.strokeStyle = '#3E2723';
      ctx.stroke();

      // Armor Gold Crest
      ctx.beginPath();
      ctx.arc(cx, cy + (48 + bounce) * scale, 8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.stroke();

      // 2. Draw Head/Face
      ctx.beginPath();
      ctx.arc(cx, cy + bounce * scale, 28 * scale, 0, Math.PI * 2);
      ctx.fillStyle = skinColor;
      ctx.fill();
      ctx.stroke();

      // 3. Draw Eyes (Duolingo style - big, friendly)
      // Left eye outer
      ctx.beginPath();
      ctx.arc(cx - 10 * scale, cy + (-2 + bounce) * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#3E2723';
      ctx.fill();
      // Right eye outer
      ctx.beginPath();
      ctx.arc(cx + 10 * scale, cy + (-2 + bounce) * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#3E2723';
      ctx.fill();
      // Left eye sparkle
      ctx.beginPath();
      ctx.arc(cx - 11 * scale, cy + (-4 + bounce) * scale, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      // Right eye sparkle
      ctx.beginPath();
      ctx.arc(cx + 9 * scale, cy + (-4 + bounce) * scale, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Cheek blush
      ctx.beginPath();
      ctx.arc(cx - 18 * scale, cy + (6 + bounce) * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 107, 107, 0.4)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 18 * scale, cy + (6 + bounce) * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 107, 107, 0.4)';
      ctx.fill();

      // 4. Draw Smile
      ctx.beginPath();
      ctx.arc(cx, cy + (8 + bounce) * scale, 8 * scale, 0, Math.PI);
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = '#3E2723';
      ctx.stroke();

      // 5. Draw Hair (Bouncy bangs and top)
      ctx.beginPath();
      ctx.arc(cx, cy + (-20 + bounce) * scale, 22 * scale, Math.PI, 0); // hair cap
      ctx.fillStyle = hairColor;
      ctx.fill();
      ctx.stroke();

      // Hair bangs details
      ctx.beginPath();
      ctx.moveTo(cx - 26 * scale, cy + (-10 + bounce) * scale);
      ctx.quadraticCurveTo(cx - 15 * scale, cy + (-15 + bounce) * scale, cx - 10 * scale, cy + (-10 + bounce) * scale);
      ctx.quadraticCurveTo(cx, cy + (-18 + bounce) * scale, cx + 10 * scale, cy + (-10 + bounce) * scale);
      ctx.quadraticCurveTo(cx + 15 * scale, cy + (-15 + bounce) * scale, cx + 26 * scale, cy + (-10 + bounce) * scale);
      ctx.lineTo(cx + 20 * scale, cy + (-28 + bounce) * scale);
      ctx.lineTo(cx - 20 * scale, cy + (-28 + bounce) * scale);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.fill();
      ctx.stroke();

      // Hero Headband or Crown on top of hair
      ctx.beginPath();
      ctx.moveTo(cx - 15 * scale, cy + (-24 + bounce) * scale);
      ctx.lineTo(cx, cy + (-35 + bounce) * scale);
      ctx.lineTo(cx + 15 * scale, cy + (-24 + bounce) * scale);
      ctx.closePath();
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.stroke();

      if (isAnimated) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [skinColor, hairColor, clothingColor, size, isAnimated]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className="max-w-full"
      style={{ display: 'block' }}
    />
  );
}

// Pixel scanning helper to extract skin/hair/apparel hex codes from parent photo upload
const samplePhotoColors = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      
      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');

      try {
        // Sample Hair (top middle)
        const hairData = ctx.getImageData(50, 15, 1, 1).data;
        let hair = rgbToHex(hairData[0], hairData[1], hairData[2]);

        // Sample Skin (center of face)
        const skinData = ctx.getImageData(50, 45, 1, 1).data;
        let skin = rgbToHex(skinData[0], skinData[1], skinData[2]);

        // Sample Clothing (bottom middle)
        const clothingData = ctx.getImageData(50, 85, 1, 1).data;
        let clothing = rgbToHex(clothingData[0], clothingData[1], clothingData[2]);

        // Basic clamping to cute palettes if too dark/light
        if (skin === '#000000' || skin === '#ffffff' || skinData[3] === 0) skin = '#FCD34D';
        if (hair === '#000000' || hair === '#ffffff' || hairData[3] === 0) hair = '#3E2723';
        if (clothing === '#000000' || clothing === '#ffffff' || clothingData[3] === 0) clothing = '#FF6B6B';

        resolve({ skin, hair, clothing });
      } catch (e) {
        resolve({ skin: '#FCD34D', hair: '#3E2723', clothing: '#FF6B6B' });
      }
    };
    img.onerror = () => {
      resolve({ skin: '#FCD34D', hair: '#3E2723', clothing: '#FF6B6B' });
    };
    img.src = imageUrl;
  });
};


// Standard vanilla Web Audio API sound generator (no assets needed, offline friendly!)
const playSoundEffect = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    if (type === 'pop') {
      // Gentle bubble popping feedback for tapping buttons
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'chime') {
      // Delightful major triad arpeggio for correct answers
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.22);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.22);
      });
    } else if (type === 'whoops') {
      // Soft downward glide for incorrect choices (gentle, never scary)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (err) {
    console.warn("Web Audio Context not permitted or active:", err);
  }
};

// Playful, interactive Shubh-Buddy Mascot Component
function ShubhBuddy({ state = 'waving', bubbleText }) {
  const emojis = {
    waving: '👋🤩',
    happy: '🎉✨',
    thinking: '🤔💡',
    sad: '🥺💖'
  };

  const animations = {
    waving: 'mascot-float',
    happy: 'mascot-happy',
    thinking: 'mascot-float',
    sad: 'mascot-sad'
  };

  return (
    <div className="flex items-center gap-3 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-[24px] p-3 shadow-[4px_4px_0_0_#3E2723] mb-4 shrink-0 transition-all">
      <div className={`w-12 h-12 rounded-full bg-[#FFD700] border-2 border-[#3E2723] flex items-center justify-center text-2xl shadow-[1.5px_1.5px_0_0_#3E2723] ${animations[state] || 'mascot-float'} shrink-0`}>
        <span>{emojis[state] || '👋🤩'}</span>
      </div>
      {bubbleText && (
        <div className="bg-[#FFFDF9] border border-[#3E2723]/25 rounded-2xl px-3 py-1.5 text-[11px] font-bold text-[#3E2723] leading-relaxed relative flex-1">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFFDF9] border-l border-b border-[#3E2723]/25 rotate-45"></div>
          {bubbleText}
        </div>
      )}
    </div>
  );
}

export default function PhoneSimulator({
  childProfile,
  setChildProfile,
  isBedtimeLocked,
  triggerKafkaEvent
}) {
  const [screen, setScreen] = useState('welcome'); // welcome -> photo_select -> sam2_scan -> dreambooth -> story_map -> story_game -> reward
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [activeAvatarStyle, setActiveAvatarStyle] = useState('fantasy');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' | 'incorrect'
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState([]);
  const [customQuery, setCustomQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState({}); // logs attempts per quiz
  
  // New approved execution states
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'es'
  const [avatarColors, setAvatarColors] = useState({ skin: '#FCD34D', hair: '#3E2723', clothing: '#FF6B6B' });
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [tappedItems, setTappedItems] = useState({}); // visual count tactile clicks

  // Custom branch tracker: tracks if child gets a question wrong and gets routed to 'easy', or gets it right instantly and gets 'hard'
  const [storyBranch, setStoryBranch] = useState('standard'); // 'standard' | 'easy' | 'hard'
  const [mascotState, setMascotState] = useState('waving');
  
  // Set mascot initial greeting localized
  const [mascotBubble, setMascotBubble] = useState("Hi! I'm Shubh! Ready for today's adventure?");

  // localized greetings depending on language toggle
  useEffect(() => {
    const greetings = {
      en: "Hi! I'm Shubh-Buddy! Ready for today's adventure?",
      hi: "नमस्ते! मैं हूँ शुभ-बडी! क्या आप आज के साहसिक सफर के लिए तैयार हैं?",
      es: "¡Hola! ¡Soy Shubh-Buddy! ¿Listo para la aventura de hoy?"
    };
    setMascotBubble(greetings[lang] || greetings.en);
  }, [lang]);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const activeChapterStep = STORY_CHAPTER.steps[currentStepIndex];

  // Reset visual counting sandbox on step transitions
  useEffect(() => {
    setTappedItems({});
  }, [currentStepIndex]);

  // Helper to read story text using Web Speech API with correct native voice accents
  const speakText = (text) => {
    if (!synth) return;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.35; // cute, animated child pitch
    utterance.rate = 0.85; // slower, clearer reading pace

    // Set voice and lang depending on chosen language code
    const voices = synth.getVoices();
    let selectedVoice = null;
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    } else if (lang === 'es') {
      utterance.lang = 'es-ES';
      selectedVoice = voices.find(v => v.lang.includes('es') || v.lang.includes('ES'));
    } else {
      utterance.lang = 'en-US';
      selectedVoice = voices.find(v => v.lang.includes('en') || v.lang.includes('US'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };


  useEffect(() => {
    // Clean up speech when component unmounts
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  // SAM2 Face scan progress mock
  useEffect(() => {
    if (screen === 'sam2_scan') {
      triggerKafkaEvent('photo.uploaded', 'Avatar Service', ['Content Safety Service'], {
        child_id: childProfile.childId,
        photo_url: selectedPhoto.url,
        safety_check: 'pending'
      });

      const timer = setTimeout(() => {
        triggerKafkaEvent('photo.moderated', 'Content Safety Service', ['Avatar Service'], {
          child_id: childProfile.childId,
          safety_status: 'passed',
          nsfw_score: 0.01
        });
        setScreen('dreambooth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // DreamBooth training progress mock
  useEffect(() => {
    if (screen === 'dreambooth') {
      setOnboardingProgress(0);
      triggerKafkaEvent('dreambooth.training.started', 'Avatar Service', ['Analytics Service'], {
        child_id: childProfile.childId,
        gpu_instance: 'g4dn.xlarge',
        epochs: 40
      });

      const interval = setInterval(() => {
        setOnboardingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerKafkaEvent('avatar.generated', 'Avatar Service', ['User Service', 'Notification Service'], {
              child_id: childProfile.childId,
              avatar_urls: AVATAR_STYLES.map(s => `s3://shubhanu-avatars/${s.id}.png`),
              styles: ['fantasy', 'space', 'jungle', 'ocean']
            });
            return 100;
          }
          return prev + 10;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Auto-narration for early learners (Ages 5-7) on dialog changes
  useEffect(() => {
    if (screen === 'story_game' && childProfile.ageGroup === '5-7' && activeChapterStep) {
      const textToSpeak = activeChapterStep.type === 'quiz' 
        ? (activeChapterStep[`question_${lang}`] || activeChapterStep.question) 
        : (activeChapterStep[`text_${lang}`] || activeChapterStep.text);
      
      const timer = setTimeout(() => {
        speakText(textToSpeak);
      }, 500);
      return () => {
        clearTimeout(timer);
        if (synth) synth.cancel();
      };
    }
  }, [screen, currentStepIndex, childProfile.ageGroup, lang]);

  // Tactile count-aloud math click handler
  const handleItemTap = (itemId) => {
    if (tappedItems[itemId]) return; // already counted
    const newTapped = { ...tappedItems, [itemId]: true };
    setTappedItems(newTapped);
    playSoundEffect('pop');
    
    const countNumber = Object.keys(newTapped).length;
    
    // Playful counting digits in active language
    const countSounds = {
      en: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"],
      hi: ["एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह"],
      es: ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Once", "Doce", "Trece", "Catorce", "Quince"]
    };

    if (activeChapterStep.id === 'challenge_boss') {
      // Special logic for pizza halves
      if (countNumber === 1) {
        speakText(lang === 'hi' ? "आधा पिज़्ज़ा!" : lang === 'es' ? "¡Media pizza!" : "One Half Pizza!");
      } else if (countNumber === 2) {
        speakText(lang === 'hi' ? "दो आधे मिलकर एक पूरा पिज़्ज़ा बनाते हैं!" : lang === 'es' ? "¡Dos mitades hacen una pizza entera!" : "Two halves make a whole pizza!");
        confetti({ particleCount: 40, spread: 30 });
      }
    } else {
      const word = (countSounds[lang] && countSounds[lang][countNumber - 1]) || countNumber.toString();
      speakText(word);
    }
  };

  // Handle Quiz Submissions (with adaptive learning branching logic!)
  const handleAnswerSubmit = (optionIdx) => {
    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === activeChapterStep.answerIndex;
    const qId = activeChapterStep.id;
    const currentAttempts = (quizAttempts[qId] || 0) + 1;
    setQuizAttempts({ ...quizAttempts, [qId]: currentAttempts });

    if (isCorrect) {
      setQuizFeedback('correct');
      confetti({ particleCount: 60, spread: 45, origin: { y: 0.7 } });
      playSoundEffect('chime');
      setMascotState('happy');
      
      const successBubbles = {
        en: "Hooray! You got it right! You are an amazing hero! +100 ⭐!",
        hi: "हुर्रे! आपने सही उत्तर दिया! आप एक अद्भुत नायक हैं! +100 ⭐!",
        es: "¡Hooray! ¡Lo hiciste bien! ¡Eres un héroe increíble! +100 ⭐!"
      };
      setMascotBubble(successBubbles[lang] || successBubbles.en);
      
      // Update Child Profile Stats (XP)
      const addedXp = activeChapterStep.xpAward;
      setChildProfile(prev => ({
        ...prev,
        totalXp: prev.totalXp + addedXp,
        storyGems: prev.storyGems + 10
      }));

      // Kafka Event
      triggerKafkaEvent('quiz.answered', 'Story Engine', ['Gamification Service', 'Analytics Service'], {
        child_id: childProfile.childId,
        challenge_id: qId,
        attempts: currentAttempts,
        success: true,
        xp_earned: addedXp,
        hints_used: hintShown
      });

      // Adaptive branching calculations:
      // If they aced Challenge 1 instantly, trigger standard or hard branch
      if (qId === 'challenge_1') {
        if (currentAttempts === 1) {
          setStoryBranch('hard');
        } else {
          setStoryBranch('standard');
        }
      }
    } else {
      setQuizFeedback('incorrect');
      playSoundEffect('whoops');
      setMascotState('sad');
      
      const tryAgainBubbles = {
        en: "Whoops! Don't worry, little hero! Let's check Shubh-Buddy's hint and try again!",
        hi: "ओह! चिंता न करें, छोटे नायक! शुभ-बडी का संकेत देखें और फिर से प्रयास करें!",
        es: "¡Whoops! ¡No te preocupes, pequeño héroe! ¡Mira la pista de Shubh-Buddy e inténtalo de nuevo!"
      };
      setMascotBubble(tryAgainBubbles[lang] || tryAgainBubbles.en);
      
      // Kafka Event (Failed attempt)
      triggerKafkaEvent('quiz.attempt.failed', 'Story Engine', ['Analytics Service'], {
        child_id: childProfile.childId,
        challenge_id: qId,
        attempts: currentAttempts,
        success: false,
        hints_used: hintShown
      });

      // Adaptive Routing: if they struggle, set branch to 'easy'
      if (qId === 'challenge_1') {
        setStoryBranch('easy');
      }
    }
  };

  // Skip to next step
  const handleNextStep = () => {
    setSelectedAnswer(null);
    setQuizFeedback(null);
    setHintShown(false);
    if (synth) synth.cancel();
    setIsSpeaking(false);

    // Dynamic story routing based on adaptive difficulty branch
    if (activeChapterStep.id === 'challenge_1') {
      setCurrentStepIndex(2); // Jump to transition_mid
    } else if (activeChapterStep.id === 'transition_mid') {
      if (storyBranch === 'easy') {
        // Find index of challenge_2_easy
        const idx = STORY_CHAPTER.steps.findIndex(s => s.id === 'challenge_2_easy');
        setCurrentStepIndex(idx);
      } else if (storyBranch === 'hard') {
        const idx = STORY_CHAPTER.steps.findIndex(s => s.id === 'challenge_2_hard');
        setCurrentStepIndex(idx);
      } else {
        const idx = STORY_CHAPTER.steps.findIndex(s => s.id === 'challenge_2_standard');
        setCurrentStepIndex(idx);
      }
    } else if (
      activeChapterStep.id === 'challenge_2_standard' ||
      activeChapterStep.id === 'challenge_2_easy' ||
      activeChapterStep.id === 'challenge_2_hard'
    ) {
      const idx = STORY_CHAPTER.steps.findIndex(s => s.id === 'boss_intro');
      setCurrentStepIndex(idx);
    } else if (activeChapterStep.id === 'outro') {
      // Award completed badge
      triggerKafkaEvent('chapter.completed', 'Story Engine', ['Gamification Service', 'Analytics Service', 'Notification Service'], {
        child_id: childProfile.childId,
        chapter_id: 1,
        final_score: storyBranch === 'easy' ? 0.6 : storyBranch === 'hard' ? 1.0 : 0.8,
        world_id: 1,
        badge_unlocked: 'Math Wizard'
      });
      
      setScreen('reward');
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // NLP Tutor Chat drawer mechanics
  const handleAskTutor = async (query) => {
    if (!query.trim()) return;
    const userMsg = { id: Date.now(), text: query, sender: 'child' };
    setTutorMessages(prev => [...prev, userMsg]);
    setCustomQuery('');
    setIsTyping(true);

    triggerKafkaEvent('tutor.query.received', 'NLP Tutor Service', ['Content Safety Service'], {
      child_id: childProfile.childId,
      query: query,
      chapter_id: STORY_CHAPTER.chapterId
    });

    try {
      const response = await fetch('http://localhost:8000/api/v1/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: childProfile.childId,
          query: query,
          ageGroup: childProfile.ageGroup
        })
      });
      const data = await response.json();
      
      triggerKafkaEvent('tutor.query.moderated', 'Content Safety Service', ['NLP Tutor Service'], {
        child_id: childProfile.childId,
        moderation_status: 'passed'
      });

      const replyText = data.reply || 'Could not fetch tutor response.';
      const tutorMsg = {
        id: Date.now() + 1,
        text: replyText,
        sender: 'buddy'
      };

      setTutorMessages(prev => [...prev, tutorMsg]);
      setIsTyping(false);

      triggerKafkaEvent('tutor.response.emitted', 'NLP Tutor Service', ['Analytics Service'], {
        child_id: childProfile.childId,
        response_text: replyText,
        age_group: childProfile.ageGroup
      });
    } catch (err) {
      console.error("Failed to connect to NLP tutor service, falling back to mock:", err);
      setTimeout(() => {
        // Safety filter mock
        triggerKafkaEvent('tutor.query.moderated', 'Content Safety Service', ['NLP Tutor Service'], {
          child_id: childProfile.childId,
          moderation_status: 'passed'
        });

        // Find appropriate reply based on matching keywords
        const lowercase = query.toLowerCase();
        let matchedResponse = null;

        for (const item of NLP_RESPONSES) {
          if (item.keywords.some(kw => lowercase.includes(kw))) {
            matchedResponse = item[childProfile.ageGroup] || item['5-7'];
            break;
          }
        }

        const replyText = matchedResponse || (NLP_FALLBACK[childProfile.ageGroup] || NLP_FALLBACK['5-7']);
        
        const tutorMsg = {
          id: Date.now() + 1,
          text: replyText,
          sender: 'buddy'
        };

        setTutorMessages(prev => [...prev, tutorMsg]);
        setIsTyping(false);

        triggerKafkaEvent('tutor.response.emitted', 'NLP Tutor Service', ['Analytics Service'], {
          child_id: childProfile.childId,
          response_text: replyText,
          age_group: childProfile.ageGroup
        });
      }, 1800);
    }
  };

  // Onboarding Avatar creation initiator
  const startFaceScan = (photo) => {
    setIsCustomAvatar(false);
    setAvatarColors({ skin: '#FCD34D', hair: '#3E2723', clothing: '#FF6B6B' });
    setSelectedPhoto(photo);
    setChildProfile(prev => ({
      ...prev,
      name: photo.gender === 'boy' ? 'Aarav' : 'Shubhra',
      ageGroup: photo.gender === 'boy' ? '8-11' : '5-7'
    }));
    setScreen('sam2_scan');
  };

  // Trigger confetti burst on reward screen
  useEffect(() => {
    if (screen === 'reward') {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.8 }
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [screen]);

  return (
    <div className="flex flex-col items-center select-none">
      
      {/* Dynamic iPhone 15 Frame container */}
      <div className="phone-bezel w-[345px] h-[700px] rounded-[52px] relative overflow-hidden flex flex-col">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-[100] flex items-center justify-between px-3 border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
          <div className="w-2.5 h-1.5 rounded-full bg-neutral-900 border border-white/10"></div>
        </div>

        {/* Screen Wrapper */}
        <div className="phone-screen w-full h-full flex flex-col p-4 pt-10 pb-6 relative justify-between">
          
          {/* Language Selector Float Toggle */}
          <div className="absolute top-11 right-4 z-[95] flex gap-1.5">
            <button
              onClick={() => { playSoundEffect('pop'); setLang('en'); }}
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shadow-[1px_1px_0_0_#3E2723] transition-all hover:scale-110 active:scale-95 ${
                lang === 'en' ? 'bg-[#FFD700] border-[#3E2723] scale-105 font-black' : 'bg-white border-[#3E2723]/30 opacity-70'
              }`}
              title="English"
            >
              GB
            </button>
            <button
              onClick={() => { playSoundEffect('pop'); setLang('hi'); }}
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shadow-[1px_1px_0_0_#3E2723] transition-all hover:scale-110 active:scale-95 ${
                lang === 'hi' ? 'bg-[#FFD700] border-[#3E2723] scale-105 font-black' : 'bg-white border-[#3E2723]/30 opacity-70'
              }`}
              title="हिंदी (Hindi)"
            >
              IN
            </button>
            <button
              onClick={() => { playSoundEffect('pop'); setLang('es'); }}
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shadow-[1px_1px_0_0_#3E2723] transition-all hover:scale-110 active:scale-95 ${
                lang === 'es' ? 'bg-[#FFD700] border-[#3E2723] scale-105 font-black' : 'bg-white border-[#3E2723]/30 opacity-70'
              }`}
              title="Español (Spanish)"
            >
              ES
            </button>
          </div>

          {/* Bedtime Lock screen overlay */}
          {isBedtimeLocked && (
            <div className="absolute inset-0 bg-[#FFF8EC]/98 z-[90] flex flex-col items-center justify-center p-6 text-center text-[#3E2723]">
              <Lock className="w-16 h-16 text-[#FF6B6B] mb-6 animate-pulse" />
              <h3 className="text-xl font-extrabold tracking-tight mb-2 font-child">Resting Time! 🌙</h3>
              <p className="text-sm text-[#3E2723]/80 mb-6 leading-relaxed font-child">
                Shubh-Buddy says: Your super-brain grows strongest when you sleep. Let's take a break and play more tomorrow!
              </p>
              <div className="w-full h-3 bg-[#3E2723]/10 border-2 border-[#3E2723] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] w-1/3 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* SCREEN: Welcome Onboarding */}
          {screen === 'welcome' && (
            <div className="flex-1 flex flex-col justify-between items-center text-center p-4">
              <div className="mt-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#FFD700] flex items-center justify-center mx-auto mb-4 border-[3px] border-[#3E2723] shadow-[4px_4px_0_0_#3E2723] animate-streak-fire">
                  <Sparkles className="w-12 h-12 text-[#3E2723]" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-[#3E2723] font-child">शुभानु</h1>
                <p className="text-xs text-[#FF6B6B] tracking-wider uppercase font-extrabold font-child">SHUBHANU APP</p>
              </div>

              <div className="bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-[24px] p-4 shadow-[4px_4px_0_0_#3E2723] mb-2">
                <h2 className="text-sm font-black text-[#3E2723] mb-1.5 font-child">
                  {lang === 'hi' ? 'क्या आप तैयार हैं?' : lang === 'es' ? '¿Estás listo?' : 'Are You Ready?'}
                </h2>
                <p className="text-[11px] text-[#3E2723]/80 leading-relaxed font-child font-bold">
                  {UI_TEXT.welcomeSub[lang]}
                </p>
              </div>

              <button
                onClick={() => {
                  playSoundEffect('pop');
                  setScreen('photo_select');
                }}
                className="child-btn w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF6B6B] border-[3px] border-[#3E2723] rounded-[24px] text-[#3E2723] font-black shadow-[4px_4px_0_0_#3E2723] text-sm flex items-center justify-center gap-2 wobble-hover"
              >
                <Camera className="w-4 h-4" />
                {UI_TEXT.startButton[lang]}
              </button>
            </div>
          )}

          {/* SCREEN: Photo Selection */}
          {screen === 'photo_select' && (
            <div className="flex-1 flex flex-col justify-between p-2">
              <div>
                <h2 className="text-xl font-black text-center text-[#3E2723] mb-1 font-child">
                  {UI_TEXT.uploadTitle[lang]}
                </h2>
                <p className="text-[10px] text-[#3E2723]/70 text-center mb-5 font-child font-bold">
                  {UI_TEXT.uploadSub[lang]}
                </p>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {ONBOARDING_PHOTOS.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        playSoundEffect('pop');
                        startFaceScan(photo);
                      }}
                      className="p-2.5 rounded-[20px] bg-[#FFFDF9] border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] hover:bg-[#FFF8EC] text-center transition-all group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2 relative border border-[#3E2723]/25">
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-xs font-black text-[#3E2723] block font-child">{photo.name}</span>
                    </button>
                  ))}

                  {/* Parent Custom Photo Uploader Card */}
                  <div className="p-2.5 rounded-[20px] bg-[#FFFDF9] border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] text-center transition-all flex flex-col justify-center items-center relative overflow-hidden group min-h-[140px] hover:bg-[#FFF8EC]">
                    <div className="w-11 h-11 rounded-full bg-[#E8F4FD] border-2 border-[#3E2723] flex items-center justify-center mb-1 shadow-[1.5px_1.5px_0_0_#3E2723] text-[#3E2723] group-hover:scale-105 transition-all">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-[#3E2723] block font-child leading-tight">
                      {lang === 'hi' ? 'अपनी फोटो डालें' : lang === 'es' ? 'Cargar Foto' : 'Upload Child'}
                    </span>
                    <span className="text-[8px] font-bold text-[#FF6B6B] block font-child mt-0.5">Custom Cartoonizer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          playSoundEffect('pop');
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            const dataUrl = event.target.result;
                            const customPhotoObj = {
                              id: 'custom_upload',
                              name: file.name.split('.')[0] || 'My Child',
                              url: dataUrl,
                              segmentationPoints: 'M 130 180 C 130 110, 270 110, 270 180 C 270 250, 130 250, 130 180 Z M 100 320 C 130 260, 270 260, 300 320 L 280 400 L 120 400 Z'
                            };
                            setIsCustomAvatar(true);
                            setSelectedPhoto(customPhotoObj);
                            
                            // Sample colors from this photo!
                            const colors = await samplePhotoColors(dataUrl);
                            setAvatarColors(colors);
                            
                            // Set initial child profile details
                            setChildProfile(prev => ({
                              ...prev,
                              name: customPhotoObj.name.substring(0, 10),
                              ageGroup: '5-7' // default to 5-7 early learners to help kids
                            }));
                            setScreen('sam2_scan');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playSoundEffect('pop');
                  setScreen('welcome');
                }}
                className="w-full py-3 border-[3px] border-[#3E2723] bg-[#E8F4FD] rounded-xl text-xs font-black text-[#3E2723] shadow-[2px_2px_0_0_#3E2723] wobble-hover"
              >
                {UI_TEXT.backButton[lang]}
              </button>
            </div>
          )}

          {/* SCREEN: SAM2 Scanning */}
          {screen === 'sam2_scan' && (
            <div className="flex-1 flex flex-col justify-between items-center text-center p-4">
              <div>
                <h2 className="text-lg font-black text-[#3E2723] mb-0.5 font-child">Magic Cartoonizer Scan</h2>
                <p className="text-[9px] text-[#FF6B6B] uppercase tracking-widest font-black font-child">Locating facial skin, hair, and clothing</p>
              </div>

              <div className="w-48 h-48 rounded-[24px] overflow-hidden relative border-[3px] border-[#3E2723] shadow-[4px_4px_0_0_#3E2723] bg-white">
                <img src={selectedPhoto.url} className="w-full h-full object-cover grayscale opacity-55" alt="Scanning" />
                
                {/* Horizontal glowing neon laser scanbar */}
                <div className="laser-green-scan" />

                {/* Simulated Segment mask vector overlay */}
                <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 400 400">
                  <path
                     d={selectedPhoto.segmentationPoints}
                     fill="rgba(34, 197, 94, 0.25)"
                     stroke="#22c55e"
                     strokeWidth="3.5"
                     className="segmented-path"
                  />
                </svg>
              </div>

              <div className="w-full bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl p-2.5 text-[9px] font-mono text-[#3E2723] shadow-[2px_2px_0_0_#3E2723] font-bold text-left leading-relaxed">
                &gt;_ SAM2: analyzing photo matrices...
                <br />
                &gt;_ Extracted: Hair: <span style={{color: avatarColors.hair}}>{avatarColors.hair}</span> | Skin: <span style={{color: avatarColors.skin}}>{avatarColors.skin}</span> | Clothing: <span style={{color: avatarColors.clothing}}>{avatarColors.clothing}</span>
              </div>
            </div>
          )}

          {/* SCREEN: DreamBooth GPU training progress */}
          {screen === 'dreambooth' && (
            <div className="flex-1 flex flex-col justify-between items-center text-center p-4">
              <div>
                <h2 className="text-lg font-black text-[#3E2723] mb-0.5 font-child">Cartoonizer Rendering</h2>
                <p className="text-[9px] text-[#FF6B6B] uppercase tracking-widest font-black font-child">Painting vector characters</p>
              </div>

              <div className="w-full flex flex-col items-center">
                {onboardingProgress < 100 ? (
                  <>
                    {/* Spinning loader with percentage */}
                    <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-[#3E2723]/10 border-t-[#22c55e] animate-spin"></div>
                      <span className="text-xl font-black text-[#3E2723] font-child">{onboardingProgress}%</span>
                    </div>
                  </>
                ) : (
                  <div className="mb-6 flex flex-col items-center animate-bounce">
                    <div className="p-3 bg-white border-[3px] border-[#3E2723] rounded-[32px] shadow-[4px_4px_0_0_#3E2723]">
                      <CartoonAvatarCanvas 
                        skinColor={avatarColors.skin} 
                        hairColor={avatarColors.hair} 
                        clothingColor={avatarColors.clothing} 
                        size={120} 
                        isAnimated={true} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#4CAF7D] mt-2 block font-child bg-[#4CAF7D]/10 px-3 py-1 rounded-full border-2 border-[#4CAF7D]">
                      ✨ Cartoon Resemblance Ready!
                    </span>
                  </div>
                )}
                
                <div className="w-full flex flex-col gap-2 text-left text-[10px] font-mono bg-[#FFFDF9] p-3 border-[3px] border-[#3E2723] rounded-2xl shadow-[3px_3px_0_0_#3E2723] text-[#3E2723]">
                  <div className="flex items-center justify-between font-bold">
                    <span>1. Crop & Segment Face:</span>
                    <span className="text-[#4CAF7D]">✓ Done</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span>2. Extract Colors:</span>
                    <span className="text-[#4CAF7D]">✓ Done</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span>3. Toon Vector Shader:</span>
                    {onboardingProgress < 100 ? (
                      <span className="text-[#FF6B6B] animate-pulse">Processing</span>
                    ) : (
                      <span className="text-[#4CAF7D]">✓ Complete</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                disabled={onboardingProgress < 100}
                onClick={() => {
                  playSoundEffect('pop');
                  setScreen('story_map');
                }}
                className={`child-btn w-full py-4 border-[3px] rounded-2xl text-[#3E2723] font-black text-sm flex items-center justify-center gap-2 ${
                  onboardingProgress < 100
                    ? 'bg-neutral-200 border-[#3E2723]/20 text-[#3E2723]/30 shadow-none cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] wobble-hover'
                }`}
              >
                {lang === 'hi' ? 'कहानी शुरू करें →' : lang === 'es' ? 'Iniciar historia →' : 'Enter Story World →'}
              </button>
            </div>
          )}

          {/* SCREEN: Story World Map Selection */}
          {screen === 'story_map' && (
            <div className="flex-1 flex flex-col justify-between p-2">
              <div>
                {/* Onboarding Complete Header banner */}
                <div className="flex items-center justify-between bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-[24px] p-3 shadow-[3px_3px_0_0_#3E2723] mb-4">
                  <div className="flex items-center gap-2">
                    {/* Dynamic avatar thumbnail */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3E2723] flex items-center justify-center bg-white">
                      {isCustomAvatar ? (
                        <CartoonAvatarCanvas 
                          skinColor={avatarColors.skin} 
                          hairColor={avatarColors.hair} 
                          clothingColor={avatarColors.clothing} 
                          size={36} 
                          isAnimated={false} 
                        />
                      ) : (
                        <span className="text-lg">{AVATAR_STYLES.find(s => s.id === activeAvatarStyle)?.emoji}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#3E2723] font-child">Hero: {childProfile.name}</h3>
                      <p className="text-[9px] text-[#3E2723]/70 font-child font-bold">Level 1 Math Cadet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FFD700]/20 px-2.5 py-1 rounded-full border-2 border-[#3E2723] text-[10px] text-orange-700 font-extrabold font-child">
                    <Trophy className="w-3.5 h-3.5 text-orange-600" />
                    <span>0 ⭐</span>
                  </div>
                </div>

                <h2 className="text-lg font-black text-[#3E2723] mb-0.5 font-child">
                  {UI_TEXT.worldMapTitle[lang]}
                </h2>
                <p className="text-[10px] text-[#3E2723]/70 mb-4 font-child font-bold">
                  {UI_TEXT.worldMapSub[lang]}
                </p>
                
                {/* Worlds list */}
                <div className="flex flex-col gap-3">
                  {AVATAR_STYLES.map((style) => {
                    const isMath = style.id === 'fantasy';
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          if (isMath) {
                            playSoundEffect('pop');
                            setActiveAvatarStyle(style.id);
                            setScreen('story_game');
                            setCurrentStepIndex(0);
                            triggerKafkaEvent('story.chapter.started', 'Story Engine', ['Analytics Service', 'User Service'], {
                              child_id: childProfile.childId,
                              chapter_id: 1,
                              world_id: 1,
                              age_group: childProfile.ageGroup
                            });
                          }
                        }}
                        className={`p-3 rounded-[20px] text-left border flex items-center justify-between transition-all ${
                          isMath
                            ? 'bg-[#FFFDF9] border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] hover:bg-[#FFF8EC]'
                            : 'bg-[#3E2723]/5 border-[3px] border-[#3E2723]/20 shadow-none opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{style.emoji}</span>
                          <div>
                            <h4 className="text-xs font-black text-[#3E2723] font-child">{style.world}</h4>
                            <p className="text-[9px] text-[#3E2723]/70 font-child font-bold">{style.name} Art Style</p>
                          </div>
                        </div>
                        {isMath ? (
                          <ChevronRight className="w-4 h-4 text-purple-600 stroke-[3px]" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#3E2723]/40" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-[10px] text-[#3E2723]/60 font-child font-bold italic mt-2">
                *World 1 is active for the PCCOE B.Tech Demo.
              </div>
            </div>
          )}

          {/* SCREEN: Active Story Quests Gameplay */}
          {screen === 'story_game' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
              
              {/* Playful Kids HUD Header */}
              <div className="flex items-center justify-between bg-[#FFFDF9] border-[3px] border-[#3E2723] px-3.5 py-2.5 rounded-[22px] shadow-[4px_4px_0_0_#3E2723] mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-base bg-[#FFD700] w-7 h-7 rounded-full border-2 border-[#3E2723] flex items-center justify-center font-bold overflow-hidden">
                    {isCustomAvatar ? (
                      <CartoonAvatarCanvas 
                        skinColor={avatarColors.skin} 
                        hairColor={avatarColors.hair} 
                        clothingColor={avatarColors.clothing} 
                        size={28} 
                        isAnimated={false} 
                      />
                    ) : (
                      AVATAR_STYLES.find(s => s.id === activeAvatarStyle)?.emoji
                    )}
                  </div>
                  <span className="text-xs font-black text-[#3E2723] tracking-wide font-child">{childProfile.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5 text-xs text-orange-600 font-extrabold font-child">
                    🔥 {childProfile.streakDays} Days
                  </span>
                  <span className="text-[11px] bg-[#FFD700]/20 px-2.5 py-1 rounded-full border-2 border-[#3E2723] text-orange-700 font-extrabold">
                    {childProfile.totalXp} ⭐
                  </span>
                </div>
              </div>

              {/* Core Story Node Viewport */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto mb-3 pr-1">
                
                {/* Visual Mascot Shubh-Buddy with Speech Bubbles */}
                <ShubhBuddy state={mascotState} bubbleText={mascotBubble} />

                {/* Animated Sidekick Row */}
                <div className="flex gap-2 mb-3 px-1 shrink-0 justify-center">
                  <button 
                    onClick={() => {
                      playSoundEffect('pop');
                      setMascotState('thinking');
                      const pipTips = {
                        en: "Pip says: Try counting the gold keys first, then add the silver ones!",
                        hi: "पिप कहता है: पहले सोने की चाबियां गिनें, फिर चांदी की जोड़ें!",
                        es: "Pip dice: ¡Intenta contar las llaves de oro primero, luego las de plata!"
                      };
                      setMascotBubble(pipTips[lang] || pipTips.en);
                      speakText(pipTips[lang] || pipTips.en);
                    }}
                    className="w-10 h-10 rounded-full bg-[#E8F4FD] border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all pip-character"
                    title="Pip the Bluebird"
                  >
                    🐦
                  </button>
                  <button 
                    onClick={() => {
                      playSoundEffect('pop');
                      setMascotState('happy');
                      const hopTips = {
                        en: "Hop says: You are doing great! Tap the keys on the screen to hear them count out loud!",
                        hi: "हॉप कहता है: बहुत बढ़िया! गिनने के लिए स्क्रीन पर दी गई चाबियों को छुएं!",
                        es: "Hop dice: ¡Lo estás haciendo genial! ¡Toca las llaves en la pantalla para contarlas!"
                      };
                      setMascotBubble(hopTips[lang] || hopTips.en);
                      speakText(hopTips[lang] || hopTips.en);
                    }}
                    className="w-10 h-10 rounded-full bg-[#E8F4FD] border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all hop-character"
                    title="Hop the Frog"
                  >
                    🐸
                  </button>
                </div>

                {/* SVG/Illustration Canvas mock */}
                <div className="w-full h-36 rounded-[24px] bg-[#E8F4FD] border-[3px] border-[#3E2723] relative overflow-hidden mb-3.5 shrink-0 flex items-center justify-center shadow-[4px_4px_0_0_#3E2723]">
                  
                  {/* Backdrop backgrounds based on current story step */}
                  {activeChapterStep.illustration === 'castle-gate' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FD] to-[#FFF8EC] flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-14 h-14 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl flex items-center justify-center relative mb-1.5 shadow-[2px_2px_0_0_#3E2723] animate-bounce">
                        <Lock className="w-6 h-6 text-amber-600" />
                        {/* 3 locks slots */}
                        <div className="absolute -bottom-1 flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-[#3E2723]"></span>
                          <span className="w-3 h-3 rounded-full bg-neutral-400 border border-[#3E2723]"></span>
                          <span className="w-3 h-3 rounded-full bg-neutral-400 border border-[#3E2723]"></span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#3E2723] font-extrabold uppercase tracking-wider font-child">
                        {UI_TEXT.gateCastle[lang]}
                      </p>
                    </div>
                  )}

                  {activeChapterStep.illustration === 'mud-monster' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FD] to-[#FFF8EC] flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-12 bg-emerald-600 rounded-full flex flex-col items-center justify-center relative mb-1 border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] animate-bounce">
                        {/* Eyes */}
                        <div className="flex gap-2">
                          <span className="w-3 h-3 rounded-full bg-yellow-300 border border-[#3E2723] flex items-center justify-center text-[6px]">👀</span>
                          <span className="w-3 h-3 rounded-full bg-yellow-300 border border-[#3E2723] flex items-center justify-center text-[6px]">👀</span>
                        </div>
                        {/* Slimy spikes */}
                        <span className="absolute -top-1 w-3 h-2 bg-[#3E2723] rounded-full"></span>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-black uppercase tracking-wide font-child">
                        {UI_TEXT.mudMonster[lang]}
                      </p>
                    </div>
                  )}

                  {activeChapterStep.id === 'challenge_2_easy' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FD] to-[#FFF8EC] flex flex-col items-center justify-center text-center">
                      <div className="flex gap-4 mb-1">
                        <div className="w-10 h-10 bg-green-400 rounded-full border-[3px] border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] animate-bounce flex items-center justify-center text-lg">🟢</div>
                        <div className="w-10 h-10 bg-green-400 rounded-full border-[3px] border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] animate-bounce flex items-center justify-center text-lg" style={{animationDelay: '0.2s'}}>🟢</div>
                      </div>
                      <p className="text-[10px] text-green-700 font-extrabold uppercase tracking-wide font-child">
                        {UI_TEXT.easyBlob[lang]}
                      </p>
                    </div>
                  )}

                  {activeChapterStep.id === 'challenge_2_hard' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FD] to-[#FFF8EC] flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-14 bg-red-400 rounded-full flex flex-col items-center justify-center relative mb-1 border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] animate-pulse">
                        <div className="flex gap-2">
                          <span className="text-xs">👁️</span>
                          <span className="text-xs">👁️</span>
                          <span className="text-xs">👁️</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-red-700 font-extrabold uppercase tracking-wide font-child">
                        {UI_TEXT.trickyMonster[lang]}
                      </p>
                    </div>
                  )}

                  {activeChapterStep.illustration === 'boss-chest' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FD] to-[#FFF8EC] flex flex-col items-center justify-center text-center p-2">
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-[#FFD700] animate-spin flex items-center justify-center bg-white/40 mb-1">
                        <span className="text-2xl">🍕</span>
                      </div>
                      <p className="text-[10px] text-purple-800 font-black uppercase tracking-wider font-child">
                        {UI_TEXT.fractionLock[lang]}
                      </p>
                    </div>
                  )}

                  {activeChapterStep.illustration === 'celebrate-star' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EC] to-[#E8F4FD] flex flex-col items-center justify-center text-center p-2 celebrate-screen">
                      <div className="w-16 h-16 bg-[#FFD700] border-[3px] border-[#3E2723] rounded-2xl flex items-center justify-center shadow-[4px_4px_0_0_#3E2723] animate-bounce mb-1">
                        <Award className="w-10 h-10 text-[#3E2723]" />
                      </div>
                      <p className="text-xs text-orange-600 font-black uppercase tracking-widest font-child">
                        {UI_TEXT.questConquered[lang]}
                      </p>
                    </div>
                  )}

                  {/* Character Avatar floating in bottom corner */}
                  {activeChapterStep.type !== 'reward' && (
                    <div className="absolute bottom-2 left-2 z-30 avatar-floating flex items-center gap-1.5 bg-[#FFFDF9] px-2 py-1 rounded-xl border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723]">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-[#3E2723] flex items-center justify-center bg-white">
                        {isCustomAvatar ? (
                          <CartoonAvatarCanvas 
                            skinColor={avatarColors.skin} 
                            hairColor={avatarColors.hair} 
                            clothingColor={avatarColors.clothing} 
                            size={24} 
                            isAnimated={true} 
                          />
                        ) : (
                          <span className="text-sm">{AVATAR_STYLES.find(s => s.id === activeAvatarStyle)?.emoji}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-[#3E2723] font-child uppercase">Hero</span>
                    </div>
                  )}
                </div>

                {/* Dialogue card with speaker info */}
                <div className="bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-[24px] p-4 shadow-[4px_4px_0_0_#3E2723] mb-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-purple-600 tracking-wider font-extrabold uppercase flex items-center gap-1 font-child">
                      🗣 {activeChapterStep.speaker}
                    </span>
                    <button
                      onClick={() => speakText(activeChapterStep.type === 'quiz' ? (activeChapterStep[`question_${lang}`] || activeChapterStep.question) : (activeChapterStep[`text_${lang}`] || activeChapterStep.text))}
                      className={`p-1.5 rounded-xl border-2 border-[#3E2723] shadow-[1.5px_1.5px_0_0_#3E2723] ${isSpeaking ? 'bg-[#FFD700] text-[#3E2723]' : 'bg-white/10 text-purple-600'} transition-all`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-[#3E2723] leading-relaxed font-child">
                    {activeChapterStep[`text_${lang}`] || activeChapterStep.text}
                  </p>
                </div>

                {/* TACTILE COUNTING SANDBOX FOR EARLY LEARNERS */}
                {activeChapterStep.type === 'quiz' && renderCountingSandbox()}

                {/* Challenge Block (If Quiz Node) */}
                {activeChapterStep.type === 'quiz' && (
                  <div className="mt-2 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-[24px] p-4 shadow-[4px_4px_0_0_#3E2723] flex flex-col gap-3">
                    <h3 className="text-xs font-black text-slate-800 font-child">
                      Riddle: {activeChapterStep[`question_${lang}`] || activeChapterStep.question}
                    </h3>
                    
                    {/* Age Bracket specific options rendering */}
                    <div className="flex flex-col gap-2">
                      {(activeChapterStep[`options_${lang}`] || activeChapterStep.options).map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        let cardStyle = 'border-[#3E2723]/30 bg-[#FFFDF9] text-[#3E2723]';
                        
                        if (isSelected) {
                          if (quizFeedback === 'correct') {
                            cardStyle = 'border-emerald-600 bg-emerald-100 text-emerald-800 font-black shadow-[2px_2px_0_0_#047857]';
                          } else if (quizFeedback === 'incorrect') {
                            cardStyle = 'border-red-600 bg-red-100 text-red-800 font-black shadow-[2px_2px_0_0_#b91c1c]';
                          } else {
                            cardStyle = 'border-purple-600 bg-purple-100 text-purple-800 font-black shadow-[2px_2px_0_0_#6b21a8]';
                          }
                        }

                        // Early learners (5-7) visual graphics option representation
                        const isEarly = childProfile.ageGroup === '5-7';
                        const emojiVisualMapping = {
                          '5 keys': '🔑🔑🔑🔑🔑 (5)',
                          '6 keys': '🔑🔑🔑🔑🔑🔑 (6)',
                          '7 keys': '🔑🔑🔑🔑🔑🔑🔑 (7)',
                          '8 keys': '🔑🔑🔑🔑🔑🔑🔑🔑 (8)',
                          '5 चाबियां': '🔑🔑🔑🔑🔑 (5)',
                          '6 चाबियां': '🔑🔑🔑🔑🔑🔑 (6)',
                          '7 चाबियां': '🔑🔑🔑🔑🔑🔑🔑 (7)',
                          '8 चाबियां': '🔑🔑🔑🔑🔑🔑🔑🔑 (8)',
                          '5 llaves': '🔑🔑🔑🔑🔑 (5)',
                          '6 llaves': '🔑🔑🔑🔑🔑🔑 (6)',
                          '7 llaves': '🔑🔑🔑🔑🔑🔑🔑 (7)',
                          '8 llaves': '🔑🔑🔑🔑🔑🔑🔑🔑 (8)',
                          'Option A': '🍕 (Half)',
                          'Option B': '🍕🍕 (Whole)',
                          'Option C': '🍕 (Half Slice)',
                          'Yes': '🟢 YES!',
                          'No': '🔴 NO!'
                        };

                        const labelText = isEarly ? (emojiVisualMapping[opt] || opt) : opt;

                        return (
                          <button
                            key={idx}
                            disabled={quizFeedback === 'correct'}
                            onClick={() => {
                              playSoundEffect('pop');
                              handleAnswerSubmit(idx);
                            }}
                            className={`child-btn py-3 px-4 rounded-xl border-2 text-xs font-bold text-left flex items-center justify-between transition-all wobble-hover shadow-[2px_2px_0_0_#3E2723] ${cardStyle}`}
                          >
                            <span className="font-child">{labelText}</span>
                            {isSelected && quizFeedback === 'correct' && <span className="text-emerald-600 text-sm">✓</span>}
                            {isSelected && quizFeedback === 'incorrect' && <span className="text-red-600 text-sm">✗</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint Drawer Toggle */}
                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() => {
                          playSoundEffect('pop');
                          setHintShown(!hintShown);
                          triggerKafkaEvent('hint.requested', 'Story Engine', ['Analytics Service'], {
                            child_id: childProfile.childId,
                            challenge_id: activeChapterStep.id
                          });
                        }}
                        className="text-[10px] text-purple-700 font-extrabold flex items-center gap-1 hover:text-purple-900 font-child"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{UI_TEXT.needHint[lang]}</span>
                      </button>
                      <span className="text-[10px] text-orange-600 font-black uppercase tracking-wider font-child">
                        + {activeChapterStep.xpAward} ⭐
                      </span>
                    </div>

                    {hintShown && (
                      <div className="mt-1.5 p-3 rounded-2xl bg-amber-100 text-[#3E2723] border-2 border-[#3E2723] text-[10px] font-bold leading-relaxed font-child shadow-[2px_2px_0_0_#3E2723]">
                        💡 Shubh-Buddy says: {activeChapterStep[`hint_${lang}`] || activeChapterStep.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Action Footer */}
              <div className="flex items-center gap-2.5 mt-auto pt-3 border-t-2 border-[#3E2723]/10 shrink-0">
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    setTutorOpen(true);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-[#E8F4FD] border-2 border-[#3E2723] text-sky-800 text-xs font-black font-child flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#3E2723] wobble-hover shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  {UI_TEXT.askShubh[lang]}
                </button>

                {activeChapterStep.type !== 'quiz' ? (
                  <button
                    onClick={() => {
                      playSoundEffect('pop');
                      handleNextStep();
                    }}
                    className="flex-1 child-btn py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF6B6B] border-2 border-[#3E2723] rounded-2xl text-[#3E2723] font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#3E2723] wobble-hover"
                  >
                    {UI_TEXT.keepGoing[lang]}
                  </button>
                ) : (
                  <button
                    disabled={quizFeedback !== 'correct'}
                    onClick={() => {
                      playSoundEffect('pop');
                      handleNextStep();
                    }}
                    className={`flex-1 child-btn py-4 border-2 border-[#3E2723] rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#3E2723] ${
                      quizFeedback === 'correct'
                        ? 'bg-[#4CAF7D] text-white wobble-hover'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {UI_TEXT.nextQuest[lang]}
                  </button>
                )}
              </div>

              {/* CHAT DRAWER: NLP Tutor Shubh-Buddy */}
              {tutorOpen && (
                <div className="absolute inset-0 bg-[#3E2723]/60 z-50 flex flex-col justify-end">
                  <div className="bg-[#FFFDF9] border-t-[6px] border-l-[3px] border-r-[3px] border-[#3E2723] rounded-t-[32px] h-[75%] flex flex-col p-4 shadow-[0_-8px_0_0_rgba(0,0,0,0.05)]">
                    
                    {/* Tutor Header */}
                    <div className="flex items-center justify-between border-b-2 border-[#3E2723]/10 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <div>
                          <h4 className="text-xs font-black text-[#3E2723] font-child">
                            {UI_TEXT.tutorTitle[lang]}
                          </h4>
                          <p className="text-[9px] text-[#FF6B6B] font-child font-bold uppercase tracking-wider">AI Learning Companion</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          playSoundEffect('pop');
                          setTutorOpen(false);
                        }}
                        className="p-1.5 rounded-full bg-[#E8F4FD] border-2 border-[#3E2723] text-[#3E2723] hover:bg-[#FFF8EC] shadow-[1.5px_1.5px_0_0_#3E2723]"
                      >
                        <X className="w-4 h-4 stroke-[3px]" />
                      </button>
                    </div>

                    {/* Messages logs */}
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 mb-2 font-child text-[11px]">
                      
                      {/* Initial Greeting */}
                      <div className="bg-[#E8F4FD] p-2.5 rounded-2xl rounded-tl-none max-w-[85%] self-start leading-relaxed text-[#3E2723] border-[2px] border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] font-bold">
                        {UI_TEXT.tutorGreeting[lang]}
                      </div>

                      {tutorMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed border-[2px] border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] font-bold ${
                            msg.sender === 'child'
                              ? 'bg-[#FF6B6B] text-[#3E2723] rounded-tr-none self-end'
                              : 'bg-[#E8F4FD] text-[#3E2723] rounded-tl-none self-start'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="bg-[#E8F4FD] border-[2px] border-[#3E2723] p-3 rounded-2xl rounded-tl-none self-start flex gap-1 items-center shadow-[2px_2px_0_0_#3E2723]">
                          <div className="typing-dot bg-[#3E2723]"></div>
                          <div className="typing-dot bg-[#3E2723]"></div>
                          <div className="typing-dot bg-[#3E2723]"></div>
                        </div>
                      )}
                    </div>

                    {/* Suggested questions shortcuts */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0">
                      <button
                        onClick={() => handleAskTutor(lang === 'hi' ? 'हम गणित का जोड़ क्यों करते हैं?' : 'Why do we do math addition?')}
                        className="text-[9px] font-black bg-[#FFFDF9] hover:bg-[#FFF8EC] border-2 border-[#3E2723] text-[#3E2723] rounded-full px-2.5 py-1 whitespace-nowrap shrink-0 shadow-[1.5px_1.5px_0_0_#3E2723]"
                      >
                        ❓ {lang === 'hi' ? 'जोड़ क्यों करते हैं?' : lang === 'es' ? '¿Por qué sumamos?' : 'Why do addition?'}
                      </button>
                      <button
                        onClick={() => handleAskTutor(lang === 'hi' ? 'आधा पिज़्ज़ा क्या है?' : 'What is a fraction half pizza?')}
                        className="text-[9px] font-black bg-[#FFFDF9] hover:bg-[#FFF8EC] border-2 border-[#3E2723] text-[#3E2723] rounded-full px-2.5 py-1 whitespace-nowrap shrink-0 shadow-[1.5px_1.5px_0_0_#3E2723]"
                      >
                        🍕 {lang === 'hi' ? 'आधा क्या होता है?' : lang === 'es' ? '¿Qué es una mitad?' : 'What is a half?'}
                      </button>
                      <button
                        onClick={() => handleAskTutor('गणित क्या है?')}
                        className="text-[9px] font-black bg-[#FFFDF9] hover:bg-[#FFF8EC] border-2 border-[#3E2723] text-[#3E2723] rounded-full px-2.5 py-1 whitespace-nowrap shrink-0 shadow-[1.5px_1.5px_0_0_#3E2723]"
                      >
                        🇮🇳 गणित क्या है?
                      </button>
                    </div>

                    {/* Chat input box */}
                    <div className="flex gap-1.5 mt-1 border-t-2 border-[#3E2723]/10 pt-2.5">
                      <input
                        type="text"
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskTutor(customQuery)}
                        placeholder={UI_TEXT.tutorInput[lang]}
                        className="flex-1 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-xl px-3 py-2 text-xs text-[#3E2723] font-bold focus:outline-none focus:border-[#FF6B6B] shadow-[2px_2px_0_0_#3E2723] font-child"
                      />
                      <button
                        onClick={() => handleAskTutor(customQuery)}
                        className="p-2.5 bg-[#FFD700] rounded-xl text-[#3E2723] border-[3px] border-[#3E2723] hover:bg-[#FFC400] transition-all shrink-0 shadow-[2px_2px_0_0_#3E2723] flex items-center justify-center"
                      >
                        <Send className="w-4 h-4 stroke-[3px]" />
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* SCREEN: End-Of-Chapter Rewards */}
          {screen === 'reward' && (
            <div className="flex-1 flex flex-col justify-between items-center text-center p-4">
              <div className="mt-6 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center border-[3px] border-[#3E2723] shadow-[4px_4px_0_0_#3E2723] animate-bounce mb-4">
                  <Award className="w-12 h-12 text-[#3E2723]" />
                </div>
                
                <h2 className="text-2xl font-black text-[#3E2723] mb-1.5 font-child">
                  {UI_TEXT.questMastered[lang]}
                </h2>
                <p className="text-xs text-[#FF6B6B] font-black uppercase tracking-widest mb-4 font-child">
                  {UI_TEXT.mathWizard[lang]}
                </p>
                
                {/* Rewards report list */}
                <div className="w-full bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl p-4 shadow-[4px_4px_0_0_#3E2723] flex flex-col gap-3 font-child text-left">
                  <div className="flex items-center justify-between border-b-2 border-[#3E2723]/10 pb-2">
                    <span className="text-[#3E2723]/70 text-xs font-bold">
                      {lang === 'hi' ? 'सुलझाया गया अध्याय:' : lang === 'es' ? 'Capítulo resuelto:' : 'Chapter Solved:'}
                    </span>
                    <span className="text-[#3E2723] text-xs font-black">
                      {lang === 'hi' ? 'काउंट कैसल द्वार' : lang === 'es' ? 'Puerta del castillo' : 'Count Castle Gate'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b-2 border-[#3E2723]/10 pb-2">
                    <span className="text-[#3E2723]/70 text-xs font-bold">Total XP:</span>
                    <span className="text-orange-700 text-xs font-black">+470 ⭐</span>
                  </div>
                  <div className="flex items-center justify-between border-b-2 border-[#3E2723]/10 pb-2">
                    <span className="text-[#3E2723]/70 text-xs font-bold">Story Gems:</span>
                    <span className="text-pink-600 text-xs font-black">+30 Gems 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#3E2723]/70 text-xs font-bold">Path:</span>
                    <span className="text-[#4CAF7D] text-xs font-black uppercase font-mono">
                      {storyBranch.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5 mt-4">
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    setScreen('story_map');
                    setChildProfile(prev => ({
                      ...prev,
                      streakDays: 6,
                      currentWorldId: 1
                    }));
                  }}
                  className="child-btn w-full py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF6B6B] border-[3px] border-[#3E2723] rounded-2xl text-[#3E2723] font-black text-xs shadow-[3px_3px_0_0_#3E2723] wobble-hover"
                >
                  {UI_TEXT.continueBtn[lang]}
                </button>
                
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    setScreen('story_game');
                    setCurrentStepIndex(0);
                    setStoryBranch('standard');
                    setSelectedAnswer(null);
                    setQuizFeedback(null);
                  }}
                  className="w-full py-2.5 border-[3px] border-[#3E2723] bg-[#E8F4FD] rounded-xl text-[10px] font-black text-[#3E2723] shadow-[2px_2px_0_0_#3E2723] wobble-hover flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 stroke-[3px]" />
                  {UI_TEXT.replayBtn[lang]}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Casing Indicators */}
      <div className="text-center mt-3 text-[10px] text-[#3E2723]/70 font-child font-bold italic">
        💡 Pro-Tip: Tap <span className="text-purple-600 font-extrabold">Ask Buddy</span> mid-story to experience conversational tutoring.
      </div>

    </div>
  );
}
