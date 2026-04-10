import {
  HttpClient,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should activate and deactivate loading around a request', () => {
    expect(loadingService.isLoading()).toBe(false);

    let completed = false;

    httpClient.get('/heroes').subscribe({
      complete: () => {
        completed = true;
      },
    });

    expect(loadingService.isLoading()).toBe(true);

    const request = httpTestingController.expectOne('/heroes');
    request.flush([]);

    expect(completed).toBe(true);
    expect(loadingService.isLoading()).toBe(false);
  });
});
