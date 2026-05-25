export type VehicleType = 'premium' | 'business' | 'prestige' | 'minibus';

export interface VehicleSpec {
  type: VehicleType;
  name: string;
  tagline: string;
  capacity: number;
  examples: string;
}

export const VEHICLES: VehicleSpec[] = [
  {
    type: 'premium',
    name: 'Premium',
    tagline: 'Le confort, partout en ville',
    capacity: 3,
    examples: 'Mercedes Classe E · BMW Série 5',
  },
  {
    type: 'business',
    name: 'Business',
    tagline: 'Élégance et discrétion',
    capacity: 3,
    examples: 'Mercedes Classe S · Audi A8',
  },
  {
    type: 'prestige',
    name: 'Prestige',
    tagline: 'L’expérience d’exception',
    capacity: 3,
    examples: 'Mercedes Maybach · Rolls-Royce',
  },
  {
    type: 'minibus',
    name: 'Minibus',
    tagline: 'Pour vos groupes',
    capacity: 7,
    examples: 'Mercedes Classe V · VW Multivan',
  },
];
