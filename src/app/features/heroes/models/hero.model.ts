export type HeroUniverse = 'Marvel' | 'DC' | 'Otro';
export type HeroAlignment = 'Hero' | 'Anti-Hero' | 'Neutral';

export interface Hero {
  id: number;
  name: string;
  alias?: string;
  imageUrl: string;
  universe: HeroUniverse;
  alignment: HeroAlignment;
  powerLevel: number;
  speed: number;
  intelligence: number;
  createdAt: string;
  updatedAt: string;
}
