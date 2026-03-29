export const API_CONFIG = {
  // Use absolute URL for production, relative for local dev (which uses proxy.conf.json)
  get baseUrl(): string {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? '/api' : 'https://portafolio-backend-m77h.onrender.com/api';
  }
};
