import coffeeCup from '../models/CoffeCup.glb?url';
import turkishCoffee from  '../models/CupofCoffee.glb?url';

// Update this file with the shop's real details before publishing.
export const shop = {
  name: 'الخال',
  logo: '/alkhal-logo.png',
  currency: 'JOD',
  locale: 'en-JO',
  priceDecimals: 2,
  isDemo: true,
};

export const categories = [
  { id: 'coffee', name: 'Coffee', sceneLabel: 'HOT COFFEE' },
  { id: 'soft-drinks', name: 'Soft drinks', sceneLabel: 'SOFT DRINKS' },
  { id: 'cold-drinks', name: 'Cold drinks', sceneLabel: 'COLD DRINKS' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export interface Drink {
  id: string;
  category: CategoryId;
  name: string;
  arabicName: string;
  description: string;
  price: number;
  tone: 'oat' | 'clay';
  model: string;
  modelAlt: string;
  modelNote: string;
}

// Each drink can use its own imported .glb URL.
const cup = {
  model: coffeeCup,
  modelAlt: 'An interactive 3D takeaway coffee cup with a lid',
  modelNote: 'Cup preview · presentation may vary',
};

const turkish = {
  model: turkishCoffee,
  modelAlt: 'An interactive 3D coffee cup',
  modelNote: 'Cup preview · presentation may vary',
};

export const drinks: Drink[] = [
  { id: 'latte', category: 'coffee', name: 'Latte', arabicName: 'لاتيه', description: 'Espresso & steamed milk', price: 3.50, tone: 'oat', ...cup },
  { id: 'turkish-coffee', category: 'coffee', name: 'Turkish coffee', arabicName: 'قهوة تركية', description: 'Rich, traditional coffee', price: 2.00, tone: 'clay', ...turkish },
];
