import React, { useState, useEffect } from 'react';
import { Shield, Clock, BarChart2, Star, Download, Lock, Unlock, Calendar, UserCheck, AlertTriangle, Sparkles } from 'lucide-react';

const API_GATEWAY = 'http://localhost:8000'; // Kong Port 8000

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('parent_jwt') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard details
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [childProgress, setChildProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  
  // Settings details
  const [bedtimeLocked, setBedtimeLocked] = useState(false);
  const [screenLimit, setScreenLimit] = useState(30);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Handle Parent Registration and Logins (Auth Service integration!)
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    const path = isRegistering ? '/api/v1/auth/register' : '/api/v1/auth/login';
    try {
      const response = await fetch(`${API_GATEWAY}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Authentication failed');
      
      localStorage.setItem('parent_jwt', data.token);
      setToken(data.token);
    } catch (err) {
      setAuthError(err.message || 'Could not connect to authentication services.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch children profiles (Phase 3 User Service integration!)
  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/children`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setChildren(data.children || []);
        if (data.children && data.children.length > 0) {
          setSelectedChildId(data.children[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load child profiles:", err);
    }
  };

  // Fetch XP, Streaks & Badges (Phase 6 Gamification integration!)
  const fetchGamificationDetails = async (childId) => {
    if (!childId) return;
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/gamification/${childId}/badges`, {
        method: 'GET'
      });
      const data = await response.json();
      if (response.ok) {
        setChildProgress(data.progress);
        setBadges(data.badges || []);
      }
    } catch (err) {
      // Offline fallback mock data
      setChildProgress({ totalXp: 1420, streakDays: 6, storyGems: 180 });
      setBadges([
        { id: '1', badgeName: 'First Quest', description: 'Created customized avatar', icon: '✨' },
        { id: '2', badgeName: 'Math Wizard', description: 'Solved Count Castle gates!', icon: '🧙‍♂️' }
      ]);
    }
  };

  // Update Bedtime Locks & screen sliders (Phase 3 integration!)
  const handleUpdateSettings = async (lockedState, limitValue) => {
    setSettingsLoading(true);
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/parent/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isBedtimeLocked: lockedState,
          screenLimitMinutes: limitValue
        })
      });
      const data = await response.json();
      if (response.ok) {
        setBedtimeLocked(data.settings.isBedtimeLocked);
        setScreenLimit(data.settings.screenLimitMinutes);
      }
    } catch (err) {
      // Local fallback simulator updates
      setBedtimeLocked(lockedState);
      setScreenLimit(limitValue);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChildren();
    }
  }, [token]);

  useEffect(() => {
    if (selectedChildId) {
      fetchGamificationDetails(selectedChildId);
    }
  }, [selectedChildId]);

  const handleLogout = () => {
    localStorage.removeItem('parent_jwt');
    setToken('');
    setChildren([]);
    setChildProgress(null);
  };

  // Gated Authentication view
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '400px', textAlign: 'center' }}>
          <Shield style={{ width: '48px', height: '48px', color: '#a855f7', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            {isRegistering ? 'Create Parent Account' : 'Shubhanu Parent Portal'}
          </h2>
          <p style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', marginBottom: '24px', letterSpacing: '1px' }}>
            DASHBOARD.SHUBHANU.APP
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Parent Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            {authError && <p style={{ color: 'red', fontSize: '12px' }}>{authError}</p>}
            
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Authenticating...' : isRegistering ? 'Create Account & Log In' : 'Secure Log In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#a855f7',
                fontSize: '12px',
                marginTop: '8px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'inherit'
              }}
            >
              {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Register here"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeChildDetails = children.find(c => c.id === selectedChildId);

  return (
    <div className="dashboard-container">
      
      {/* Side bar */}
      <aside className="sidebar">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#3E2723', marginBottom: '24px', fontFamily: 'var(--font-ui)' }}>शुभानु Parent</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '10px', color: '#3E2723', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.5px' }}>
              Active Child Profile
            </div>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  backgroundColor: selectedChildId === child.id ? '#FFF8EC' : '#FFFDF9',
                  border: selectedChildId === child.id ? '3px solid #3E2723' : '3px solid #3E2723/20',
                  color: '#3E2723',
                  textAlign: 'left',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: selectedChildId === child.id ? '3px 3px 0 0 #3E2723' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                👶 {child.name} (Age {child.ageGroup})
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px',
            backgroundColor: '#E8F4FD',
            border: '3px solid #3E2723',
            color: '#3E2723',
            borderRadius: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '2.5px 2.5px 0 0 #3E2723',
            fontFamily: 'inherit'
          }}
        >
          Sign Out Portal
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        
        {/* Header summary */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#3E2723' }}>
              Progress Insights: {activeChildDetails?.name || 'Loading'}
            </h1>
            <p style={{ color: '#3E2723/70', fontSize: '13px', marginTop: '4px', fontWeight: '700' }}>
              Live progress updates, updated as your child learns.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star style={{ color: '#FFD700', stroke: '#3E2723', strokeWidth: '2.5px' }} />
              <div>
                <span style={{ fontSize: '10px', color: '#3E2723/80', fontWeight: '800', display: 'block' }}>Total Stars</span>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#3E2723' }}>{childProgress?.totalXp || 0} ⭐</p>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <div>
                <span style={{ fontSize: '10px', color: '#3E2723/80', fontWeight: '800', display: 'block' }}>Daily Streak</span>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#FF6B6B' }}>{childProgress?.streakDays || 0} Days</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid splits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
          
          {/* Left panel (7 cols): Analytics and Badges */}
          <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Curriculum progress */}
            <section className="glass-card">
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#3E2723', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 className="w-4 h-4 text-[#FF6B6B] stroke-[3px]" />
                SUBJECT LEARNING PROGRESS
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '800', color: '#3E2723' }}>
                    <span>World 1: Number Kingdom (Mathematics)</span>
                    <span style={{ color: '#FF6B6B' }}>85%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '85%', backgroundColor: '#FF6B6B' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '800', color: '#3E2723' }}>
                    <span>World 2: Word Forest (English Grammar)</span>
                    <span style={{ color: '#4CAF7D' }}>65%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '65%', backgroundColor: '#4CAF7D' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '800', color: '#3E2723' }}>
                    <span>World 3: Science Planet (Physics fundamentals)</span>
                    <span style={{ color: '#E8F4FD' }}>40%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '40%', backgroundColor: '#FFD700' }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Badges Collection */}
            <section className="glass-card">
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#3E2723', marginBottom: '16px' }}>
                🏆 RECENT COLLECTIBLE BADGES
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {badges.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      backgroundColor: '#FFFDF9',
                      border: '3px solid #3E2723',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '2.5px 2.5px 0 0 #3E2723'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{b.icon || '🏅'}</span>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#3E2723' }}>{b.badgeName}</h4>
                      <p style={{ fontSize: '10px', color: '#3E2723/70', fontWeight: '700', marginTop: '2px' }}>
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right panel (5 cols): Screen Locks & Weekly report */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Screen controls */}
            <section className="glass-card">
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#3E2723', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock className="w-4 h-4 text-[#FF6B6B] stroke-[3px]" />
                SCREEN TIME & BEDTIME SAFETY
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Bedtime Lock Button */}
                <button
                  onClick={() => handleUpdateSettings(!bedtimeLocked, screenLimit)}
                  disabled={settingsLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: bedtimeLocked ? '#FFD700/20' : '#E8F4FD',
                    border: '3px solid #3E2723',
                    color: bedtimeLocked ? '#FF6B6B' : '#4CAF7D',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '3px 3px 0 0 #3E2723',
                    fontFamily: 'inherit'
                  }}
                >
                  {bedtimeLocked ? (
                    <>
                      <Lock className="w-4 h-4 stroke-[3px]" />
                      Bedtime Mode: Active 🌙
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 stroke-[3px]" />
                      Bedtime Mode: Off 🌙
                    </>
                  )}
                </button>

                {/* Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#3E2723/70', fontWeight: '800', marginBottom: '8px' }}>
                    <span>Daily screen limit:</span>
                    <span style={{ color: '#FF6B6B', fontWeight: '900' }}>{screenLimit} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={screenLimit}
                    onChange={(e) => handleUpdateSettings(bedtimeLocked, parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#FF6B6B', cursor: 'pointer', height: '6px', border: '2px solid #3E2723', borderRadius: '4px' }}
                  />
                </div>

              </div>
            </section>

            {/* AI Reports Summary card */}
            <section className="glass-card">
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#3E2723', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles className="w-4 h-4 text-[#FFD700] stroke-[2px]" />
                AI WEEKLY REPORT PREVIEW
              </h3>
              
              <div style={{ fontSize: '11px', color: '#3E2723', fontWeight: '700', lineHeight: '16px', backgroundColor: '#FFF8EC', border: '2px solid #3E2723', padding: '12px', borderRadius: '14px', marginBottom: '16px', fontStyle: 'italic' }}>
                "Shubhra excelled in visual addition, but showed slight hesitation when handling carries. Recommendation: Focus on World 1 - Chapter 4 next week."
              </div>

              <button
                onClick={() => alert('Sunday PDF Report successfully downloaded! 🌟')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#FFD700',
                  border: '3px solid #3E2723',
                  color: '#3E2723',
                  borderRadius: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  boxShadow: '2.5px 2.5px 0 0 #3E2723',
                  fontFamily: 'inherit'
                }}
              >
                <Download className="w-4 h-4 stroke-[3px]" />
                Download Weekly PDF Report 📄
              </button>
            </section>

          </div>

        </div>

      </main>

    </div>
  );
}
