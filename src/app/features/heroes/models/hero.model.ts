export type HeroUniverse = 'Marvel' | 'DC' | 'Otro';

export interface Hero {
  id: number;
  name: string;
  alias?: string;
  imageUrl: string;
  universe: HeroUniverse;
  powerLevel: number;
  speed: number;
  intelligence: number;
  createdAt: string;
  updatedAt: string;
}