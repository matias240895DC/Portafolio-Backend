import { isDevMode } from '@angular/core';

export const API_CONFIG = {
  // Use absolute URL for production, relative for local dev (which uses proxy.conf.json)
  get baseUrl(): string {
    return isDevMode() ? '/api' : 'https://portafolio-backend-m77h.onrender.com/api';
  }
};
