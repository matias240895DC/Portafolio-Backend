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
  
  // Architectural Signature Controls
  blueprintLinesEnabled: boolean;
  tiltEffectEnabled: boolean;
  codeShadowEnabled: boolean;
  blueprintOpacity: number;
  consoleCardBg: string;
  consoleCardBorder: string;
  successColor: string;
  errorColor: string;
  warningColor: string;
}

export interface SiteConfig {
  logoText: string;
  logoUrl?: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  consoleTitleExperience: string;
  consoleTitleEducation: string;
  consoleTitleStacksCentral: string;
  consoleTitleStacksSoft: string;
  consoleTitleTerminal: string;
  consoleTitleTab1: string;
  consoleTitleTab2: string;
  consoleTitleTab3: string;
  consoleTitleTab4: string;
  consoleTitleTab5: string;
  
  // Project Dashboard Labels
  projectTitleAnalysis: string;
  projectTitleStack: string;
  projectTitleLinks: string;
  projectTitleActions: string;
  projectLabelChallenge: string;
  projectLabelSolution: string;
  projectLabelImpact: string;

  themeMode: 'light' | 'dark';
  lightTheme: ThemeSettings;
  darkTheme: ThemeSettings;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly THEME_MODE_KEY = 'themeMode';
  private configSubject = new BehaviorSubject<SiteConfig | null>(null);
  config$ = this.configSubject.asObservable();

  constructor(private dataService: DataService) {
    // Aplica el modo inmediatamente (incluso sin estar logueado / sin config cargada todavía)
    const stored = localStorage.getItem(this.THEME_MODE_KEY);
    const initialMode = stored === 'light' || stored === 'dark' ? stored : 'dark';
    this.applyModeOnly(initialMode);

    this.loadConfig();
  }

  loadConfig() {
    this.dataService.getConfig().subscribe({
      next: (config) => {
        // Si el usuario ya eligió un modo antes, respétalo.
        const stored = localStorage.getItem(this.THEME_MODE_KEY);
        const storedMode = stored === 'light' || stored === 'dark' ? stored : null;
        
        // Merge to handle new schema fields safely
        const merged = {
          ...config,
          themeMode: storedMode || config.themeMode || 'dark',
          lightTheme: { ...config.lightTheme },
          darkTheme: { ...config.darkTheme }
        };

        this.configSubject.next(merged);
        this.applyTheme(merged);
      },
      error: (err) => console.error('Error loading config', err)
    });
  }

  toggleMode() {
    const current = this.configSubject.value;
    if (!current) {
      const isDark = document.body.classList.contains('dark-mode');
      const nextMode: 'light' | 'dark' = isDark ? 'light' : 'dark';
      localStorage.setItem(this.THEME_MODE_KEY, nextMode);
      this.applyModeOnly(nextMode);
      return;
    }

    const newMode = current.themeMode === 'light' ? 'dark' : 'light';
    const updated = { ...current, themeMode: newMode as 'light' | 'dark' };
    
    localStorage.setItem(this.THEME_MODE_KEY, updated.themeMode);
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

    root.style.setProperty('--bp-opacity', activeTheme.blueprintLinesEnabled ? (activeTheme.blueprintOpacity || 0.1).toString() : '0');
    root.style.setProperty('--tilt-effect', activeTheme.tiltEffectEnabled ? 'translateZ(20px) rotateX(1deg) rotateY(-1deg)' : 'none');
    root.style.setProperty('--shadow-opacity', activeTheme.codeShadowEnabled ? '0.15' : '0');

    // Granular Console Colors
    root.style.setProperty('--panel-bg', activeTheme.consoleCardBg || 'rgba(255, 255, 255, 0.03)');
    root.style.setProperty('--glass-stroke', activeTheme.consoleCardBorder || 'rgba(255, 255, 255, 0.1)');

    // New Dynamic Variables
    root.style.setProperty('--success', activeTheme.successColor || '#10b981');
    root.style.setProperty('--error', activeTheme.errorColor || '#ef4444');
    root.style.setProperty('--warning', activeTheme.warningColor || '#fbbf24');
    
    // Soft variants (15% opacity)
    root.style.setProperty('--primary-soft', activeTheme.primaryColor + '26'); 
    root.style.setProperty('--accent-soft', activeTheme.accentColor + '26');

    this.applyModeOnly(config.themeMode, root);
  }

  get themeMode(): 'light' | 'dark' {
    const stored = localStorage.getItem(this.THEME_MODE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    const cfg = this.configSubject.value;
    return cfg?.themeMode || 'dark';
  }

  private applyModeOnly(mode: 'light' | 'dark', root: HTMLElement = document.documentElement) {
    if (mode === 'light') {
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
