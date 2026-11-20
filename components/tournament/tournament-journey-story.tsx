"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccommodationTier } from "@/lib/tournament-budget";

interface TournamentJourneyStoryProps {
  accommodationTier: AccommodationTier;
  participants: number;
  cars: number;
}

type StoryStepId =
  | "departure"
  | "match-day1"
  | "city-food"
  | "stay"
  | "match-day2"
  | "trophy"
  | "return";

interface StoryStep {
  id: StoryStepId;
  eyebrow: string;
  title: string;
  shortTitle: string;
  caption: string;
}

const CONVOY_POSITIONS = [
  { x: 135, color: "#38bdf8", delay: "0.2s" },
  { x: 350, color: "#fbbf24", delay: "0.1s" },
  { x: 565, color: "#f97316", delay: "0s" }, // Lead car
];

export function TournamentJourneyStory({
  accommodationTier,
  participants,
  cars,
}: TournamentJourneyStoryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps: StoryStep[] = [
    {
      id: "departure",
      eyebrow: "1. Gün • Yola Çıkış",
      title: "Bodrum'dan Konvoy Hareketi",
      shortTitle: "Yola Çıkış",
      caption: `${cars} araçla ${participants} Discobolos oyuncusu Kırklareli yolunda.`,
    },
    {
      id: "match-day1",
      eyebrow: "1. Gün • İlk Düdük",
      title: "Varır Varmaz Sahadayız",
      shortTitle: "1. Gün Maçları",
      caption: "Konaklamaya geçmeden doğrudan sahaya: 1. gün maçları başlıyor!",
    },
    {
      id: "city-food",
      eyebrow: "1. Gün Akşamı • Trakya Bağ Rotası",
      title: "Üzüm Bağları & Şarap Keyfi",
      shortTitle: "Bağlar & Şarap",
      caption: "Maçların ardından Kırklareli üzüm bağlarında gezi ve akşam şarap molası.",
    },
    {
      id: "stay",
      eyebrow: "1. Gece • Dinlenme",
      title: "Kırklareli'nde Konaklama",
      shortTitle: "Konaklama",
      caption:
        accommodationTier === "free"
          ? "Yıldızların altında macera dolu gece uykusu."
          : "Final gününe tam enerjiyle hazırlanmak için dinlenme.",
    },
    {
      id: "match-day2",
      eyebrow: "2. Gün • Final Mücadelesi",
      title: "2. Gün Maçları & Yarı Final",
      shortTitle: "2. Gün Final",
      caption: "İkinci gün sahada yüksek tempo, Spirit of the Game ve final heyecanı!",
    },
    {
      id: "trophy",
      eyebrow: "2. Gün • Zafer Anı",
      title: "Kupa Bizim Olacak!",
      shortTitle: "Kupa Bizim!",
      caption: "Eğer gidersek bu kupa Discobolos ellerinde yükselecek.",
    },
    {
      id: "return",
      eyebrow: "2. Gün Akşamı • Eve Dönüş",
      title: "Kupayla Bodrum'a Dönüş",
      shortTitle: "Zafer Dönüşü",
      caption: "En öndeki aracın üstünde kupa, 3 araçla zafer konvoyu eve dönüyor.",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const current = steps[activeIndex];

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    setIsPlaying(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      {/* Cinematic SVG Stage */}
      <div className="relative h-60 w-full overflow-hidden sm:h-68">
        <svg
          viewBox="0 0 900 260"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          aria-label={current.title}
        >
          <defs>
            <linearGradient id="sky-dawn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="55%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="65%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <linearGradient id="sky-evening" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="55%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="sky-field" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="65%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="sky-field-day2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="sky-victory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="sky-sunset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b0764" />
              <stop offset="50%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="gold-trophy" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* SCENE 1 & 7: 3-CAR CONVOY ROAD TRIP */}
          {(current.id === "departure" || current.id === "return") && (
            <g>
              <rect
                width="900"
                height="260"
                fill={
                  current.id === "departure" ? "url(#sky-dawn)" : "url(#sky-sunset)"
                }
              />
              {/* Sun */}
              <circle
                cx={current.id === "departure" ? 760 : 140}
                cy="74"
                r="34"
                fill="#fde047"
                opacity="0.88"
              />
              {/* Distant Mountains */}
              <path
                d="M0 148 L140 90 L290 140 L450 82 L640 142 L790 98 L900 132 L900 260 L0 260 Z"
                fill="#0f172a"
                opacity="0.45"
              />
              <path
                d="M0 160 L180 116 L340 155 L540 110 L720 154 L900 124 L900 260 L0 260 Z"
                fill="#0f172a"
                opacity="0.7"
              />
              {/* Bodrum Palm Silhouettes on Return */}
              {current.id === "return" && (
                <g transform="translate(65, 96)" fill="#0f172a" opacity="0.85">
                  <rect x="18" y="20" width="5" height="45" rx="2" />
                  <path d="M20 22 Q2 10 -6 26 Q8 22 20 22 Z" />
                  <path d="M20 22 Q38 10 46 26 Q32 22 20 22 Z" />
                  <path d="M20 22 Q10 0 2 10 Q14 14 20 22 Z" />
                  <path d="M20 22 Q30 0 38 10 Q26 14 20 22 Z" />
                </g>
              )}

              {/* Asphalt Road (positioned above bottom text overlay) */}
              <rect x="0" y="156" width="900" height="104" fill="#1e293b" />
              <rect x="0" y="156" width="900" height="4" fill="#475569" />

              {/* Animated Road Dashes */}
              <g className="animate-journey-road">
                {Array.from({ length: 24 }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 48}
                    y="179"
                    width="24"
                    height="3.5"
                    rx="1.5"
                    fill="#facc15"
                    opacity="0.85"
                  />
                ))}
              </g>

              {/* 3-Car Convoy */}
              {CONVOY_POSITIONS.map((car, idx) => {
                const isLeadCar = idx === CONVOY_POSITIONS.length - 1;
                return (
                  <g key={car.x} transform={`translate(${car.x}, 116)`}>
                    <g
                      className="animate-journey-car"
                      style={{ animationDelay: car.delay }}
                    >
                      {/* Shadow */}
                      <ellipse
                        cx="68"
                        cy="46"
                        rx="60"
                        ry="6"
                        fill="#000000"
                        opacity="0.45"
                      />
                      {/* Headlight Beam */}
                      <polygon
                        points="126,28 196,15 196,44 126,35"
                        fill="#fef08a"
                        opacity="0.2"
                      />
                      {/* Roof Rack + Ultimate Disc on Roof */}
                      <rect
                        x="38"
                        y="-2"
                        width="44"
                        height="3.5"
                        rx="1.5"
                        fill="#94a3b8"
                      />
                      <ellipse cx="60" cy="-5" rx="15" ry="4" fill="#ffffff" />
                      <ellipse cx="60" cy="-5.5" rx="10" ry="2.2" fill="#f59e0b" />

                      {/* Trophy on TOP of the Disc on the Lead Car on Return! */}
                      {current.id === "return" && isLeadCar && (
                        <g transform="translate(46, -34)">
                          <path
                            d="M5 10 C0 10 0 18 6 19"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M23 10 C28 10 28 18 22 19"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5 7 L23 7 L20 21 Q14 27 8 21 Z"
                            fill="url(#gold-trophy)"
                          />
                          <rect x="12.5" y="23" width="3" height="5" fill="#d97706" />
                          <rect
                            x="8"
                            y="27"
                            width="12"
                            height="3"
                            rx="1"
                            fill="#92400e"
                          />
                          <circle
                            cx="14"
                            cy="3"
                            r="2"
                            fill="#fef08a"
                            className="animate-journey-sparkle"
                          />
                        </g>
                      )}

                      {/* Car Body */}
                      <path
                        d="M10 32 L15 18 Q21 12 36 10 L52 2 Q65 0 85 2 L102 13 Q120 16 125 25 L127 35 Q127 39 120 39 L15 39 Q8 39 10 32 Z"
                        fill={car.color}
                      />
                      {/* Windows */}
                      <path
                        d="M39 12 L53 4 L79 4 L95 14 Z"
                        fill="#e0f2fe"
                        opacity="0.92"
                      />
                      <line
                        x1="67"
                        y1="4"
                        x2="67"
                        y2="14"
                        stroke={car.color}
                        strokeWidth="2.5"
                      />
                      {/* Wheels */}
                      <circle cx="34" cy="39" r="9.5" fill="#0f172a" />
                      <circle cx="34" cy="39" r="4.2" fill="#cbd5e1" />
                      <circle cx="102" cy="39" r="9.5" fill="#0f172a" />
                      <circle cx="102" cy="39" r="4.2" fill="#cbd5e1" />
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* SCENE 2 & 5: DAY 1 & DAY 2 ULTIMATE FRISBEE MATCHES */}
          {(current.id === "match-day1" || current.id === "match-day2") && (
            <g>
              <rect
                width="900"
                height="260"
                fill={
                  current.id === "match-day1"
                    ? "url(#sky-field)"
                    : "url(#sky-field-day2)"
                }
              />
              {/* Day Badge in Sky */}
              <g transform="translate(390, 26)">
                <rect
                  width="120"
                  height="26"
                  rx="13"
                  fill="#0f172a"
                  opacity="0.6"
                />
                <text
                  x="60"
                  y="17"
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {current.id === "match-day1" ? "1. GÜN MAÇLARI" : "2. GÜN FİNAL"}
                </text>
              </g>

              {/* Stadium/Field Grass */}
              <rect x="0" y="148" width="900" height="112" fill="#15803d" />
              <line
                x1="0"
                y1="170"
                x2="900"
                y2="170"
                stroke="#dcfce7"
                strokeWidth="2"
                opacity="0.55"
              />
              <line
                x1="180"
                y1="148"
                x2="120"
                y2="260"
                stroke="#dcfce7"
                strokeWidth="2"
                opacity="0.45"
              />
              <line
                x1="720"
                y1="148"
                x2="780"
                y2="260"
                stroke="#dcfce7"
                strokeWidth="2"
                opacity="0.45"
              />

              {/* Left Player Silhouette (Thrower) */}
              <g transform="translate(260, 108)" fill="#0f172a">
                <circle cx="14" cy="10" r="8" />
                <path d="M12 20 L18 20 L22 44 L10 44 Z" fill="#f97316" />
                <line
                  x1="18"
                  y1="26"
                  x2="36"
                  y2="18"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="13"
                  y1="44"
                  x2="6"
                  y2="66"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="19"
                  y1="44"
                  x2="26"
                  y2="66"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* Right Player Silhouette (Receiver) */}
              <g transform="translate(600, 104)" fill="#0f172a">
                <circle cx="14" cy="10" r="8" />
                <path d="M10 20 L20 20 L22 44 L8 44 Z" fill="#f97316" />
                <line
                  x1="10"
                  y1="24"
                  x2="-8"
                  y2="10"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="44"
                  x2="4"
                  y2="66"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="18"
                  y1="44"
                  x2="28"
                  y2="66"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* Flying Ultimate Disc */}
              <g transform="translate(425, 82)">
                <g className="animate-journey-frisbee">
                  <path
                    d="M-36 10 Q-16 14 0 12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.75"
                  />
                  <ellipse cx="22" cy="8" rx="22" ry="6" fill="#ffffff" />
                  <ellipse cx="22" cy="7" rx="16" ry="3.5" fill="#f59e0b" />
                </g>
              </g>
            </g>
          )}

          {/* SCENE 3: KIRKLARELI VINEYARDS & WINE */}
          {current.id === "city-food" && (
            <g>
              <rect width="900" height="260" fill="url(#sky-evening)" />
              {/* Warm Evening Sun */}
              <circle cx="710" cy="72" r="30" fill="#fde047" opacity="0.75" />

              {/* Rolling Thrace Vineyard Hills */}
              <path
                d="M0 150 Q220 112 450 145 Q680 175 900 132 L900 260 L0 260 Z"
                fill="#14532d"
                opacity="0.7"
              />
              <path
                d="M0 170 Q260 138 520 166 Q730 185 900 156 L900 260 L0 260 Z"
                fill="#166534"
              />

              {/* Vineyard Trellis Rows & Purple Grape Clusters */}
              {[110, 190, 270, 620, 700, 780].map((vx, idx) => (
                <g key={vx} transform={`translate(${vx}, 118)`}>
                  <rect x="0" y="14" width="4" height="36" fill="#78350f" />
                  <ellipse cx="2" cy="14" rx="18" ry="12" fill="#15803d" />
                  <circle cx="-4" cy="18" r="3.5" fill="#7e22ce" />
                  <circle cx="4" cy="19" r="3.5" fill="#6b21a8" />
                  <circle cx="0" cy="24" r="3.5" fill="#581c87" />
                  {idx % 2 === 0 && (
                    <circle cx="8" cy="15" r="3" fill="#7e22ce" />
                  )}
                </g>
              ))}

              {/* Oak Barrel / Wine Table */}
              <rect x="0" y="182" width="900" height="78" fill="#451a03" />
              <rect x="0" y="182" width="900" height="5" fill="#78350f" />

              {/* Wine Bottle & Two Wine Glasses */}
              <g transform="translate(390, 102)">
                {/* Wine Bottle */}
                <rect x="44" y="22" width="22" height="58" rx="4" fill="#14532d" />
                <rect x="50" y="4" width="10" height="20" rx="2" fill="#14532d" />
                <rect x="50" y="4" width="10" height="5" fill="#991b1b" />
                <rect x="47" y="40" width="16" height="20" rx="1" fill="#fef3c7" />

                {/* Left Wine Glass */}
                <g transform="translate(0, 26)">
                  <path
                    d="M4 0 L28 0 L26 22 Q16 32 6 22 Z"
                    fill="#ffffff"
                    opacity="0.28"
                    stroke="#f8fafc"
                    strokeWidth="1.5"
                  />
                  <path d="M6 12 L26 12 L25 21 Q16 29 7 21 Z" fill="#881337" />
                  <line x1="16" y1="27" x2="16" y2="52" stroke="#f8fafc" strokeWidth="2" />
                  <ellipse cx="16" cy="52" rx="10" ry="2.5" fill="#f8fafc" opacity="0.85" />
                </g>

                {/* Right Wine Glass */}
                <g transform="translate(82, 26)">
                  <path
                    d="M4 0 L28 0 L26 22 Q16 32 6 22 Z"
                    fill="#ffffff"
                    opacity="0.28"
                    stroke="#f8fafc"
                    strokeWidth="1.5"
                  />
                  <path d="M6 12 L26 12 L25 21 Q16 29 7 21 Z" fill="#9f1239" />
                  <line x1="16" y1="27" x2="16" y2="52" stroke="#f8fafc" strokeWidth="2" />
                  <ellipse cx="16" cy="52" rx="10" ry="2.5" fill="#f8fafc" opacity="0.85" />
                </g>

                {/* Gentle Sparkle */}
                <circle
                  cx="16"
                  cy="22"
                  r="2.5"
                  fill="#fde047"
                  className="animate-journey-sparkle"
                />
                <circle
                  cx="98"
                  cy="20"
                  r="2.5"
                  fill="#fde047"
                  className="animate-journey-sparkle"
                  style={{ animationDelay: "0.7s" }}
                />
              </g>
            </g>
          )}

          {/* SCENE 4: NIGHT / STAY */}
          {current.id === "stay" && (
            <g>
              <rect width="900" height="260" fill="url(#sky-night)" />
              {/* Stars */}
              {[
                [120, 42],
                [210, 75],
                [310, 34],
                [460, 58],
                [590, 30],
                [760, 68],
                [820, 40],
              ].map(([cx, cy], idx) => (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={idx % 2 === 0 ? 2 : 1.3}
                  fill="#fef9c3"
                  className="animate-journey-sparkle"
                  style={{ animationDelay: `${idx * 0.25}s` }}
                />
              ))}
              {/* Crescent Moon */}
              <circle cx="720" cy="65" r="24" fill="#fef08a" />
              <circle cx="730" cy="59" r="21" fill="#1e1b4b" />

              {/* Ground */}
              <path
                d="M0 176 Q450 156 900 176 L900 260 L0 260 Z"
                fill="#0f172a"
              />

              {accommodationTier === "free" ? (
                <g transform="translate(360, 108)">
                  <polygon points="90,0 165,68 15,68" fill="#10b981" />
                  <polygon points="90,0 120,68 60,68" fill="#047857" />
                  <polygon
                    points="90,26 108,68 72,68"
                    fill="#fef08a"
                    opacity="0.75"
                  />
                </g>
              ) : (
                <g transform="translate(360, 76)">
                  <rect x="0" y="18" width="180" height="86" rx="4" fill="#1e293b" />
                  <polygon points="-10,20 90,-14 190,20" fill="#334155" />
                  {[24, 74, 124].map((wx) => (
                    <rect
                      key={wx}
                      x={wx}
                      y="36"
                      width="28"
                      height="24"
                      rx="2"
                      fill="#fde047"
                      opacity="0.9"
                    />
                  ))}
                  <rect
                    x="76"
                    y="72"
                    width="28"
                    height="32"
                    rx="2"
                    fill="#f59e0b"
                    opacity="0.8"
                  />
                </g>
              )}

              {/* Floating Zzz */}
              <text
                x="560"
                y="96"
                fill="#c7d2fe"
                fontSize="20"
                fontWeight="bold"
                className="animate-journey-zzz"
              >
                Zzz
              </text>
              <text
                x="588"
                y="76"
                fill="#a5b4fc"
                fontSize="14"
                fontWeight="bold"
                className="animate-journey-zzz"
                style={{ animationDelay: "0.9s" }}
              >
                z
              </text>
            </g>
          )}

          {/* SCENE 6: TROPHY VICTORY */}
          {current.id === "trophy" && (
            <g>
              <rect width="900" height="260" fill="url(#sky-victory)" />
              {/* Spotlight Rays */}
              <polygon points="450,240 240,0 660,0" fill="#fde047" opacity="0.1" />
              <polygon points="450,240 340,0 560,0" fill="#fef08a" opacity="0.14" />

              {/* Confetti & Sparkles */}
              {[
                [260, 52, "#f59e0b"],
                [320, 36, "#38bdf8"],
                [580, 42, "#10b981"],
                [630, 64, "#f43f5e"],
                [360, 84, "#fde047"],
                [540, 86, "#fb923c"],
              ].map(([cx, cy, color], idx) => (
                <circle
                  key={idx}
                  cx={Number(cx)}
                  cy={Number(cy)}
                  r="4"
                  fill={String(color)}
                  className="animate-journey-sparkle"
                  style={{ animationDelay: `${idx * 0.22}s` }}
                />
              ))}

              {/* Podium */}
              <rect x="370" y="176" width="160" height="84" rx="4" fill="#1e293b" />
              <rect x="370" y="176" width="160" height="5" fill="#f59e0b" />

              {/* Golden Trophy */}
              <g transform="translate(410, 46)">
                <g className="animate-journey-trophy">
                  <path
                    d="M12 22 C-8 22 -8 56 16 58"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M68 22 C88 22 88 56 64 58"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12 L68 12 L62 66 Q40 88 18 66 Z"
                    fill="url(#gold-trophy)"
                  />
                  <rect x="34" y="76" width="12" height="28" fill="#d97706" />
                  <rect x="20" y="104" width="40" height="12" rx="3" fill="#92400e" />
                  <polygon
                    points="40,28 43,36 52,36 45,41 47,49 40,44 33,49 35,41 28,36 37,36"
                    fill="#fffbeb"
                  />
                </g>
              </g>
            </g>
          )}
        </svg>

        {/* Bottom Overlay Copy */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 py-3 sm:px-5 sm:py-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                {current.eyebrow}
              </p>
              <h3 className="text-base font-bold tracking-tight sm:text-lg">
                {current.title}
              </h3>
              <p className="text-xs text-white/85">{current.caption}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/15 text-white hover:bg-white/25 border-0"
                onClick={() =>
                  handleSelect((activeIndex - 1 + steps.length) % steps.length)
                }
                aria-label="Önceki sahne"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/15 text-white hover:bg-white/25 border-0"
                onClick={() => setIsPlaying((v) => !v)}
                aria-label={isPlaying ? "Duraklat" : "Oynat"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/15 text-white hover:bg-white/25 border-0"
                onClick={() => handleSelect((activeIndex + 1) % steps.length)}
                aria-label="Sonraki sahne"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Step Progress Bar */}
      <div className="grid grid-cols-2 gap-1 bg-muted/40 p-2 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((step, idx) => {
          const isCurrent = idx === activeIndex;
          const isPast = idx < activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`group flex flex-col gap-1 rounded-md px-2 py-1.5 text-left transition-colors ${
                isCurrent ? "bg-background shadow-xs" : "hover:bg-background/60"
              }`}
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCurrent
                      ? "w-full bg-primary"
                      : isPast
                        ? "w-full bg-primary/40"
                        : "w-0"
                  }`}
                />
              </div>
              <span
                className={`line-clamp-2 text-[11px] leading-tight font-medium ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
