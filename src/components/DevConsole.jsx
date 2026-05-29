import React, { useRef, useEffect } from 'react';
import { Server, Database, Activity, GitFork, Radio, Cpu, HardDrive } from 'lucide-react';

export default function DevConsole({ services, kafkaLogs, dbState, activeService }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [kafkaLogs]);

  return (
    <div className="glass-panel p-6 h-full flex flex-col justify-between overflow-hidden border-2 glow-border-cyan">
      
      {/* Dev Console Title */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border-color))] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[hsl(var(--secondary))]" />
          <h2 className="text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--primary))] uppercase">
            Shubh-Core / Academic DevOps Console
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-[hsl(var(--text-muted))]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--success))] inline-block animate-ping"></span>
            EKS Cluster: Running
          </span>
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
            Kafka: Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto">
        
        {/* Left/Middle Column (7 cols): Microservices Grid & DBs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">Kubernetes Microservices (AWS EKS Pods)</h3>
          </div>
          
          {/* Microservices Grid */}
          <div className="grid grid-cols-3 gap-3">
            {services.map((service) => {
              const isActive = activeService === service.id;
              return (
                <div
                  key={service.id}
                  className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-[hsl(var(--primary))/0.1] border-[hsl(var(--secondary))] glow-border-cyan scale-105'
                      : 'bg-black/30 border-[hsl(var(--border-color))]'
                  }`}
                  style={{
                    boxShadow: isActive ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                      {service.id.toUpperCase()}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[hsl(var(--secondary))] animate-ping' : 'bg-emerald-500'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-[hsl(var(--text-main))] truncate">{service.name}</h4>
                  <p className="text-[10px] text-[hsl(var(--text-muted))] mt-1 leading-tight line-clamp-2">{service.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Database Monitors */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[hsl(var(--primary))]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">Live Database Nodes (Database-Per-Service)</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* PostgreSQL */}
              <div className="p-3 rounded-lg border border-[hsl(var(--border-color))] bg-black/20 flex items-start gap-2.5">
                <HardDrive className="w-5 h-5 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-[hsl(var(--text-main))]">PostgreSQL</h4>
                  <p className="text-[9px] text-[hsl(var(--text-muted))] truncate">{dbState.postgres.tables}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-300 font-mono">
                      Rows: {dbState.postgres.records}
                    </span>
                  </div>
                </div>
              </div>

              {/* MongoDB */}
              <div className="p-3 rounded-lg border border-[hsl(var(--border-color))] bg-black/20 flex items-start gap-2.5">
                <Database className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-[hsl(var(--text-main))]">MongoDB Atlas</h4>
                  <p className="text-[9px] text-[hsl(var(--text-muted))] truncate">{dbState.mongodb.collections}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-300 font-mono">
                      Docs: {dbState.mongodb.records}
                    </span>
                  </div>
                </div>
              </div>

              {/* Redis */}
              <div className="p-3 rounded-lg border border-[hsl(var(--border-color))] bg-black/20 flex items-start gap-2.5">
                <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-[hsl(var(--text-main))]">Redis Cache</h4>
                  <p className="text-[9px] text-[hsl(var(--text-muted))] truncate">{dbState.redis.keys}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                      Keys: {dbState.redis.records}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Kafka Event Stream Broker Log */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[250px]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[hsl(var(--secondary))]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">Apache Kafka Event Broker</h3>
            </div>
            <span className="text-[10px] text-[hsl(var(--text-muted))] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono">
              Broker: 9092
            </span>
          </div>

          <div className="flex-1 bg-black/50 border border-[hsl(var(--border-color))] rounded-lg p-3 font-mono text-xs overflow-y-auto max-h-[300px] flex flex-col gap-2.5">
            {kafkaLogs.length === 0 ? (
              <div className="text-[hsl(var(--text-muted))] text-center py-10 italic">
                Waiting for child actions in phone simulator to stream event packets...
              </div>
            ) : (
              kafkaLogs.map((log) => (
                <div key={log.id} className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[hsl(var(--secondary))] font-bold text-[10px]">
                      [{log.timestamp}]
                    </span>
                    <span className="text-[hsl(var(--accent))] font-bold text-[10px] uppercase bg-pink-500/15 px-1.5 py-0.2 rounded">
                      {log.event}
                    </span>
                  </div>
                  <div className="text-[hsl(var(--text-muted))] text-[11px] leading-normal break-all bg-white/5 p-1.5 rounded">
                    <span className="text-orange-400 font-bold">Source:</span> {log.source} &rarr;{' '}
                    <span className="text-emerald-400 font-bold">Targets:</span> {log.targets.join(', ')}
                    <pre className="text-[10px] mt-1 text-slate-300 leading-tight">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>

      </div>

      {/* DevOps Educational Summary Footer */}
      <div className="mt-4 pt-3 border-t border-[hsl(var(--border-color))] text-[11px] text-[hsl(var(--text-muted))] flex items-center justify-between">
        <p>
          💡 <span className="font-bold text-white">Viva Talking Point:</span> Kafka decouples key transactions. When a chapter is solved, a single event triggers gamification algorithms, analytics logs, and parental summaries simultaneously!
        </p>
        <span className="bg-white/5 px-2 py-0.5 rounded font-mono text-[9px] text-white">Kong API Gateway v2.8</span>
      </div>

    </div>
  );
}
