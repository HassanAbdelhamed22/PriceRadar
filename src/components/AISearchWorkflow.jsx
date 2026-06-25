import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CheckCircle2, Brain, Target, Database, BarChart3, Cpu,
  Activity, TrendingDown, TrendingUp, Minus, Zap, Globe, ShoppingBag,
  ChevronRight
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const STORES = [
  {
    id: 'amazon', name: 'Amazon Egypt', abbr: 'AMZ',
    gradient: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(251,146,60,0.3)',
    delay: 0,
  },
  {
    id: 'noon', name: 'Noon', abbr: 'NON',
    gradient: 'from-yellow-400 to-yellow-600',
    glowColor: 'rgba(234,179,8,0.3)',
    delay: 480,
  },
  {
    id: 'jumia', name: 'Jumia', abbr: 'JUM',
    gradient: 'from-orange-500 to-red-500',
    glowColor: 'rgba(239,68,68,0.25)',
    delay: 980,
  },
  {
    id: 'btech', name: 'B.Tech', abbr: 'BTC',
    gradient: 'from-red-600 to-rose-600',
    glowColor: 'rgba(220,38,38,0.25)',
    delay: 1430,
  },
  {
    id: 'raya', name: 'Raya', abbr: 'RAY',
    gradient: 'from-blue-600 to-indigo-600',
    glowColor: 'rgba(37,99,235,0.25)',
    delay: 1850,
  },
];

const STATUS_CONFIG = {
  idle:       { label: 'Waiting...',        barWidth: '0%',    color: 'text-muted' },
  connecting: { label: 'Connecting...',     barWidth: '22%',   color: 'text-primary' },
  reading:    { label: 'Reading product...', barWidth: '54%',   color: 'text-primary' },
  comparing:  { label: 'Comparing prices...', barWidth: '80%', color: 'text-primary' },
  done:       { label: '✓ Found',           barWidth: '100%',  color: 'text-success' },
};

const ANALYSIS_TASKS = [
  { id: 1, label: 'Finding cheapest store',        Icon: Target },
  { id: 2, label: 'Analyzing historical prices',   Icon: Database },
  { id: 3, label: 'Comparing market trends',       Icon: BarChart3 },
  { id: 4, label: 'Running price prediction',      Icon: Brain },
  { id: 5, label: 'Calculating confidence score',  Icon: Cpu },
];

