"use client";

import React, { useMemo, useState } from "react";
import {
  Car,
  Users,
  BedDouble,
  Utensils,
  Trophy,
  Fuel,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingDown,
  MapPin,
  SlidersHorizontal,
  PieChart,
  Disc,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TournamentJourneyStory } from "@/components/tournament/tournament-journey-story";
import {
  KIRKLARELI_PRESET,
  FUEL_PRICES_TRY,
  createInitialBudgetConfig,
  calculateBudget,
  calculateMinMaxRange,
  suggestCarCount,
  formatTRY,
  type BudgetConfig,
  type RouteTier,
  type AccommodationTier,
  type FoodTier,
  type FuelType,
} from "@/lib/tournament-budget";

const SCENARIO_PARTICIPANTS = [8, 10, 12, 14, 16, 18];

export function TournamentBudgetCalculator() {
  const [config, setConfig] = useState<BudgetConfig>(() =>
    createInitialBudgetConfig(KIRKLARELI_PRESET)
  );
  const [autoCars, setAutoCars] = useState<boolean>(true);
  const [targetSeatsPerCar, setTargetSeatsPerCar] = useState<number>(4);
  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const active = useMemo(() => calculateBudget(config), [config]);
  const { min, comfort } = useMemo(() => calculateMinMaxRange(config), [config]);

  const handleParticipantsChange = (nextParticipants: number) => {
    const clamped = Math.max(4, Math.min(24, nextParticipants));
    setConfig((prev) => ({
      ...prev,
      participants: clamped,
      cars: autoCars ? suggestCarCount(clamped, targetSeatsPerCar) : prev.cars,
    }));
  };

  const handleAutoCarsToggle = (checked: boolean) => {
    setAutoCars(checked);
    if (checked) {
      setConfig((prev) => ({
        ...prev,
        cars: suggestCarCount(prev.participants, targetSeatsPerCar),
      }));
    }
  };

  const handleSeatsPerCarChange = (seats: number) => {
    setTargetSeatsPerCar(seats);
    if (autoCars) {
      setConfig((prev) => ({
        ...prev,
        cars: suggestCarCount(prev.participants, seats),
      }));
    }
  };

  const handleReset = () => {
    setAutoCars(true);
    setTargetSeatsPerCar(4);
    setFuelType("gasoline");
    setConfig(createInitialBudgetConfig(KIRKLARELI_PRESET));
  };

  const handleFuelTypeChange = (nextFuel: FuelType) => {
    setFuelType(nextFuel);
    setConfig((prev) => ({
      ...prev,
      fuelPricePerLiter: FUEL_PRICES_TRY[nextFuel],
    }));
  };

  const handleApplyMinimum = () => {
    setConfig((prev) => ({
      ...prev,
      routeTier: "economic",
      accommodationTier: "economic",
      foodTier: "economic",
    }));
  };

  const handleCopySummary = async () => {
    const routeLabel =
      config.routeTier === "economic"
        ? "Ekonomik (Feribot + Devlet Yolu)"
        : "Hızlı (Köprü + Otoyol)";
    const accLabel =
      config.accommodationTier === "free"
        ? "Arabada / Çadırda (0 TL)"
        : config.accommodationTier === "economic"
          ? "Ekonomik (Apart / Pansiyon / Yurt)"
          : "Konforlu (Otel)";
    const foodLabel =
      config.foodTier === "economic"
        ? "Ekonomik (Market / Sandviç)"
        : "Konforlu (Restoran / Kafe)";

    const summary = [
      `🥏 *Discobolos - ${KIRKLARELI_PRESET.name} Bütçe Özeti*`,
      `📍 ${KIRKLARELI_PRESET.origin} ↔ ${KIRKLARELI_PRESET.location} (${KIRKLARELI_PRESET.durationLabel})`,
      `👥 Katılım: ${config.participants} kişi • 🚗 ${config.cars} araç`,
      ``,
      `💰 *Kişi Başı Tahmini Tutarlar:*`,
      `• Minimum (En Ekonomik): *${formatTRY(min.totalPerPerson)}*`,
      `• Seçili Plan: *${formatTRY(active.totalPerPerson)}*`,
      `• Konforlu Seçenek: *${formatTRY(comfort.totalPerPerson)}*`,
      ``,
      `📊 *Seçili Plan Kırılımı (Kişi Başı):*`,
      `- Ulaşım (${routeLabel}): ${formatTRY(active.transportPerPerson)}`,
      `- Konaklama (${config.nights} gece, ${accLabel}): ${formatTRY(active.accommodationPerPerson)}`,
      `- Yeme-İçme (${config.days} gün, ${foodLabel}): ${formatTRY(active.foodPerPerson)}`,
      `- Turnuva Ücreti (Tahmini): ${formatTRY(active.tournamentPerPerson)}`,
      ``,
      `🧾 Araç başı yol masrafı: ${formatTRY(active.transportPerCar)}`,
      `👥 Takım toplamı (${config.participants} kişi): ${formatTRY(active.totalTeamCost)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback not needed; ignore silently if blocked
    }
  };

  const peoplePerCar = (config.participants / Math.max(1, config.cars)).toFixed(1);

  const breakdownBars = [
    {
      label: "Yol / Ulaşım",
      value: active.transportPerPerson,
      color: "bg-amber-500",
      stroke: "#f59e0b",
    },
    {
      label: "Konaklama",
      value: active.accommodationPerPerson,
      color: "bg-blue-500",
      stroke: "#3b82f6",
    },
    {
      label: "Yiyecek",
      value: active.foodPerPerson,
      color: "bg-rose-500",
      stroke: "#f43f5e",
    },
    {
      label: "Maç / Turnuva Ücreti",
      value: active.tournamentPerPerson,
      color: "bg-emerald-500",
      stroke: "#10b981",
    },
  ];

  const totalForBar = Math.max(1, active.totalPerPerson);
  const maxItemValue = Math.max(...breakdownBars.map((b) => b.value));

  // SVG Donut Chart geometry
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;
  const donutSegments = breakdownBars.map((item) => {
    const percent = item.value / totalForBar;
    const strokeLength = percent * circumference;
    const dashOffset = -cumulativePercent * circumference;
    cumulativePercent += percent;
    return {
      ...item,
      percent: Math.round(percent * 100),
      strokeDasharray: `${strokeLength} ${circumference}`,
      strokeDashoffset: dashOffset,
    };
  });

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="gap-1.5 whitespace-nowrap">
            <MapPin className="h-3.5 w-3.5" />
            {KIRKLARELI_PRESET.origin} ↔ {KIRKLARELI_PRESET.location}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            {KIRKLARELI_PRESET.durationLabel}
          </Badge>
          <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 whitespace-nowrap">
            Turnuva ücreti tahmini
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyMinimum}
            className="gap-1.5 whitespace-nowrap"
          >
            <TrendingDown className="h-4 w-4" />
            Minimuma Çek
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCopySummary}
            className="gap-1.5 whitespace-nowrap"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Kopyalandı!" : "WhatsApp Özeti Kopyala"}
          </Button>
        </div>
      </div>

      {/* Journey Storyboard */}
      <TournamentJourneyStory
        accommodationTier={config.accommodationTier}
        participants={config.participants}
        cars={config.cars}
      />

      {/* Hero Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="font-medium text-emerald-700 dark:text-emerald-400">
                Minimum (En Ekonomik)
              </CardDescription>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                Taban Bütçe
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {formatTRY(min.totalPerPerson)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ kişi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Feribot + Apart/Pansiyon + Ekonomik Yemek</p>
            <p className="font-medium text-foreground">
              Takım toplamı: {formatTRY(min.totalTeamCost)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 shadow-sm ring-1 ring-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="font-semibold text-primary">
                Seçili Plan (Kişi Başı)
              </CardDescription>
              <Badge className="whitespace-nowrap">Aktif Simülasyon</Badge>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {formatTRY(active.totalPerPerson)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ kişi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              {breakdownBars.map((item) => (
                <div
                  key={item.label}
                  className={item.color}
                  style={{ width: `${(item.value / totalForBar) * 100}%` }}
                  title={`${item.label}: ${formatTRY(item.value)}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {breakdownBars.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  {item.label}: <strong className="text-foreground">{formatTRY(item.value)}</strong>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="font-medium">
                Konforlu Seçenek (Maksimum)
              </CardDescription>
              <Badge variant="secondary" className="gap-1 whitespace-nowrap">
                <Sparkles className="h-3 w-3" />
                Otel + Hızlı Yol
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {formatTRY(comfort.totalPerPerson)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ kişi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Köprü/Otoyol + Otel + Restoran</p>
            <p className="font-medium text-foreground">
              Fark: +{formatTRY(comfort.totalPerPerson - min.totalPerPerson)} / kişi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pie / Donut Chart Breakdown Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-primary" />
              Harcama Nereye Gidiyor? (Kişi Başı Dağılım)
              <Disc className="animate-journey-frisbee h-4 w-4 text-amber-500/80 ml-1" />
            </CardTitle>
            <Badge variant="outline" className="whitespace-nowrap">
              Toplam: {formatTRY(active.totalPerPerson)} / kişi
            </Badge>
          </div>
          <CardDescription>
            Hangi kalemin bütçeyi en çok etkilediğini görüp kısabileceğiniz alanları test edin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            {/* SVG Donut Chart */}
            <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
              <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="26"
                  className="text-muted/40"
                />
                {donutSegments.map((seg) =>
                  seg.value > 0 ? (
                    <circle
                      key={seg.label}
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="transparent"
                      stroke={seg.stroke}
                      strokeWidth="26"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  ) : null
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Kişi Başı
                </span>
                <span className="text-xl font-bold tracking-tight">
                  {formatTRY(active.totalPerPerson)}
                </span>
              </div>
            </div>

            {/* Breakdown Legend & Percentages */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {donutSegments.map((seg) => {
                const isLargest = seg.value === maxItemValue && seg.value > 0;
                return (
                  <div
                    key={seg.label}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                      isLargest ? "border-amber-500/40 bg-amber-500/5" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full"
                        style={{ backgroundColor: seg.stroke }}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-sm font-semibold truncate">{seg.label}</p>
                          {isLargest ? (
                            <Badge
                              variant="outline"
                              className="border-amber-500/50 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0 whitespace-nowrap"
                            >
                              En Büyük Kalem
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Bütçenin %{seg.percent}&apos;i
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap">
                      {formatTRY(seg.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Participation & Cars */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Katılım ve Araç Planı
            </CardTitle>
            <CardDescription>
              Katılım sayısına göre araç sayısını otomatik veya manuel ayarlayın.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Participants Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="participants-slider" className="text-sm font-medium">
                  Katılımcı Sayısı
                </Label>
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary whitespace-nowrap">
                  {config.participants} kişi
                </span>
              </div>
              <Slider
                id="participants-slider"
                min={6}
                max={22}
                step={1}
                value={[config.participants]}
                onValueChange={([val]) => handleParticipantsChange(val)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6 kişi</span>
                <span>14 kişi</span>
                <span>22 kişi</span>
              </div>
            </div>

            <Separator />

            {/* Car Count */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Otomatik Araç Hesabı</Label>
                  <p className="text-xs text-muted-foreground">
                    Kişi sayısına göre araç sayısını öner
                  </p>
                </div>
                <Switch checked={autoCars} onCheckedChange={handleAutoCarsToggle} />
              </div>

              {autoCars ? (
                <div className="flex flex-wrap gap-2">
                  {[4, 5].map((seats) => (
                    <Button
                      key={seats}
                      type="button"
                      size="sm"
                      variant={targetSeatsPerCar === seats ? "default" : "outline"}
                      onClick={() => handleSeatsPerCarChange(seats)}
                      className="flex-1 whitespace-nowrap"
                    >
                      Araç başı {seats} kişi
                    </Button>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Car className="animate-journey-car h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {config.cars} Araç
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Araç başı ortalama {peoplePerCar} kişi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={config.cars <= 1}
                    onClick={() => {
                      setAutoCars(false);
                      setConfig((prev) => ({ ...prev, cars: Math.max(1, prev.cars - 1) }));
                    }}
                  >
                    -
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={config.cars >= 8}
                    onClick={() => {
                      setAutoCars(false);
                      setConfig((prev) => ({ ...prev, cars: Math.min(8, prev.cars + 1) }));
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Fuel Type Quick Toggle */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Yakıt Türü (20 Kasım 2026 Ortalaması)
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={fuelType === "gasoline" ? "default" : "outline"}
                    onClick={() => handleFuelTypeChange("gasoline")}
                    className="flex-1 whitespace-nowrap"
                  >
                    Benzin (~{FUEL_PRICES_TRY.gasoline} TL/L)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={fuelType === "diesel" ? "default" : "outline"}
                    onClick={() => handleFuelTypeChange("diesel")}
                    className="flex-1 whitespace-nowrap"
                  >
                    Motorin (~{FUEL_PRICES_TRY.diesel} TL/L)
                  </Button>
                </div>
              </div>

              {/* Transport quick stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Araç Başı Yol</p>
                  <p className="mt-0.5 text-sm font-bold">{formatTRY(active.transportPerCar)}</p>
                </div>
                <div className="rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Kişi Başı Yol</p>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {formatTRY(active.transportPerPerson)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Tier Selections (Economic vs Comfort) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Gider Tercihleri (Ekonomik vs. Konforlu)
            </CardTitle>
            <CardDescription>
              Takım taban maliyeti minimumda tutabilir; dileyen üyeler konforlu seçeneği işaretleyip kendi bütçesini görebilir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Route Tier */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                Yol & Geçiş Güzergahı (Gidiş-Dönüş)
              </Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    {
                      id: "economic" as RouteTier,
                      title: "Ekonomik (Feribot + Devlet Yolu)",
                      desc: `~${config.oneWayKmEconomic * 2} km • Geçiş ~${formatTRY(config.tollRoundTripEconomic)}/araç`,
                    },
                    {
                      id: "fast" as RouteTier,
                      title: "Hızlı (Köprü + Otoyol)",
                      desc: `~${config.oneWayKmFast * 2} km • Geçiş ~${formatTRY(config.tollRoundTripFast)}/araç`,
                    },
                  ] as const
                ).map((opt) => {
                  const selected = config.routeTier === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, routeTier: opt.id }))}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <p className="text-sm font-semibold">{opt.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accommodation Tier */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="relative inline-flex items-center">
                    <BedDouble className="h-4 w-4 text-blue-500" />
                    <span className="animate-journey-zzz absolute -top-2.5 -right-3 text-[9px] font-bold text-indigo-500">
                      z
                    </span>
                  </span>
                  Konaklama ({config.nights} Gece)
                </Label>
                <span className="text-xs text-muted-foreground">
                  Seçili: <strong className="text-foreground">{formatTRY(active.accommodationPerPerson)}</strong> / kişi
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div
                  onClick={() => setConfig((prev) => ({ ...prev, accommodationTier: "free" }))}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    config.accommodationTier === "free"
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className="text-sm font-semibold">Arabada / Çadırda</p>
                  <p className="mt-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    0 TL / gece
                  </p>
                </div>
                {(
                  [
                    {
                      id: "economic" as AccommodationTier,
                      title: "Ekonomik (Paylaşımlı Apart)",
                      price: config.accommodationEconomicPerNight,
                      field: "accommodationEconomicPerNight" as const,
                    },
                    {
                      id: "comfort" as AccommodationTier,
                      title: "Konforlu (Merkez Otel)",
                      price: config.accommodationComfortPerNight,
                      field: "accommodationComfortPerNight" as const,
                    },
                  ] as const
                ).map((opt) => {
                  const selected = config.accommodationTier === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setConfig((prev) => ({ ...prev, accommodationTier: opt.id }))}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{opt.title}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          type="number"
                          min={0}
                          step={50}
                          value={opt.price}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              [opt.field]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                          className="h-8 w-24 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">TL/gece</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food Tier */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="relative inline-flex items-center">
                    <Utensils className="h-4 w-4 text-rose-500" />
                    <span className="animate-journey-steam absolute -top-2.5 left-1 h-2 w-0.5 rounded-full bg-rose-400" />
                  </span>
                  Yeme - İçme ({config.days} Gün)
                </Label>
                <span className="text-xs text-muted-foreground">
                  Seçili: <strong className="text-foreground">{formatTRY(active.foodPerPerson)}</strong> / kişi
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    {
                      id: "economic" as FoodTier,
                      title: "Ekonomik (Market / Sandviç)",
                      price: config.foodEconomicPerDay,
                      field: "foodEconomicPerDay" as const,
                    },
                    {
                      id: "comfort" as FoodTier,
                      title: "Konforlu (Restoran / Kafe)",
                      price: config.foodComfortPerDay,
                      field: "foodComfortPerDay" as const,
                    },
                  ] as const
                ).map((opt) => {
                  const selected = config.foodTier === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setConfig((prev) => ({ ...prev, foodTier: opt.id }))}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <p className="text-sm font-semibold">{opt.title}</p>
                      <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          type="number"
                          min={0}
                          step={50}
                          value={opt.price}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              [opt.field]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                          className="h-8 w-28 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">TL / gün</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Tournament Fee + Advanced Toggle */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="relative inline-flex items-center">
                    <Trophy className="animate-journey-trophy h-4 w-4 text-amber-500" />
                    <Sparkles className="animate-journey-sparkle -ml-1 -mt-2.5 h-2.5 w-2.5 text-amber-400" />
                  </span>
                  Turnuva Ücreti (Şimdilik Tahmini)
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="h-7 text-xs"
                >
                  {showAdvanced ? "Yakıt & Mesafe Ayarlarını Gizle" : "Yakıt & Mesafe İnce Ayar"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="player-fee" className="text-xs text-muted-foreground">
                    Kişi Başı Ücret (Player Fee - TL)
                  </Label>
                  <Input
                    id="player-fee"
                    type="number"
                    min={0}
                    step={50}
                    value={config.playerFee}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        playerFee: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-fee" className="text-xs text-muted-foreground">
                    Takım Ücreti (Team Fee - Kişiye bölünür)
                  </Label>
                  <Input
                    id="team-fee"
                    type="number"
                    min={0}
                    step={100}
                    value={config.teamFee}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        teamFee: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                  />
                </div>
              </div>

              {showAdvanced ? (
                <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fuel-cons" className="text-xs text-muted-foreground">
                      Yakıt Tüketimi (L / 100 km)
                    </Label>
                    <Input
                      id="fuel-cons"
                      type="number"
                      min={3}
                      max={15}
                      step={0.5}
                      value={config.fuelConsumptionPer100Km}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          fuelConsumptionPer100Km: Math.max(1, Number(e.target.value) || 6.5),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fuel-price" className="text-xs text-muted-foreground">
                      Yakıt Fiyatı (TL / Litre)
                    </Label>
                    <Input
                      id="fuel-price"
                      type="number"
                      min={1}
                      step={1}
                      value={config.fuelPricePerLiter}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          fuelPricePerLiter: Math.max(1, Number(e.target.value) || 44),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="toll-eco" className="text-xs text-muted-foreground">
                      Ekonomik Geçiş / Feribot (Gidiş-Dönüş TL/Araç)
                    </Label>
                    <Input
                      id="toll-eco"
                      type="number"
                      min={0}
                      step={100}
                      value={config.tollRoundTripEconomic}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          tollRoundTripEconomic: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="toll-fast" className="text-xs text-muted-foreground">
                      Hızlı Köprü / Otoyol (Gidiş-Dönüş TL/Araç)
                    </Label>
                    <Input
                      id="toll-fast"
                      type="number"
                      min={0}
                      step={100}
                      value={config.tollRoundTripFast}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          tollRoundTripFast: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Katılım Sayısına Göre Kişi Başı Senaryo Tablosu</CardTitle>
          <CardDescription>
            Takım kalabalıklaştıkça ve araçlar doldukça kişi başı maliyetin nasıl düştüğünü karşılaştırın (mevcut yakıt ve ücret ayarlarınızla).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2.5 pr-4 font-medium">Katılım</th>
                  <th className="py-2.5 pr-4 font-medium">Önerilen Araç (4 kişi/araç)</th>
                  <th className="py-2.5 pr-4 font-medium">Kişi Başı Ulaşım (Ekonomik)</th>
                  <th className="py-2.5 pr-4 font-medium text-emerald-700 dark:text-emerald-400">
                    Minimum Toplam / Kişi
                  </th>
                  <th className="py-2.5 font-medium">Konforlu Toplam / Kişi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {SCENARIO_PARTICIPANTS.map((count) => {
                  const cars = suggestCarCount(count, targetSeatsPerCar);
                  const rowRange = calculateMinMaxRange({
                    ...config,
                    participants: count,
                    cars,
                  });
                  const isCurrent = count === config.participants;
                  return (
                    <tr
                      key={count}
                      onClick={() => handleParticipantsChange(count)}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        isCurrent ? "bg-primary/10 font-medium" : ""
                      }`}
                    >
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {count} kişi {isCurrent ? "• (Seçili)" : ""}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">{cars} araç</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {formatTRY(rowRange.min.transportPerPerson)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        {formatTRY(rowRange.min.totalPerPerson)}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {formatTRY(rowRange.comfort.totalPerPerson)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
