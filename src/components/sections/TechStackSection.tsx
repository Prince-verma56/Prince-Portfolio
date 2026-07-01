"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import { Highlighter } from "../ui/highlighter";
import {
  AreaChart, Area, RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import CountUp from "react-countup";

gsap.registerPlugin(ScrollTrigger);

// ── PREMIUM CARD PRIMITIVE ──────────────────────────────────────────────────
// Glass + gradient border + optional glow
const GlassCard = ({
  children,
  className = "",
  glow = false,
  glowColor = "#f04e00",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  accent?: boolean;
}) => (
  <div
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)",
      border: accent
        ? `1px solid ${glowColor}55`
        : "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(12px)",
      boxShadow: glow
        ? `0 0 40px ${glowColor}22, inset 0 1px 0 rgba(255,255,255,0.06)`
        : "inset 0 1px 0 rgba(255,255,255,0.05)",
    }}
  >
    {/* Inner top sheen */}
    <div
      className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
      style={{
        background: accent
          ? `linear-gradient(90deg, transparent, ${glowColor}80, transparent)`
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
      }}
    />
    {children}
  </div>
);

// ── STATUS DOT ──────────────────────────────────────────────────────────────
const StatusDot = ({ color, pulse = false }: { color: string; pulse?: boolean }) => (
  <span
    className={`inline-flex w-2 h-2 rounded-full flex-shrink-0 ${pulse ? "animate-pulse" : ""}`}
    style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
  />
);

// ── KPI ROW ─────────────────────────────────────────────────────────────────
const KpiRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{label}</span>
    <span className="font-black text-sm" style={{ color }}>
      {value}
    </span>
  </div>
);

// ── NODE CARD ───────────────────────────────────────────────────────────────
const NodeCard = ({
  label,
  color,
  accent = false,
  className = "",
}: {
  label: string;
  color: string;
  accent?: boolean;
  className?: string;
}) => (
  <GlassCard accent={accent} glowColor={color} glow={accent} className={`px-4 py-2.5 flex items-center gap-2.5 ${className}`}>
    <StatusDot color={color} pulse={accent} />
    <span className="font-mono text-[10px] text-white font-bold tracking-wider">{label}</span>
  </GlassCard>
);

