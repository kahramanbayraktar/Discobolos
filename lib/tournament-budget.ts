export type RouteTier = 'economic' | 'fast';
export type AccommodationTier = 'free' | 'economic' | 'comfort';
export type FoodTier = 'economic' | 'comfort';
export type FuelType = 'gasoline' | 'diesel';

export const FUEL_PRICES_TRY: Record<FuelType, number> = {
  gasoline: 72,
  diesel: 90,
};

export interface TournamentPreset {
  id: string;
  name: string;
  location: string;
  origin: string;
  durationLabel: string;
  nights: number;
  days: number;
  oneWayKmEconomic: number;
  oneWayKmFast: number;
  tollRoundTripEconomic: number;
  tollRoundTripFast: number;
  defaultFuelConsumption: number;
  defaultFuelPrice: number;
  accommodationEconomicPerNight: number;
  accommodationComfortPerNight: number;
  foodEconomicPerDay: number;
  foodComfortPerDay: number;
  defaultPlayerFee: number;
  defaultTeamFee: number;
}

export interface BudgetConfig {
  participants: number;
  cars: number;
  nights: number;
  days: number;
  routeTier: RouteTier;
  accommodationTier: AccommodationTier;
  foodTier: FoodTier;
  fuelConsumptionPer100Km: number;
  fuelPricePerLiter: number;
  oneWayKmEconomic: number;
  oneWayKmFast: number;
  tollRoundTripEconomic: number;
  tollRoundTripFast: number;
  accommodationEconomicPerNight: number;
  accommodationComfortPerNight: number;
  foodEconomicPerDay: number;
  foodComfortPerDay: number;
  playerFee: number;
  teamFee: number;
}

export interface CostBreakdown {
  transportPerPerson: number;
  fuelTotalAllCars: number;
  tollTotalAllCars: number;
  transportPerCar: number;
  accommodationPerPerson: number;
  foodPerPerson: number;
  tournamentPerPerson: number;
  totalPerPerson: number;
  totalTeamCost: number;
}

export const KIRKLARELI_PRESET: TournamentPreset = {
  id: 'kirklareli-2026',
  name: 'Kırklareli Ultimate Turnuvası',
  location: 'Kırklareli',
  origin: 'Bodrum',
  durationLabel: '2 Gün • 1 Gece (İlk gün gidiş)',
  nights: 1,
  days: 2,
  oneWayKmEconomic: 825,
  oneWayKmFast: 840,
  tollRoundTripEconomic: 1450, // GESTAŞ Feribot gidiş-dönüş (2 x 725 TL)
  tollRoundTripFast: 2960, // 1915 Çanakkale Köprüsü + Malkara Otoyolu (2 x ~1.480 TL)
  defaultFuelConsumption: 6.5,
  defaultFuelPrice: FUEL_PRICES_TRY.gasoline,
  accommodationEconomicPerNight: 750, // Paylaşımlı 1+1 / 2+1 daire (~1.500-2.500 TL/daire)
  accommodationComfortPerNight: 2200, // Merkez otel (2.100-3.000 TL/oda)
  foodEconomicPerDay: 450,
  foodComfortPerDay: 1100,
  defaultPlayerFee: 600,
  defaultTeamFee: 0,
};

export function createInitialBudgetConfig(
  preset: TournamentPreset = KIRKLARELI_PRESET
): BudgetConfig {
  const defaultParticipants = 12;
  return {
    participants: defaultParticipants,
    cars: suggestCarCount(defaultParticipants, 4),
    nights: preset.nights,
    days: preset.days,
    routeTier: 'economic',
    accommodationTier: 'economic',
    foodTier: 'economic',
    fuelConsumptionPer100Km: preset.defaultFuelConsumption,
    fuelPricePerLiter: preset.defaultFuelPrice,
    oneWayKmEconomic: preset.oneWayKmEconomic,
    oneWayKmFast: preset.oneWayKmFast,
    tollRoundTripEconomic: preset.tollRoundTripEconomic,
    tollRoundTripFast: preset.tollRoundTripFast,
    accommodationEconomicPerNight: preset.accommodationEconomicPerNight,
    accommodationComfortPerNight: preset.accommodationComfortPerNight,
    foodEconomicPerDay: preset.foodEconomicPerDay,
    foodComfortPerDay: preset.foodComfortPerDay,
    playerFee: preset.defaultPlayerFee,
    teamFee: preset.defaultTeamFee,
  };
}

/**
 * Suggests number of cars based on target seats per car (default 4).
 */
export function suggestCarCount(participants: number, seatsPerCar = 4): number {
  const safeParticipants = Math.max(1, participants);
  const safeSeats = Math.max(1, seatsPerCar);
  return Math.max(1, Math.ceil(safeParticipants / safeSeats));
}

/**
 * Calculates full cost breakdown for a given budget configuration.
 */
export function calculateBudget(config: BudgetConfig): CostBreakdown {
  const participants = Math.max(1, config.participants);
  const cars = Math.max(1, config.cars);

  const oneWayKm =
    config.routeTier === 'economic'
      ? config.oneWayKmEconomic
      : config.oneWayKmFast;
  const roundTripKm = oneWayKm * 2;

  const fuelPerCar =
    (roundTripKm / 100) *
    config.fuelConsumptionPer100Km *
    config.fuelPricePerLiter;

  const tollPerCar =
    config.routeTier === 'economic'
      ? config.tollRoundTripEconomic
      : config.tollRoundTripFast;

  const transportPerCar = fuelPerCar + tollPerCar;
  const fuelTotalAllCars = fuelPerCar * cars;
  const tollTotalAllCars = tollPerCar * cars;
  const transportPerPerson = (transportPerCar * cars) / participants;

  const nightlyRate =
    config.accommodationTier === 'free'
      ? 0
      : config.accommodationTier === 'economic'
        ? config.accommodationEconomicPerNight
        : config.accommodationComfortPerNight;
  const accommodationPerPerson = nightlyRate * config.nights;

  const dailyFoodRate =
    config.foodTier === 'economic'
      ? config.foodEconomicPerDay
      : config.foodComfortPerDay;
  const foodPerPerson = dailyFoodRate * config.days;

  const tournamentPerPerson =
    config.playerFee + config.teamFee / participants;

  const totalPerPerson =
    transportPerPerson +
    accommodationPerPerson +
    foodPerPerson +
    tournamentPerPerson;

  const totalTeamCost = totalPerPerson * participants;

  return {
    transportPerPerson: Math.round(transportPerPerson),
    fuelTotalAllCars: Math.round(fuelTotalAllCars),
    tollTotalAllCars: Math.round(tollTotalAllCars),
    transportPerCar: Math.round(transportPerCar),
    accommodationPerPerson: Math.round(accommodationPerPerson),
    foodPerPerson: Math.round(foodPerPerson),
    tournamentPerPerson: Math.round(tournamentPerPerson),
    totalPerPerson: Math.round(totalPerPerson),
    totalTeamCost: Math.round(totalTeamCost),
  };
}

/**
 * Computes minimum (all economic) and maximum/comfort (all comfort) scenarios
 * for the same participant/car/fee configuration.
 */
export function calculateMinMaxRange(config: BudgetConfig): {
  min: CostBreakdown;
  comfort: CostBreakdown;
} {
  const min = calculateBudget({
    ...config,
    routeTier: 'economic',
    accommodationTier: 'economic',
    foodTier: 'economic',
  });

  const comfort = calculateBudget({
    ...config,
    routeTier: 'fast',
    accommodationTier: 'comfort',
    foodTier: 'comfort',
  });

  return { min, comfort };
}

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}
