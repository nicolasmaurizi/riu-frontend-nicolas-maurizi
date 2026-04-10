import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const IMAGE_EXTENSION_PATTERN = /\.(jpg|jpeg|png|webp|gif|svg)$/i;
const IMAGE_HINT_PATTERN = /(image|images|img|photo|photos|avatar|media|cdn|cloudinary|unsplash|hero)/i;

export function imageUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;

    if (typeof rawValue !== 'string') {
      return { imageUrlInvalid: true };
    }

    const value = rawValue.trim();

    if (!value) {
      return null;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      return { imageUrlInvalid: true };
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { imageUrlInvalid: true };
    }

    const pathname = parsedUrl.pathname.toLowerCase();

    if (IMAGE_EXTENSION_PATTERN.test(pathname)) {
      return null;
    }

    const imageLikeParts = [
      parsedUrl.hostname,
      parsedUrl.pathname,
      parsedUrl.search,
      parsedUrl.hash,
    ].join(' ');

    return IMAGE_HINT_PATTERN.test(imageLikeParts) ? null : { imageUrlInvalid: true };
  };
}
