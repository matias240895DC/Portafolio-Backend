import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { DataService } from './data.service';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  backgroundType: 'solid' | 'gradient';
  backgroundGradient?: string;
}

export interface SiteConfig {
  logoText: string;
  logoUrl?: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  themeMode: 'light' | 'dark';
  lightTheme: ThemeSettings;
  darkTheme: ThemeSettings;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<SiteConfig | null>(null);
  config$ = this.configSubject.asObservable();

  constructor(private dataService: DataService) {
    this.loadConfig();
  }

  loadConfig() {
    this.dataService.getConfig().subscribe({
      next: (config) => {
        this.configSubject.next(config);
        this.applyTheme(config);
      },
      error: (err) => console.error('Error loading config', err)
    });
  }

  toggleMode() {
    const current = this.configSubject.value;
    if (!current) return;

    const newMode = current.themeMode === 'light' ? 'dark' : 'light';
    const updated = { ...current, themeMode: newMode as 'light' | 'dark' };
    
    this.configSubject.next(updated);
    this.applyTheme(updated);
  }

  updateConfig(config: Partial<SiteConfig>) {
    return this.dataService.updateConfig(config).pipe(
      tap((updatedConfig) => {
        this.configSubject.next(updatedConfig);
        this.applyTheme(updatedConfig);
      })
    );
  }

  private applyTheme(config: SiteConfig) {
    const root = document.documentElement;
    const activeTheme = config.themeMode === 'light' ? config.lightTheme : config.darkTheme;
    
    if (!activeTheme) return;

    // Apply Colors
    root.style.setProperty('--primary', activeTheme.primaryColor);
    root.style.setProperty('--primary-glow', activeTheme.primaryColor + '4d'); // 30% alpha
    root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${activeTheme.primaryColor}, ${activeTheme.secondaryColor})`);
    root.style.setProperty('--secondary', activeTheme.secondaryColor);
    root.style.setProperty('--accent', activeTheme.accentColor);
    root.style.setProperty('--text-main', activeTheme.textColor);
    root.style.setProperty('--text-dim', activeTheme.textColor + 'b3'); // 70% alpha
    
    if (activeTheme.backgroundType === 'solid') {
      root.style.setProperty('--bg-color', activeTheme.backgroundColor);
      root.style.setProperty('--bg-gradient', 'none');
    } else {
      root.style.setProperty('--bg-gradient', activeTheme.backgroundGradient || '');
      root.style.setProperty('--bg-color', 'transparent'); 
    }

    // Dynamic glass/panel colors based on mode
    if (config.themeMode === 'light') {
      root.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-stroke', 'rgba(0, 0, 0, 0.08)');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      root.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--glass-stroke', 'rgba(255, 255, 255, 0.1)');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }


}