// ── 1. PREMIUM NARRATIVE DATA STRUCTURE ────────────────────────────────────
const phases = [
  {
    id: "01",
    name: "Understand",
    titleTop: "UNDERSTAND",
    titleBottom: "THE PROBLEM",
    bgText: "DISCOVERY",
    details: ["User Analytics", "Drop-off Mapping", "Evidence Gathering"],
    visual: (
      <div className="relative w-full h-[320px] flex items-center justify-center">
        {/* ── LEFT: Trend chart ── */}
        <div className="absolute left-0 top-[30px] eco-item">
          <GlassCard className="w-[210px] p-4">
            {/* gradient corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ background: "#ef4444" }} />
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-3 block">
              Bounce Rate — 7D
            </span>
            <div style={{ width: 178, height: 72 }}>
              <AreaChart width={178} height={72} data={[
                { v: 40 }, { v: 43 }, { v: 38 }, { v: 56 },
                { v: 65 }, { v: 71 }, { v: 78 },
              ]}>
                <defs>
                  <linearGradient id="gBounce" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#gBounce)" />
              </AreaChart>
            </div>
            {/* shimmer line */}
            <div className="mt-2 h-[1px] w-full rounded-full" style={{ background: "linear-gradient(90deg, #ef444400, #ef444466, #ef444400)" }} />
          </GlassCard>
        </div>

        {/* ── RIGHT: KPI stack ── */}
        <div className="absolute right-0 top-[20px] flex flex-col gap-2.5 eco-item">
          {[
            { label: "Bounce Rate", val: <><CountUp start={0} end={78} duration={2.5} />%</>, color: "#ef4444" },
            { label: "Avg Drop-off", val: <><CountUp start={0} end={2.4} decimals={1} duration={2.5} />s</>, color: "#f97316" },
            { label: "Funnel Loss", val: <><CountUp start={0} end={31} duration={2.5} />%</>, color: "#eab308" },
          ].map(({ label, val, color }) => (
            <GlassCard key={label} className="w-[175px] px-4 py-2.5">
              <div
                className="absolute left-0 top-0 h-full w-[2px] rounded-l-2xl"
                style={{ background: color }}
              />
              <KpiRow label={label} value={val} color={color} />
            </GlassCard>
          ))}
        </div>

        {/* ── CENTER: Focal badge ── */}
        <div className="absolute bottom-[10px] z-10 eco-item">
          <GlassCard accent glowColor="#f04e00" glow className="w-[240px] p-5 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: "#f04e00" }} />
            <div className="w-2 h-2 rounded-full bg-[#f04e00] mx-auto mb-3 animate-pulse" style={{ boxShadow: "0 0 10px #f04e00" }} />
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">
              Root Problem Identified
            </h4>
            <span
              className="text-[9px] font-mono px-3 py-1 rounded-full font-bold tracking-wider inline-flex items-center gap-1.5"
              style={{
                background: "rgba(0,230,118,0.08)",
                border: "1px solid rgba(0,230,118,0.25)",
                color: "#00e676",
              }}
            >
              ✓ Validated
            </span>
          </GlassCard>
        </div>
      </div>
    ),
  },

  {
    id: "02",
    name: "Design",
    titleTop: "DESIGN",
    titleBottom: "THE EXPERIENCE",
    bgText: "DESIGN",
    details: ["Skeleton Blueprints", "Token Systems", "Interface Layouts"],
    visual: (
      <div className="relative w-full h-[320px] flex flex-col items-center justify-center gap-5">

        {/* ── Row 1: Token cards ── */}
        <div className="flex gap-3 w-full justify-center eco-item">
          {[
            {
              label: "Typography",
              content: <div className="text-xl font-serif font-black text-white mt-1 tracking-tight">Aa</div>,
            },
            {
              label: "Colors",
              content: (
                <div className="flex gap-1.5 mt-1">
                  {["#f04e00", "#00e676", "#61dafb", "#a855f7"].map((c) => (
                    <div
                      key={c}
                      className="w-5 h-5 rounded-full ring-1 ring-white/10"
                      style={{ background: c, boxShadow: `0 0 8px ${c}66` }}
                    />
                  ))}
                </div>
              ),
            },
            {
              label: "Spacing",
              content: (
                <div className="flex gap-1 items-end h-5 mt-1">
                  {[1, 2, 4, 5].map((h) => (
                    <div key={h} className="w-2 rounded-sm bg-white/40" style={{ height: `${h * 4}px` }} />
                  ))}
                </div>
              ),
            },
          ].map(({ label, content }) => (
            <GlassCard key={label} className="w-[130px] px-3.5 py-3 flex flex-col gap-1">
              <span
                className="text-[8px] font-mono px-2 py-0.5 rounded-full w-fit"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
              >
                {label}
              </span>
              {content}
            </GlassCard>
          ))}
        </div>

        {/* ── Row 2: Component wireframes ── */}
        <div className="flex gap-3 w-full justify-center eco-item">
          <GlassCard className="w-[215px] p-4 flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Header Component</span>
            <div
              className="w-full flex justify-between items-center p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="flex gap-2">
                {[12, 16].map((w) => (
                  <div key={w} className="h-1.5 rounded-full" style={{ width: `${w}px`, background: "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="w-[215px] p-4 flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">CTA Block</span>
            <div
              className="w-full h-10 p-2 rounded-xl flex flex-col items-center justify-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div
                className="w-24 h-3 rounded-full"
                style={{ background: "rgba(240,78,0,0.18)", border: "1px solid rgba(240,78,0,0.35)" }}
              />
            </div>
          </GlassCard>
        </div>

        {/* ── Row 3: Pipeline stages ── */}
        <div className="flex items-center gap-2 eco-item">
          <div className="h-[1px] w-12 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          {["Sketch", "Wireframe", "Prototype", "System"].map((stage, i) => (
            <span
              key={stage}
              className="text-[8px] font-mono px-2.5 py-1 rounded-full uppercase font-bold"
              style={
                i === 3
                  ? {
                      background: "#f04e00",
                      color: "#fff",
                      boxShadow: "0 0 14px #f04e0066",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.35)",
                    }
              }
            >
              {stage}
            </span>
          ))}
          <div className="h-[1px] w-12 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    ),
  },

  {
    id: "03",
    name: "Build",
    titleTop: "BUILD",
    titleBottom: "THE SOLUTION",
    bgText: "SYSTEMS",
    details: ["Node Architecture", "Continuous Flows", "State Synced"],
    visual: (
      <div className="relative w-full h-[320px] flex items-center justify-center">
        <style>{`
          .dash-flow { animation: dashFlow 1.8s linear infinite; }
          @keyframes dashFlow { to { stroke-dashoffset: -24; } }
        `}</style>

        {/* SVG connections */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* paths */}
          <path id="pFE"   d="M 160 160 C 210 160 235 85 280 85" fill="none" stroke="rgba(240,78,0,0.35)" strokeWidth="1.5" strokeDasharray="5 5" className="dash-flow" />
          <path id="pDB"   d="M 280 85  C 280 130 280 185 280 238" fill="none" stroke="rgba(0,230,118,0.3)" strokeWidth="1.5" strokeDasharray="5 5" className="dash-flow" />
          <path id="pAUTH" d="M 340 85  C 380 85 410 100 450 100" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" strokeDasharray="5 5" className="dash-flow" />
          <path id="pEXT"  d="M 340 85  C 380 120 410 185 450 190" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 5" className="dash-flow" />
          {/* animated data packets */}
          {(["#f04e00","#00e676","#a855f7","rgba(255,255,255,0.5)"] as const).map((color, i) => (
            <circle key={i} r="3.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
              <animateMotion dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite">
                <mpath href={["#pFE","#pDB","#pAUTH","#pEXT"][i]} />
              </animateMotion>
            </circle>
          ))}
        </svg>

        {/* FRONTEND */}
        <div className="absolute top-[138px] left-[30px] eco-item z-10">
          <NodeCard label="FRONTEND" color="#61dafb" />
        </div>

        {/* API GATEWAY — accent hero */}
        <div className="absolute top-[52px] left-[196px] eco-item z-10">
          <GlassCard accent glowColor="#f04e00" glow className="px-5 py-3 flex items-center gap-3">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full blur-2xl opacity-40 pointer-events-none" style={{ background: "#f04e00" }} />
            <StatusDot color="#f04e00" pulse />
            <span className="font-mono text-[11px] text-white font-black tracking-wider">API_GATEWAY</span>
          </GlassCard>
        </div>

        {/* DATABASE */}
        <div className="absolute top-[220px] left-[196px] eco-item z-10">
          <NodeCard label="DATABASE" color="#00e676" />
        </div>

        {/* AUTH_SVC */}
        <div className="absolute top-[78px] left-[400px] eco-item z-10">
          <NodeCard label="AUTH_SVC" color="#a855f7" />
        </div>

        {/* EXTERNAL_API */}
        <div className="absolute top-[170px] left-[400px] eco-item z-10">
          <NodeCard label="EXTERNAL_API" color="rgba(255,255,255,0.35)" />
        </div>
      </div>
    ),
  },

  {
    id: "04",
    name: "Optimize",
    titleTop: "OPTIMIZE",
    titleBottom: "THE DETAILS",
    bgText: "PERFORMANCE",
    details: ["Core Transformation", "Timeline Compressing", "Diagnostic Array"],
    visual: (
      <div className="relative w-full h-[320px] flex items-center justify-center gap-8">

        {/* LEFT: Legacy "before" card */}
        <div className="eco-item">
          <GlassCard className="w-[135px] p-4 flex flex-col gap-0.5">
            <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-2xl opacity-15 pointer-events-none" style={{ background: "#ef4444" }} />
            <span
              className="font-mono text-[8px] text-white/30 uppercase tracking-widest pb-2 mb-1"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              Legacy Perf
            </span>
            <KpiRow label="LCP" value={<><CountUp start={10} end={3.8} decimals={1} duration={2.5} />s</>} color="#ef4444" />
            <KpiRow label="CLS" value={<><CountUp start={1} end={0.24} decimals={2} duration={2.5} /></>} color="#f97316" />
            <KpiRow label="FCP" value={<><CountUp start={8} end={2.1} decimals={1} duration={2.5} />s</>} color="#eab308" />
          </GlassCard>
        </div>

        {/* CENTER: two green radial gauges */}
        <div className="flex gap-6 eco-item">
          {["Performance", "Accessibility"].map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="relative w-[100px] h-[100px]">
                {/* outer glow ring */}
                <div
                  className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
                  style={{ background: "#00e676" }}
                />
                <RadialBarChart
                  width={100} height={100}
                  cx="50%" cy="50%"
                  innerRadius="68%" outerRadius="100%"
                  barSize={9}
                  data={[{ value: 100, fill: "#00e676" }]}
                  startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: "rgba(255,255,255,0.04)" }} dataKey="value" cornerRadius={6} />
                </RadialBarChart>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[22px] font-black"
                  style={{ color: "#00e676", textShadow: "0 0 20px #00e67688" }}
                >
                  <CountUp start={0} end={100} duration={2.5} />
                </span>
              </div>
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-widest">{name}</span>
            </div>
          ))}
        </div>

        {/* RIGHT: Load-time improvement chart */}
        <div className="eco-item">
          <GlassCard className="w-[175px] p-4 relative">
            <div className="absolute bottom-0 left-0 w-full h-14 rounded-b-2xl blur-2xl opacity-15 pointer-events-none" style={{ background: "#00e676" }} />
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block mb-2">Load Time (s)</span>
            <div style={{ width: 143, height: 60 }}>
              <AreaChart width={143} height={60} data={[{ v: 3.8 }, { v: 3.1 }, { v: 2.4 }, { v: 1.6 }, { v: 0.8 }]}>
                <defs>
                  <linearGradient id="gOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e676" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00e676" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#00e676" strokeWidth={2} fill="url(#gOpt)" />
              </AreaChart>
            </div>
            <div
              className="mt-2 flex items-center gap-1.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
              <span className="font-mono text-[9px] font-black uppercase tracking-wider" style={{ color: "#00e676" }}>
                0.8s Achieved
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    ),
  },

  {
    id: "05",
    name: "Scale",
    titleTop: "SCALE",
    titleBottom: "THE PRODUCT",
    bgText: "SCALING",
    details: ["Infrastructure Field", "Symmetric Expansion", "Orchestration Cluster"],
    visual: (
      <div className="relative w-full h-[320px] flex flex-col items-center justify-center">
        <style>{`
          @keyframes pulseRing {
            0%,100% { opacity: 0.15; transform: scale(1); }
            50%      { opacity: 0.04; transform: scale(1.06); }
          }
          .pulse-ring-anim { animation: pulseRing ease-in-out infinite; }
        `}</style>

        {/* Growth chart */}
        <div className="absolute top-0 w-[380px] h-[100px] eco-item">
          <GlassCard className="w-full h-full p-2 overflow-hidden">
            <div className="absolute top-2 right-3 z-10">
              <span
                className="font-mono text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md"
                style={{ background: "rgba(240,78,0,0.12)", color: "#f04e00", border: "1px solid rgba(240,78,0,0.3)" }}
              >
                10,000+ Users ↑
              </span>
            </div>
            <AreaChart width={364} height={96} data={[{ u: 1 }, { u: 10 }, { u: 100 }, { u: 1000 }, { u: 10000 }]}>
              <defs>
                <linearGradient id="gGrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f04e00" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#f04e00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="u" stroke="#f04e00" strokeWidth={2.5} fill="url(#gGrow)" />
            </AreaChart>
          </GlassCard>
        </div>

        {/* Orbital ecosystem */}
        <div className="relative w-full h-[200px] mt-[108px] flex items-center justify-center">
          {/* Rings */}
          {[96, 140, 185, 232].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none pulse-ring-anim"
              style={{
                width: size, height: size,
                border: "1px solid rgba(240,78,0,0.4)",
                animationDuration: `${3.5 + i}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {/* CORE */}
          <div className="z-10 eco-item">
            <GlassCard accent glowColor="#f04e00" glow className="w-[88px] h-[88px] flex flex-col items-center justify-center text-center p-2">
              <div className="absolute inset-0 rounded-2xl opacity-15 blur-xl pointer-events-none" style={{ background: "#f04e00" }} />
              <div className="w-2 h-2 rounded-full mb-2" style={{ background: "#f04e00", boxShadow: "0 0 10px #f04e00", animation: "ping 1.5s ease-out infinite" }} />
              <span className="font-mono text-[9px] text-white font-black tracking-widest leading-snug">CORE<br />CLUSTER</span>
            </GlassCard>
          </div>

          {/* Active nodes counter */}
          <div className="absolute bottom-[14px] z-20 eco-item">
            <GlassCard className="px-4 py-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00e676", boxShadow: "0 0 5px #00e676" }} />
              <span className="font-mono text-[10px] text-white/60">
                <CountUp start={0} end={10432} duration={3} separator="," /> Active Nodes
              </span>
            </GlassCard>
          </div>

          {/* Peripheral nodes */}
          {[
            { label: "NODE_01", top: "8px",  left: "155px" },
            { label: "NODE_02", bottom: "38px", right: "135px" },
            { label: "NODE_03", top: "38px",  right: "145px" },
            { label: "NODE_04", bottom: "28px", left: "170px" },
          ].map(({ label, ...style }) => (
            <div key={label} className="absolute eco-item" style={style}>
              <GlassCard className="px-2.5 py-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                <span className="font-mono text-[8px] text-white/40 font-bold">{label}</span>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ── 2. ISOLATED VISUAL STAGE TIMELINE CONTROLLER ───────────────────────────
function PhaseVisuals({ activeIndex, isLoaderFinished }: { activeIndex: number; isLoaderFinished: boolean }) {
  const prevIndexRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isLoaderFinished) return;
    const prev = prevIndexRef.current;
    if (prev === activeIndex) return;

    const tl = gsap.timeline();

    tl.fromTo(`.phase-content-${activeIndex} .title-top`,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" },
      0.05
    );
    tl.fromTo(`.phase-content-${activeIndex} .title-bottom`,
      { clipPath: "inset(100% 0 0 0)", y: 15 },
      { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.95, ease: "expo.out" },
      0.15
    );

    const ecoItems = gsap.utils.toArray(`.phase-content-${activeIndex} .eco-item`);
    if (ecoItems.length) {
      tl.fromTo(ecoItems,
        { opacity: 0, scale: 0.92, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power4.out" },
        0.25
      );
    }

    const drawPaths = gsap.utils.toArray(`.phase-content-${activeIndex} .draw-path`);
    if (drawPaths.length) {
      tl.to(drawPaths, { strokeDashoffset: 0, duration: 1.3, stagger: 0.12, ease: "power3.inOut" }, 0.35);
    }

    prevIndexRef.current = activeIndex;
  }, { scope: containerRef, dependencies: [activeIndex, isLoaderFinished] });

  return (
    <div ref={containerRef} className="relative w-full max-w-[1100px] h-full mx-auto flex flex-col items-center justify-center z-10">
      {phases.map((phase, i) => (
        <div
          key={`phase-${phase.id}`}
          className={`phase-content-${i} absolute inset-0 w-full flex flex-col items-center justify-center will-change-transform transition-opacity duration-500 ease-in-out`}
          style={{
            opacity: i === activeIndex ? 1 : 0,
            zIndex: i === activeIndex ? 10 : 1,
            pointerEvents: i === activeIndex ? "auto" : "none",
          }}
        >
          {/* Header */}
          <div className="text-center mb-6 md:mb-10 flex flex-col items-center select-none">
            <h3 className="title-top text-[clamp(1.75rem,3.5vw,3rem)] font-black uppercase text-white/70 leading-[1] tracking-tighter mb-[-6px]">
              {phase.titleTop}
            </h3>
            <div className="title-bottom overflow-hidden">
              <h2 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
                <Highlighter action="underline" color="#f04e00" strokeWidth={3} padding={4} iterations={1} isView={true}>
                  {phase.titleBottom}
                </Highlighter>
              </h2>
            </div>
          </div>

          {/* Visual canvas */}
          <div className="w-full mb-6 md:mb-8 flex items-center justify-center overflow-visible">
            <div className="scale-[0.55] min-[400px]:scale-[0.68] min-[500px]:scale-[0.8] sm:scale-90 md:scale-100 origin-center flex items-center justify-center shrink-0 w-[600px] h-[320px] relative">
              {phase.visual}
            </div>
          </div>

          {/* Caption row */}
          <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-center eco-item opacity-0 translate-y-4 max-w-[90%] mx-auto select-none">
            {phase.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(240,78,0,0.6)", boxShadow: "0 0 4px rgba(240,78,0,0.5)" }}
                />
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 3. MAIN SHELL ───────────────────────────────────────────────────────────
export default function TechStackSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useGSAP(() => {
    if (!isLoaderFinished || !wrapperRef.current || !sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      }
    );

    const TOTAL_PHASES = phases.length;
    const DEAD_ZONE_SCREENS = 1;
    const TOTAL_SCREENS = TOTAL_PHASES + DEAD_ZONE_SCREENS;

    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: `+=${TOTAL_SCREENS * 180}vh`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const currentScreen = Math.floor(self.progress * TOTAL_SCREENS);
        const targetIndex = Math.max(0, Math.min(TOTAL_PHASES - 1, currentScreen));
        setActiveIndex((prev) => (prev !== targetIndex ? targetIndex : prev));
      },
    });

    gsap.fromTo(".parallax-bg-text",
      { y: 60, opacity: 0.008 },
      {
        y: -60,
        opacity: 0.018,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      }
    );
  }, { scope: wrapperRef, dependencies: [isLoaderFinished] });

  if (!isMounted) return null;

  return (
    <div ref={wrapperRef} className="relative w-full z-10 bg-[#050505]">
      <section
        ref={sectionRef}
        id="techstack"
        className="relative w-full h-screen overflow-hidden will-change-transform flex flex-col items-center"
      >
        {/* Ambient glow */}
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-[#f04e00] opacity-[0.08] blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]" />

        {/* Corner labels */}
        <div className="absolute top-8 left-8 text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase z-20 select-none">PHASE {phases[activeIndex].id}</div>
        <div className="absolute top-8 right-8 text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase z-20 select-none">ACTIVE NARRATIVE PROCESS</div>
        <div className="absolute bottom-8 left-8 text-[#f04e00]/50 font-mono text-[9px] tracking-[0.3em] uppercase z-20 select-none animate-pulse">SCROLL TO JOURNEY</div>
        <div className="absolute bottom-8 right-8 text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase z-20 select-none">SYSTEM ©2026</div>

        {/* Sidebar tracker */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 hidden lg:flex select-none">
          {phases.map((phase, i) => {
            const isActive = i === activeIndex;
            const isPassed = i < activeIndex;
            return (
              <div key={phase.id} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? "translate-x-1" : "opacity-40"}`}>
                <span className={`font-mono text-[10px] font-bold transition-colors duration-500 ${isActive ? "text-[#f04e00]" : "text-white/30"}`}>
                  {phase.id}
                </span>
                <div className="w-[1px] h-6 bg-white/10 relative mx-0.5">
                  <div className={`absolute top-0 left-0 w-full bg-[#f04e00] transition-all duration-700 ease-out ${isActive || isPassed ? "h-full" : "h-0"}`} />
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={
                    isActive
                      ? { background: "#f04e00", boxShadow: "0 0 8px rgba(240,78,0,0.6)", transform: "scale(1.25)" }
                      : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }
                  }
                />
                <span className={`font-mono text-[9px] uppercase tracking-widest transition-all duration-500 ${isActive ? "text-white font-black" : "text-white/20"}`}>
                  {phase.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ghost word parallax */}
        <div className="parallax-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-white whitespace-nowrap pointer-events-none z-0 tracking-tighter select-none mix-blend-screen will-change-transform opacity-[0.01]">
          {phases[activeIndex].bgText}
        </div>

        <PhaseVisuals activeIndex={activeIndex} isLoaderFinished={isLoaderFinished} />
      </section>
    </div>
  );
}
