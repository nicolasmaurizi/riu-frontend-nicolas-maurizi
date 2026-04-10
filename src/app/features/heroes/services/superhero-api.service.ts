import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { concatMap, dematerialize, map, materialize, shareReplay } from 'rxjs/operators';

interface SuperheroApiImageSet {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
}

interface SuperheroApiHero {
  name: string;
  images?: SuperheroApiImageSet;
}

@Injectable({
  providedIn: 'root',
})
export class SuperheroApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';
  private readonly minimumResponseMs = 500;

  // Cache the catalog because the API is static and shared across searches.
  private readonly allHeroes$ = this.httpClient.get<SuperheroApiHero[]>(this.apiUrl).pipe(shareReplay(1));

  searchHeroImageByName(name: string): Observable<string | null> {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return of(null);
    }

    return this.allHeroes$.pipe(
      map((heroes) => {
        const exactMatch = heroes.find((hero) => this.normalizeName(hero.name) === normalizedName);
        const partialMatch =
          exactMatch ??
          heroes.find((hero) => this.normalizeName(hero.name).includes(normalizedName));

        return partialMatch ? this.getPreferredImage(partialMatch.images) : null;
      }),
      this.withMinimumResponseTime(),
    );
  }

  private normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }

  private getPreferredImage(images?: SuperheroApiImageSet): string | null {
    return images?.md ?? images?.sm ?? images?.lg ?? images?.xs ?? null;
  }

  private withMinimumResponseTime<T>() {
    return (source: Observable<T>): Observable<T> => {
      const startedAt = Date.now();

      return source.pipe(
        materialize(),
        concatMap((notification) =>
          timer(Math.max(0, this.minimumResponseMs - (Date.now() - startedAt))).pipe(
            map(() => notification),
          ),
        ),
        dematerialize(),
      );
    };
  }
}
