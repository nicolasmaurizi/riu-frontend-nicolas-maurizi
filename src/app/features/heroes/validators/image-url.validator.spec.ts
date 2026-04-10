import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { imageUrlValidator } from './image-url.validator';

describe('imageUrlValidator', () => {
  const validator = imageUrlValidator();

  it('should accept a direct image url with extension', () => {
    const control = new FormControl('https://site.com/image.jpg');

    expect(validator(control)).toBeNull();
  });

  it('should accept a cdn image url with extension', () => {
    const control = new FormControl('https://cdn.site.com/heroes/batman.webp');

    expect(validator(control)).toBeNull();
  });

  it('should accept an image-like api url without extension', () => {
    const control = new FormControl('https://images.example.com/photo?id=123');

    expect(validator(control)).toBeNull();
  });

  it('should reject a plain text value', () => {
    const control = new FormControl('hola');

    expect(validator(control)).toEqual({ imageUrlInvalid: true });
  });

  it('should reject a non-url token', () => {
    const control = new FormControl('batman');

    expect(validator(control)).toEqual({ imageUrlInvalid: true });
  });

  it('should reject a numeric string', () => {
    const control = new FormControl('12345');

    expect(validator(control)).toEqual({ imageUrlInvalid: true });
  });

  it('should reject non-http protocols', () => {
    const control = new FormControl('ftp://site.com/file.jpg');

    expect(validator(control)).toEqual({ imageUrlInvalid: true });
  });

  it('should allow an empty value so required validation can stay independent', () => {
    const control = new FormControl('');

    expect(validator(control)).toBeNull();
  });
});
