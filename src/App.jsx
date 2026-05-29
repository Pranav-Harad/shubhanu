import React, { useState } from 'react';
import PhoneSimulator from './components/PhoneSimulator';
import ParentDashboard from './components/ParentDashboard';
import DevConsole from './components/DevConsole';
import { MICROSERVICES, DB_METRICS } from './constants/mockData';
import { Sparkles, Terminal, ShieldAlert, Award, Star } from 'lucide-react';

export default function App() {
  // Global Profile State for the Child
  const [childProfile, setChildProfile] = useState({
    childId: 'c_shubhra_984',
    parentId: 'p_pranav_028',
    name: 'Shubhra',
    ageGroup: '5-7',
    streakDays: 5,
    totalXp: 950,
    storyGems: 150,
    currentWorldId: 1
  });

  const [isBedtimeLocked, setIsBedtimeLocked] = useState(false);
  
  // Dev Console states
  const [services, setServices] = useState(MICROSERVICES);
  const [kafkaLogs, setKafkaLogs] = useState([]);
  const [dbState, setDbState] = useState(DB_METRICS);
  const [activeService, setActiveService] = useState(null);
  
  // Right Column View mode
  const [rightPanelTab, setRightPanelTab] = useState('parent'); // 'parent' | 'dev'

  // Global event tracker simulating Apache Kafka broker
  const triggerKafkaEvent = (eventName, source, targets, payload) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // 1. Log to Kafka Broker
    const newLog = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp,
      event: eventName,
      source,
      targets,
      payload
    };
    setKafkaLogs((prev) => [...prev, newLog]);

    // 2. Trigger glowing flash animation on service nodes
    // Map service naming key to service item
    const serviceMap = {
      'Auth Service': 'auth',
      'User Service': 'user',
      'Story Engine': 'story',
      'Gamification Service': 'gamify',
      'Avatar Service': 'avatar',
      'NLP Tutor Service': 'tutor',
      'Notification Service': 'notify',
      'Analytics Service': 'analytics',
      'Content Safety Service': 'safety'
    };

    const serviceKey = serviceMap[source];
    if (serviceKey) {
      setActiveService(serviceKey);
      setTimeout(() => setActiveService(null), 1200);
    }

    // 3. Update simulated DB counters
    setDbState((prev) => {
      const updated = { ...prev };
      
      if (eventName.includes('photo')) {
        updated.redis.records += 1;
        updated.postgres.records += 1;
      }
      if (eventName.includes('avatar')) {
        updated.postgres.records += 1;
      }
      if (eventName.includes('quiz') || eventName.includes('chapter')) {
        updated.postgres.records += 1;
        updated.mongodb.records += 2;
        updated.redis.records += 1;
      }
      if (eventName.includes('tutor')) {
        updated.mongodb.records += 1;
      }
      if (eventName.includes('screentime')) {
        updated.redis.records += 1;
      }
      
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8">
      
      {/* Premium B.Tech Project Header Banner */}
      <header className="glass-panel p-5 mb-6 flex flex-col md:flex-row items-center justify-between border border-[#3E2723]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#FF6B6B]/5 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="flex items-center gap-4 text-center md:text-left mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFD700] flex items-center justify-center border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723]">
            <Sparkles className="w-6 h-6 text-[#3E2723]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#3E2723] flex items-center gap-2">
              SHUBHANU <span className="text-[#FF6B6B] font-mono font-black">(शुभानु)</span>
            </h1>
            <p className="text-xs text-[#3E2723]/80 font-bold mt-0.5">
              AI-Powered Story-Driven & Adaptive Gamified Learning Ecosystem for Kids (Ages 5–14)
            </p>
          </div>
        </div>

        {/* Academic Credentials Section */}
        <div className="text-center md:text-right font-child text-[11px] leading-relaxed text-[#3E2723] bg-[#FFFDF9] border-[3px] border-[#3E2723] shadow-[3px_3px_0_0_#3E2723] p-3 rounded-2xl">
          <p><span className="text-[#FF6B6B] font-black">Final Year B.Tech Project</span> | Information Technology</p>
          <p className="text-[#3E2723] font-bold">PCCOE, Pune | Developer: Pranav Harad (PRN: 123B1F028)</p>
          <p className="mt-0.5 text-[#3E2723]/70 font-bold">Inspired by 5-year-old sister, Shubhra Harad 💖</p>
        </div>
      </header>

      {/* Main Split-Pane Workspace Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (4 cols): Child Shubh-Mobile Device Frame */}
        <section className="lg:col-span-4 flex flex-col justify-center items-center">
          <div className="w-full flex items-center gap-2 mb-2 px-2.5 text-xs text-[#3E2723] font-black tracking-wider uppercase justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border border-[#3E2723] inline-block animate-pulse"></span>
            1. Simulated Mobile Client View
          </div>
          <PhoneSimulator
            childProfile={childProfile}
            setChildProfile={setChildProfile}
            isBedtimeLocked={isBedtimeLocked}
            triggerKafkaEvent={triggerKafkaEvent}
          />
        </section>

        {/* Right Column (8 cols): Parents Hub / Developer Sandbox tabs */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Header tabs toggle */}
          <div className="flex items-center justify-between bg-[#FFFDF9] border-[3px] border-[#3E2723] shadow-[4px_4px_0_0_#3E2723] p-2.5 rounded-2xl shrink-0">
            <span className="text-xs font-black uppercase tracking-wider text-[#3E2723] pl-2 font-child">
              2. Administrative & Sandbox Workspace
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setRightPanelTab('parent')}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                  rightPanelTab === 'parent'
                    ? 'bg-[#FF6B6B] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
                    : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
                }`}
              >
                🏠 Parental Control Dashboard
              </button>
              <button
                onClick={() => setRightPanelTab('dev')}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
                  rightPanelTab === 'dev'
                    ? 'bg-[#FFD700] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
                    : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 stroke-[3px]" />
                DevOps Architecture & Kafka Console
              </button>
            </div>
          </div>

          {/* Switch panels */}
          <div className="flex-1 min-h-[500px]">
            {rightPanelTab === 'parent' ? (
              <ParentDashboard
                childProfile={childProfile}
                setChildProfile={setChildProfile}
                isBedtimeLocked={isBedtimeLocked}
                setIsBedtimeLocked={setIsBedtimeLocked}
                triggerKafkaEvent={triggerKafkaEvent}
              />
            ) : (
              <DevConsole
                services={services}
                kafkaLogs={kafkaLogs}
                dbState={dbState}
                activeService={activeService}
              />
            )}
          </div>

        </section>

      </main>

      {/* Shared Academic Footer */}
      <footer className="mt-8 text-center text-xs text-[hsl(var(--text-muted))] flex flex-col md:flex-row items-center justify-between border-t border-[hsl(var(--border-color))] pt-4">
        <p>© 2026 Shubhanu Project. B.Tech IT Final Year Showcase.</p>
        <div className="flex gap-4 mt-2 md:mt-0 font-mono text-[10px]">
          <span>Fastify / Node.js</span>
          <span>FastAPI / Python</span>
          <span>Meta SAM2 + DreamBooth</span>
          <span>Apache Kafka / Events</span>
          <span>AWS EKS</span>
        </div>
      </footer>

    </div>
  );
}
