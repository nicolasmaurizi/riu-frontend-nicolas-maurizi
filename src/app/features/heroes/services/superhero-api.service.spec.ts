import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { SuperheroApiService } from './superhero-api.service';

describe('SuperheroApiService', () => {
  let service: SuperheroApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SuperheroApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should return image url when a hero is found', async () => {
    const resultPromise = firstValueFrom(service.searchHeroImageByName('Batman'));

    const request = httpTestingController.expectOne(
      'https://akabab.github.io/superhero-api/api/all.json',
    );
    request.flush([
      {
        name: 'Batman',
        images: {
          md: 'https://example.com/batman-md.webp',
        },
      },
    ]);

    await expect(resultPromise).resolves.toBe('https://example.com/batman-md.webp');
  });

  it('should return null when no hero is found', async () => {
    const resultPromise = firstValueFrom(service.searchHeroImageByName('Unknown Hero'));

    const request = httpTestingController.expectOne(
      'https://akabab.github.io/superhero-api/api/all.json',
    );
    request.flush([
      {
        name: 'Batman',
        images: {
          md: 'https://example.com/batman-md.webp',
        },
      },
    ]);

    await expect(resultPromise).resolves.toBeNull();
  });
});
