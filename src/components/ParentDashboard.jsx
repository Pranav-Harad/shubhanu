import React, { useState } from 'react';
import { Shield, Clock, TrendingUp, BarChart2, Calendar, FileText, Download, UserCheck, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { PARENT_ANALYTICS, AVATAR_STYLES } from '../constants/mockData';

export default function ParentDashboard({
  childProfile,
  setChildProfile,
  isBedtimeLocked,
  setIsBedtimeLocked,
  triggerKafkaEvent
}) {
  const [screenLimit, setScreenLimit] = useState(30); // minutes
  const [activeTab, setActiveTab] = useState('insights'); // insights -> controls -> avatar -> reports
  const [reportDownloaded, setReportDownloaded] = useState(false);

  // Triggered when parents toggle bedtime locks
  const toggleBedtimeLock = () => {
    const nextState = !isBedtimeLocked;
    setIsBedtimeLocked(nextState);

    triggerKafkaEvent(
      nextState ? 'screentime.lockout.activated' : 'screentime.lockout.deactivated',
      'Notification Service',
      ['Story Engine', 'User Service'],
      {
        child_id: childProfile.childId,
        parent_id: childProfile.parentId,
        lockout_active: nextState,
        source: 'parent_dashboard'
      }
    );
  };

  // Triggered when parents change screen time limit
  const handleLimitChange = (val) => {
    setScreenLimit(val);
    triggerKafkaEvent('screentime.limit.updated', 'User Service', ['Notification Service'], {
      child_id: childProfile.childId,
      new_limit_minutes: val
    });
  };

  const handleDownloadReport = () => {
    setReportDownloaded(true);
    triggerKafkaEvent('report.pdf.downloaded', 'Analytics Service', [], {
      child_id: childProfile.childId,
      report_date: '2026-05-25'
    });
    setTimeout(() => setReportDownloaded(false), 3000);
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col justify-between overflow-hidden border-2 border-[#3E2723]">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b-2 border-[#3E2723]/10 pb-3.5 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#FF6B6B] stroke-[3px]" />
          <h2 className="text-lg font-black tracking-wide text-[#3E2723]">
            Shubhanu Parent Portal
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border-2 border-[#3E2723] px-3 py-1 rounded-full text-xs font-bold text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF7D] inline-block"></span>
            <span>Profile:</span>
            <span className="font-black">{childProfile.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 border-b-2 border-[#3E2723]/10 pb-2.5 mb-4 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-[#FF6B6B] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
              : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
          }`}
        >
          📈 Learning Insights
        </button>
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap ${
            activeTab === 'controls'
              ? 'bg-[#FF6B6B] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
              : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
          }`}
        >
          🛡️ Lock & Safety Controls
        </button>
        <button
          onClick={() => setActiveTab('avatar')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap ${
            activeTab === 'avatar'
              ? 'bg-[#FF6B6B] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
              : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
          }`}
        >
          🎨 Avatar Approver
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-[#FF6B6B] border-[#3E2723] text-[#3E2723] shadow-[2px_2px_0_0_#3E2723]'
              : 'bg-[#FFFDF9] border-[#3E2723]/20 text-[#3E2723]/70 hover:bg-[#FFF8EC]'
          }`}
        >
          📄 AI Weekly Reports
        </button>
      </div>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1">
        
        {/* TAB 1: Insights */}
        {activeTab === 'insights' && (
          <div className="flex flex-col gap-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[3px_3px_0_0_#3E2723] text-center">
                <span className="text-[10px] uppercase font-black text-[#3E2723]/70 block mb-1 font-child">Total Stars</span>
                <span className="text-xl font-black text-orange-600">{childProfile.totalXp} ⭐</span>
              </div>
              <div className="p-3 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[3px_3px_0_0_#3E2723] text-center">
                <span className="text-[10px] uppercase font-black text-[#3E2723]/70 block mb-1 font-child">Active Streak</span>
                <span className="text-xl font-black text-orange-600">🔥 {childProfile.streakDays} Days</span>
              </div>
              <div className="p-3 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[3px_3px_0_0_#3E2723] text-center">
                <span className="text-[10px] uppercase font-black text-[#3E2723]/70 block mb-1 font-child">Cosmetic Gems</span>
                <span className="text-xl font-black text-pink-600">💎 {childProfile.storyGems}</span>
              </div>
            </div>

            {/* Subject progress bar charts */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3E2723] mb-4 flex items-center gap-1.5 font-child">
                <BarChart2 className="w-4 h-4 text-[#FF6B6B]" />
                Subject Learning Progress
              </h3>
              
              <div className="flex flex-col gap-3.5">
                {PARENT_ANALYTICS.subjectMastery.map((sub, idx) => {
                  // Math is World 1, let's sync its progress visually
                  const val = sub.subject.includes('Math') ? 
                    (childProfile.totalXp > 1000 ? 100 : Math.round((childProfile.totalXp / 1420) * 85)) : sub.value;

                  return (
                    <div key={idx} className="flex flex-col gap-1.5 font-child">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-[#3E2723]">{sub.subject}</span>
                        <span style={{ color: sub.color }}>{val}%</span>
                      </div>
                      <div className="w-full h-3.5 bg-[#3E2723]/10 border-2 border-[#3E2723] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${val}%`,
                            backgroundColor: sub.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Activity line graph mock */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3E2723] mb-4 flex items-center gap-1.5 font-child">
                <TrendingUp className="w-4 h-4 text-[#FF6B6B]" />
                Weekly Learning Progress (Stars ⭐ Log)
              </h3>
              
              {/* Custom SVG line chart */}
              <div className="relative h-28 w-full mt-2 font-child">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(62,39,35,0.1)" strokeWidth="0.3" />
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(62,39,35,0.1)" strokeWidth="0.3" />
                  <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(62,39,35,0.1)" strokeWidth="0.3" />
                  
                  {/* Glowing chart path */}
                  <path
                    d="M 5 16 L 20 12 L 35 17 L 50 8 L 65 14 L 80 6 L 95 10"
                    fill="none"
                    stroke="#FF6B6B"
                    strokeWidth="1.2"
                    className="skill-line-active"
                  />
                  
                  {/* Sparkle circles at key points */}
                  <circle cx="5" cy="16" r="1.2" fill="#3E2723" />
                  <circle cx="20" cy="12" r="1.2" fill="#3E2723" />
                  <circle cx="35" cy="17" r="1.2" fill="#3E2723" />
                  <circle cx="50" cy="8" r="1.2" fill="#3E2723" />
                  <circle cx="65" cy="14" r="1.2" fill="#3E2723" />
                  <circle cx="80" cy="6" r="1.2" fill="#3E2723" />
                  <circle cx="95" cy="10" r="1.2" fill="#3E2723" />
                </svg>

                {/* Day Labels */}
                <div className="flex justify-between text-[9px] text-[#3E2723]/70 font-black mt-3">
                  <span>M (120)</span>
                  <span>T (250)</span>
                  <span>W (90)</span>
                  <span>T (320)</span>
                  <span>F (180)</span>
                  <span>S (280)</span>
                  <span>S (180)</span>
                </div>
              </div>
            </div>

            {/* Child Mood Tracker Widget */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3E2723] mb-4 flex items-center gap-1.5 font-child">
                😊 How is my child feeling? (Weekly Mood)
              </h3>
              <div className="flex justify-between items-center bg-[#E8F4FD] p-3 rounded-xl border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] font-child">
                <div className="text-center flex-1 border-r border-[#3E2723]/10">
                  <span className="text-2xl block mb-1">🤩</span>
                  <span className="text-[10px] font-black text-[#3E2723]">Mon - Excited</span>
                </div>
                <div className="text-center flex-1 border-r border-[#3E2723]/10">
                  <span className="text-2xl block mb-1">😊</span>
                  <span className="text-[10px] font-black text-[#3E2723]">Tue - Happy</span>
                </div>
                <div className="text-center flex-1 border-r border-[#3E2723]/10">
                  <span className="text-2xl block mb-1">🥱</span>
                  <span className="text-[10px] font-black text-[#3E2723]">Wed - Tired</span>
                </div>
                <div className="text-center flex-1 border-r border-[#3E2723]/10">
                  <span className="text-2xl block mb-1">🤩</span>
                  <span className="text-[10px] font-black text-[#3E2723]">Thu - Excited</span>
                </div>
                <div className="text-center flex-1">
                  <span className="text-2xl block mb-1">😊</span>
                  <span className="text-[10px] font-black text-[#3E2723]">Fri - Happy</span>
                </div>
              </div>
              <p className="text-[9px] text-[#3E2723]/60 italic font-black mt-2 text-center font-child">
                *Moods are automatically inferred by Shubh-Buddy during daily dialogues.
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: Screen time and Safety Locks */}
        {activeTab === 'controls' && (
          <div className="flex flex-col gap-5">
            {/* Active Bedtime locker slider */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black mb-0.5 font-child">Bedtime Sleep Mode 🌙</h3>
                <p className="text-[11px] text-[#3E2723]/80 leading-relaxed pr-4 font-child font-bold">
                  Locks all story quests and tutor chats to keep sleep patterns healthy.
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={toggleBedtimeLock}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shrink-0 border-[3px] border-[#3E2723] shadow-[1.5px_1.5px_0_0_#3E2723] ${
                  isBedtimeLocked ? 'bg-[#FF6B6B]' : 'bg-neutral-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#FFFDF9] border-2 border-[#3E2723] shadow-sm transform transition-transform duration-300 ${
                    isBedtimeLocked ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily Lock timer */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723]">
              <div className="flex items-center gap-2 mb-3.5">
                <Clock className="w-4 h-4 text-[#FF6B6B] stroke-[3px]" />
                <h3 className="text-xs font-black uppercase tracking-wider font-child">Daily Learning Limit</h3>
              </div>
              
              <div className="flex flex-col gap-3 font-child">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Daily screen limit:</span>
                  <span className="font-black text-[#FF6B6B]">{screenLimit} Minutes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={screenLimit}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 border-2 border-[#3E2723] rounded-lg appearance-none cursor-pointer accent-[#FF6B6B]"
                />
                <div className="flex justify-between text-[9px] text-[#3E2723]/60 font-black">
                  <span>10 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>

            {/* Safety checklist */}
            <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] text-[#3E2723]">
              <h3 className="text-xs font-black uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-child">
                <Shield className="w-4 h-4 text-[#4CAF7D] stroke-[3px]" />
                Content Safety & Compliance
              </h3>
              
              <div className="flex flex-col gap-2.5 text-xs font-black font-child">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] stroke-[3px] shrink-0" />
                  <span className="text-[#3E2723]">Child biometrics are kept safe and compliant.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] stroke-[3px] shrink-0" />
                  <span className="text-[#3E2723]">All messages are securely screened for safety.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] stroke-[3px] shrink-0" />
                  <span className="text-[#3E2723]">Profile pictures are securely verified.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] stroke-[3px] shrink-0" />
                  <span className="text-[#3E2723]">Safe space with zero external ads or links.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Avatar Approval */}
        {activeTab === 'avatar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] p-4 text-[#3E2723]">
              <h3 className="text-xs font-black text-[#3E2723] mb-1 flex items-center gap-1.5 font-child">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" />
                Generated Avatar Showcase
              </h3>
              <p className="text-[11px] text-[#3E2723]/80 leading-normal font-child font-bold">
                These are the fine-tuned cartoon variants created from your child's photo during the DreamBooth training pipeline.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {AVATAR_STYLES.map((style) => (
                <div
                  key={style.id}
                  className="p-3 bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[3px_3px_0_0_#3E2723] hover:bg-[#FFF8EC] text-[#3E2723] transition-all relative overflow-hidden group hover:border-[#FF6B6B]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{style.emoji}</span>
                    <span className="text-[8px] bg-[#FFD700]/20 text-orange-700 font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-[#3E2723]/35 font-mono">
                      Art Model
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#3E2723] mb-0.5 font-child">{style.name}</h4>
                  <p className="text-[9px] text-[#3E2723]/70 font-child font-bold leading-normal truncate">{style.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center text-[10px] text-[#3E2723]/60 italic font-child font-bold mt-1">
              *Avatar models learn child biometric segments with pixel-level mask precision.
            </div>
          </div>
        )}

        {/* TAB 4: PDF Reports */}
        {activeTab === 'reports' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#FFFDF9] border-[3px] border-[#3E2723] rounded-2xl shadow-[4px_4px_0_0_#3E2723] p-4 text-[#3E2723] font-child font-bold text-[11px] leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap scrollbar-thin">
              {PARENT_ANALYTICS.weeklyReport}
            </div>

            <button
              onClick={handleDownloadReport}
              className={`w-full py-3.5 rounded-2xl border-[3px] border-[#3E2723] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0_0_#3E2723] wobble-hover ${
                reportDownloaded
                  ? 'bg-[#4CAF7D] text-white shadow-none'
                  : 'bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF6B6B] text-[#3E2723]'
              }`}
            >
              {reportDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3px]" />
                  Weekly Progress Report Downloaded! 🌟
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[3px]" />
                  Download Weekly PDF Report 📄
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Parental Footer Advice */}
      <div className="mt-auto pt-3 border-t-2 border-[#3E2723]/10 text-[11px] text-[#3E2723]/70 flex items-center justify-between shrink-0 font-child font-bold">
        <p>
          💡 <span className="font-black text-[#3E2723]">AI Weekly Reports:</span> Auto-compiled by Shubh-Buddy based on completed story exercises under your supervision.
        </p>
      </div>

    </div>
  );
}