/* ─────────────────────────────────────────────────────────────
   HELPER: Add ripple to button
───────────────────────────────────────────────────────────── */
function useRealTime() {
  const ts = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };
  return ts;
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT: Store Scraper Card
───────────────────────────────────────────────────────────── */
function StoreCard({ store }) {
  const { status, name, abbr, gradient, price } = store;
  const cfg = STATUS_CONFIG[status];
  const isActive = status !== 'idle';
  const isDone   = status === 'done';

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border p-4 transition-all duration-600
        ${isDone
          ? 'bg-success/5 border-success/25'
          : isActive
            ? 'bg-card/70 glass border-primary/20'
            : 'bg-card/25 border-border/30 opacity-40'
        }
      `}
      style={isDone ? { boxShadow: `0 0 20px -6px ${store.glowColor}` } : {}}
    >
      {/* Scanning line animation while active */}
      {isActive && !isDone && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div
            className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent animate-scan-line"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Left: Logo + name */}
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-xl bg-linear-to-br ${gradient}
            flex items-center justify-center text-white font-black text-xs
            shadow-md shrink-0 transition-all duration-300
            ${isDone ? 'shadow-lg' : ''}
          `}>
            {abbr}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-text-primary leading-tight truncate">{name}</p>
            {isActive && (
              <p className={`text-[11px] font-semibold mt-0.5 transition-all duration-300 ${cfg.color} ${!isDone ? 'animate-pulse' : ''} truncate`}>
                {cfg.label}
              </p>
            )}
          </div>
        </div>

        {/* Right: status indicator */}
        {isDone && price && (
          <div className="flex items-center space-x-2.5">
            <div className="text-right">
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider">EGP</p>
              <p className="font-black text-success text-base leading-tight tabular-nums">
                {price.toLocaleString()}
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-success/15 border border-success/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="w-6 h-6 rounded-full border-2 border-border/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-muted/50" />
          </div>
        )}

        {isActive && !isDone && (
          <div className="flex space-x-1 items-end h-5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1 rounded-full bg-primary"
                style={{
                  height: `${8 + i * 4}px`,
                  animation: `bounce 0.8s ease-in-out ${i * 160}ms infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-surface/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isDone
              ? 'bg-linear-to-r from-success to-emerald-400'
              : 'bg-linear-to-r from-primary to-amber-400'
          }`}
          style={{ width: cfg.barWidth }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT: Terminal Log Panel
───────────────────────────────────────────────────────────── */
function TerminalPanel({ logs, terminalRef }) {
  return (
    <div className="h-full flex flex-col bg-[#09070f] rounded-2xl border border-white/6 overflow-hidden">
      {/* MacOS-style traffic lights */}
      <div className="flex items-center space-x-2 px-4 py-3 border-b border-white/5 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span
          className="text-[11px] font-medium text-white/30 ml-2"
          style={{ fontFamily: 'ui-monospace, monospace' }}
        >
          ai-agent.log
        </span>
        <Activity className="w-3 h-3 text-green-400 animate-pulse ml-auto" />
      </div>

      {/* Log entries */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 space-y-1.5"
        style={{ fontFamily: 'ui-monospace, "Cascadia Code", monospace' }}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex space-x-2.5 text-[11px] leading-relaxed animate-log-enter"
          >
            <span className="text-white/25 shrink-0 tabular-nums select-none">
              {log.time}
            </span>
            <span className={
              log.type === 'success'   ? 'text-emerald-400' :
              log.type === 'highlight' ? 'text-orange-400'  :
              log.type === 'error'     ? 'text-red-400'     :
                                         'text-white/55'
            }>
              {log.message}
            </span>
          </div>
        ))}

        {/* Blinking cursor on last line */}
        {logs.length > 0 && (
          <div className="flex space-x-2.5 text-[11px]">
            <span className="text-white/25 tabular-nums select-none">
              {logs[logs.length - 1]?.time}
            </span>
            <span className="text-white/40 animate-terminal-cursor">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT: Neural Network SVG
───────────────────────────────────────────────────────────── */
function NeuralNetViz() {
  const layers = useMemo(() => [
    [{ x: 12, y: 20 }, { x: 12, y: 40 }, { x: 12, y: 60 }, { x: 12, y: 80 }],
    [{ x: 37, y: 28 }, { x: 37, y: 48 }, { x: 37, y: 68 }],
    [{ x: 62, y: 22 }, { x: 62, y: 42 }, { x: 62, y: 62 }, { x: 62, y: 82 }],
    [{ x: 88, y: 35 }, { x: 88, y: 65 }],
  ], []);

  const edges = useMemo(() => {
    const result = [];
    for (let l = 0; l < layers.length - 1; l++) {
      for (const from of layers[l]) {
        for (const to of layers[l + 1]) {
          result.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
        }
      }
    }
    return result;
  }, [layers]);

  const allNodes = useMemo(() =>
    layers.flat().map((n, i) => ({ ...n, delay: i * 180 })),
  [layers]);

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 160 }}>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="rgba(249,115,22,0.12)"
          strokeWidth="0.4"
        />
      ))}
      {allNodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y} r={3.5}
          fill="rgba(249,115,22,0.85)"
          className="animate-neural-pulse"
          style={{ animationDelay: `${n.delay}ms` }}
        />
      ))}
      {/* Active signal traveling through edges */}
      {edges.slice(0, 3).map((e, i) => (
        <circle key={`signal-${i}`} r={1.5} fill="#f97316">
          <animateMotion
            dur={`${1.2 + i * 0.4}s`}
            repeatCount="indefinite"
            path={`M${e.x1},${e.y1} L${e.x2},${e.y2}`}
          />
        </circle>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT: Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ x, y, size, delay, reverse }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${reverse ? 'animate-float-particle-rev' : 'animate-float-particle'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(249,115,22,0.9) 0%, rgba(251,146,60,0.4) 100%)',
        animationDelay: `${delay}ms`,
        animationDuration: `${2 + Math.random()}s`,
        animationIterationCount: 'infinite',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: AISearchWorkflow
───────────────────────────────────────────────────────────── */
export default function AISearchWorkflow({ query, productData, onComplete }) {
  const getTime = useRealTime();

  // ── State ──────────────────────────────────────────────────
  const [phase, setPhase] = useState('scraping'); // scraping | analyzing | predicting | success
  const [storeStatuses, setStoreStatuses] = useState(
    STORES.map(s => ({ ...s, status: 'idle', price: null }))
  );
  const [completedCount, setCompletedCount]     = useState(0);
  const [progressPercent, setProgressPercent]   = useState(0);
  const [terminalLogs, setTerminalLogs]         = useState([]);
  const [analysisChecks, setAnalysisChecks]     = useState(
    ANALYSIS_TASKS.map(t => ({ ...t, done: false, active: false }))
  );
  const [predProgress, setPredProgress]         = useState(0);
  const [predResult, setPredResult]             = useState(null);
  const [successVisible, setSuccessVisible]     = useState(false);

  const terminalRef  = useRef(null);
  const timeouts     = useRef([]);

  // ── Helpers ────────────────────────────────────────────────
  const addLog = (message, type = 'info') => {
    setTerminalLogs(prev => [
      ...prev,
      { id: Date.now() + Math.random(), time: getTime(), message, type },
    ]);
  };

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms);
    timeouts.current.push(t);
  };

  // ── Resolve prices from productData or fallback mocks ─────
  const prices = useMemo(() => {
    if (!productData) {
      return { amazon: 54990, noon: 53750, jumia: 55200, btech: 56900, raya: 57500 };
    }
    const find = (key) =>
      productData.stores?.find(s => s.name.toLowerCase().includes(key))?.price;
    return {
      amazon: find('amazon') || 54990,
      noon:   find('noon')   || 53750,
      jumia:  find('jumia')  || 55200,
      btech:  find('b.tech') || find('btech') || 56900,
      raya:   find('raya')   || 57500,
    };
  }, [productData]);

  const predData = useMemo(() => {
    const rec = productData?.recommendation;
    return {
      change:     rec?.expectedChange || '-3%',
      action:     rec?.action         || 'Buy',
      confidence: rec?.confidence     || 92,
    };
  }, [productData]);

  // ── Main Timeline ──────────────────────────────────────────
  useEffect(() => {
    addLog(`Initializing AI agent for "${query}"...`);
    after(380, () => addLog('Establishing connections to 5 retailers...'));

    // Orchestrate each store through its states
    STORES.forEach((store, idx) => {
      const base = store.delay + 200;

      after(base, () => {
        addLog(`Connecting to ${store.name}...`);
        setStoreStatuses(prev =>
          prev.map(s => s.id === store.id ? { ...s, status: 'connecting' } : s)
        );
      });
      after(base + 280, () => {
        addLog(`Reading product data from ${store.name}...`);
        setStoreStatuses(prev =>
          prev.map(s => s.id === store.id ? { ...s, status: 'reading' } : s)
        );
      });
      after(base + 560, () => {
        addLog(`Extracting prices from ${store.name}...`);
        setStoreStatuses(prev =>
          prev.map(s => s.id === store.id ? { ...s, status: 'comparing' } : s)
        );
      });
      after(base + 820, () => {
        const storePrice = prices[store.id];
        addLog(`✓ ${store.name}: EGP ${storePrice.toLocaleString()}`, 'success');
        setStoreStatuses(prev =>
          prev.map(s => s.id === store.id ? { ...s, status: 'done', price: storePrice } : s)
        );
        setCompletedCount(c => c + 1);
        setProgressPercent(Math.round(((idx + 1) / STORES.length) * 100));
      });
    });

    // ── All stores done → switch to ANALYZING (~2.9s) ────────
    after(2900, () => {
      addLog('All stores scanned. Starting AI analysis...', 'highlight');
      setPhase('analyzing');
    });

    const analysisSchedule = [
      { t: 3100, logMsg: 'Identifying cheapest retailer...',           taskIdx: 0 },
      { t: 3400, logMsg: 'Analyzing 90-day price history...',          taskIdx: 1 },
      { t: 3700, logMsg: 'Comparing market trends across Egypt...',    taskIdx: 2 },
      { t: 4000, logMsg: 'Running ML price prediction model...',       taskIdx: 3 },
      { t: 4300, logMsg: 'Computing confidence score...',              taskIdx: 4 },
    ];
    analysisSchedule.forEach(({ t, logMsg, taskIdx }) => {
      after(t - 100, () => {
        setAnalysisChecks(prev => prev.map((c, i) => i === taskIdx ? { ...c, active: true } : c));
        addLog(logMsg);
      });
      after(t + 100, () => {
        setAnalysisChecks(prev => prev.map((c, i) => i === taskIdx ? { ...c, done: true, active: false } : c));
      });
    });

    // ── Switch to PREDICTING (~4.6s) ─────────────────────────
    after(4600, () => {
      addLog('Generating price prediction report...', 'highlight');
      setPhase('predicting');
    });

    // Animate prediction progress bar
    after(4800, () => {
      let p = 0;
      const iv = setInterval(() => {
        p += 3.5;
        if (p >= 100) {
          p = 100;
          clearInterval(iv);
        }
        setPredProgress(Math.round(p));
      }, 30);
      timeouts.current.push(iv);
    });

    // Reveal prediction result
    after(5750, () => {
      const isDown = predData.change.startsWith('-');
      setPredResult({
        change:     predData.change,
        confidence: predData.confidence,
        trend:      isDown ? 'down' : predData.change.startsWith('+') ? 'up' : 'stable',
        reason: isDown
          ? `Price has dropped consistently over the last 7 days.`
          : `Market demand is pushing prices upward. Consider buying soon.`,
      });
      addLog(`Prediction: ${predData.change} change expected (${predData.confidence}% confidence)`, 'success');
    });

    // ── Success & complete (~6.6s) ────────────────────────────
    after(6500, () => {
      addLog('Analysis complete. Displaying results...', 'success');
      setSuccessVisible(true);
    });
    after(7000, () => {
      onComplete?.();
    });

    return () => timeouts.current.forEach(id => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // ── Particles for AI phase ────────────────────────────────
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      size: `${4 + Math.random() * 5}px`,
      delay: i * 200,
      reverse: i % 2 === 0,
    })),
  []);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-background/97 backdrop-blur-md flex flex-col animate-workflow-appear overflow-hidden">

      {/* ── Top Progress Bar ──────────────────────────────── */}
      <div className="h-0.5 bg-surface/80 shrink-0">
        <div
          className="h-full bg-linear-to-r from-orange-500 via-amber-400 to-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Header ───────────────────────────────────────── */}
      <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-border/40 flex items-center justify-between gap-4">
        <div className="min-w-0">
          {phase === 'scraping' && (
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex space-x-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                         style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <h1 className="font-extrabold text-lg sm:text-xl text-text-primary tracking-tight">
                  Searching all stores...
                </h1>
              </div>
              <p className="text-sm text-text-secondary">
                Our AI agent is finding the best deal for{' '}
                <span className="font-bold text-primary">"{query}"</span>
              </p>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shrink-0">
                <Brain className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-primary/30 animate-ping" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl text-text-primary tracking-tight">
                  AI Engine Activated
                </h1>
                <p className="text-sm text-text-secondary">
                  Analyzing {STORES.length} stores · {terminalLogs.length} data points collected
                </p>
              </div>
            </div>
          )}

          {(phase === 'predicting' || phase === 'success') && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-success to-emerald-400 flex items-center justify-center shadow-lg shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl text-text-primary tracking-tight">
                  {successVisible ? 'Analysis Complete' : 'Price Prediction'}
                </h1>
                <p className="text-sm text-text-secondary">
                  {successVisible ? 'Preparing your results...' : 'Running predictive models...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Store counter badge */}
        <div className="shrink-0 text-right">
          <div className="inline-flex items-center space-x-2 bg-card/60 glass border border-border rounded-xl px-4 py-2">
            <Globe className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-black text-text-primary tabular-nums">
                {completedCount} / {STORES.length}
              </p>
              <p className="text-[10px] text-muted font-semibold">stores scanned</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">

        {/* Left / Main Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 min-h-0">

          {/* ─── SCRAPING PHASE ─────────────────────────── */}
          {phase === 'scraping' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storeStatuses.map(store => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              {/* Progress summary */}
              <div className="glass border border-border rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    Scanning Stores
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {completedCount < STORES.length
                      ? `Estimated remaining: ${((STORES.length - completedCount) * 0.7).toFixed(1)}s`
                      : 'All stores scanned ✓'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary tabular-nums">{progressPercent}%</p>
                  <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">Complete</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── ANALYZING PHASE ────────────────────────── */}
          {phase === 'analyzing' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

              {/* Neural Network Visualization */}
              <div className="relative glass border border-border/60 rounded-2xl p-6 overflow-hidden">
                {/* Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {particles.map((p, i) => (
                    <Particle key={i} {...p} />
                  ))}
                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
                </div>

                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center space-x-2">
                    <span className="inline-flex w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Neural Pattern Recognition</span>
                  </p>
                  <NeuralNetViz />
                </div>
              </div>

              {/* Analysis task checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisChecks.map((task, i) => {
                  const { Icon } = task;
                  return (
                    <div
                      key={task.id}
                      className={`
                        flex items-center space-x-3 p-4 rounded-2xl border transition-all duration-500
                        animate-tilt-in
                        ${task.done
                          ? 'bg-success/5 border-success/25'
                          : task.active
                            ? 'bg-primary/5 border-primary/25 animate-border-glow'
                            : 'bg-card/30 border-border/30 opacity-40'
                        }
                      `}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={`
                        w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                        ${task.done   ? 'bg-success/15' : task.active ? 'bg-primary/15' : 'bg-surface'}
                      `}>
                        {task.done ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <Icon className={`w-4 h-4 ${task.active ? 'text-primary animate-pulse' : 'text-muted'}`} />
                        )}
                      </div>
                      <p className={`text-sm font-semibold transition-all duration-300 ${
                        task.done   ? 'text-success'       :
                        task.active ? 'text-text-primary'  :
                                      'text-muted'
                      }`}>
                        {task.label}
                      </p>
                      {task.active && (
                        <div className="ml-auto flex space-x-0.5">
                          {[0,1,2].map(j => (
                            <div
                              key={j}
                              className="w-1 h-1 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: `${j * 120}ms` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── PREDICTING PHASE ───────────────────────── */}
          {phase === 'predicting' && (
            <div className="max-w-xl mx-auto space-y-5 animate-fade-in">

              {/* Price Prediction card */}
              <div className="glass border border-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-text-primary">Price Prediction</p>
                    <p className="text-xs text-muted">ML model with 90-day historical data</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Analyzing patterns...</span>
                    <span className="text-primary tabular-nums">{predProgress}%</span>
                  </div>
                  <div className="h-2 bg-surface/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-500 via-amber-400 to-orange-400 transition-all duration-100"
                      style={{ width: `${predProgress}%` }}
                    />
                  </div>
                </div>

                {/* Prediction result reveal */}
                {predResult && (
                  <div className="space-y-4 animate-slide-up-reveal">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border">
                      <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
                          Expected Price Change
                        </p>
                        <div className="flex items-center space-x-2">
                          {predResult.trend === 'down' ? (
                            <TrendingDown className="w-5 h-5 text-success" />
                          ) : predResult.trend === 'up' ? (
                            <TrendingUp className="w-5 h-5 text-danger" />
                          ) : (
                            <Minus className="w-5 h-5 text-text-secondary" />
                          )}
                          <span className={`text-2xl font-black tabular-nums ${
                            predResult.trend === 'down' ? 'text-success' :
                            predResult.trend === 'up'   ? 'text-danger' :
                                                          'text-text-primary'
                          }`}>
                            {predResult.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
                          Confidence
                        </p>
                        <p className="text-2xl font-black text-primary tabular-nums">
                          {predResult.confidence}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                        "{predResult.reason}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Success state */}
              {successVisible && (
                <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-slide-up-reveal">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-success/15 animate-ping" />
                    <div className="relative w-16 h-16 rounded-full bg-success/20 border-2 border-success/40 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                  </div>
                  <p className="font-extrabold text-text-primary text-lg">Analysis Complete</p>
                  <p className="text-sm text-text-secondary">Preparing your results...</p>
                  <div className="flex space-x-1.5">
                    {[0,1,2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-success animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right/Bottom: Terminal Panel ─────── */}
        <div className="w-full lg:w-80 h-56 sm:h-64 lg:h-full shrink-0 border-t lg:border-t-0 lg:border-l border-border/30 p-4 min-h-0 bg-[#09070f]/40 backdrop-blur-xs">
          <TerminalPanel logs={terminalLogs} terminalRef={terminalRef} />
        </div>
      </div>
    </div>
  );
}
