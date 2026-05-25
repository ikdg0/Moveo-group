export type VehicleType = 'premium' | 'business' | 'prestige' | 'minibus';

type Rate = { base: number; perKm: number; perPassenger: number };

const RATES: Record<VehicleType, Rate> = {
  premium:  { base: 35, perKm: 2.2, perPassenger: 0 },
  business: { base: 55, perKm: 2.8, perPassenger: 0 },
  prestige: { base: 90, perKm: 4.5, perPassenger: 0 },
  minibus:  { base: 70, perKm: 3.2, perPassenger: 4 },
};

/**
 * MVP heuristic: pas de Google Maps en v1 — on dérive un nombre de "km estimés"
 * à partir de la longueur cumulée des deux libellés saisis. C'est volontairement
 * grossier (10-150 km) — l'estimation finale sera affinée hors-app par le dispatcher.
 */
function estimateKm(origin: string, destination: string): number {
  const seed = (origin + '|' + destination).toLowerCase().trim();
  if (!seed) return 10;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const km = 10 + (hash % 140);
  return km;
}

export function estimatePrice(args: {
  origin: string;
  destination: string;
  vehicleType: VehicleType;
  passengers: number;
}): { km: number; price: number } {
  const rate = RATES[args.vehicleType];
  const km = estimateKm(args.origin, args.destination);
  const passengers = Math.max(1, Math.min(8, args.passengers || 1));
  const extra = Math.max(0, passengers - rate.perPassenger) * 0; // hook futur
  const raw = rate.base + km * rate.perKm + extra;
  const price = Math.round(raw * 100) / 100;
  return { km, price };
}

export function listVehicleEstimates(args: {
  origin: string;
  destination: string;
  passengers: number;
}): Array<{ vehicleType: VehicleType; price: number; km: number }> {
  return (Object.keys(RATES) as VehicleType[]).map((v) => {
    const { km, price } = estimatePrice({ ...args, vehicleType: v });
    return { vehicleType: v, price, km };
  });
}
