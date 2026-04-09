import { HeroUniverse } from './hero.model';

export interface HeroFormValue {
  name: string;
  alias?: string;
  imageUrl: string;
  universe: HeroUniverse;
  powerLevel: number | null;
  speed: number | null;
  intelligence: number | null;
}