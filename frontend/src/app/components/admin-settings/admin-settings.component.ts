import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService, SiteConfig } from '../../services/config.service';
import { ToastService } from '../../services/toast.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  config: SiteConfig = {
    logoText: '',
    logoUrl: '',
    heroTitle1: '',
    heroTitle2: '',
    heroDescription: '',
    consoleTitleExperience: 'Experiencia Laboral',
    consoleTitleEducation: 'Formación Académica',
    consoleTitleStacksCentral: 'TECNOLOGÍAS CENTRALES',
    consoleTitleStacksSoft: 'COMPETENCIAS ESTRATÉGICAS',
    consoleTitleTerminal: 'TERMINAL_ARQUITECTÓNICA',
    consoleTitleTab1: 'SISTEMA',
    consoleTitleTab2: 'HISTORIAL',
    consoleTitleTab3: 'TECNOLOGÍAS',
    consoleTitleTab4: 'PROYECTOS',
    consoleTitleTab5: 'FEEDBACK',
    projectTitleAnalysis: 'ANÁLISIS TÉCNICO',
    projectTitleStack: 'ARQUITECTURA & STACK',
    projectTitleLinks: 'ENLACES DEL PROYECTO',
    projectTitleActions: 'COMANDO & CONTROL',
    projectLabelChallenge: 'DESAFÍO',
    projectLabelSolution: 'SOLUCIÓN',
    projectLabelImpact: 'IMPACTO',
    themeMode: 'dark',
    lightTheme: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentColor: '#22d3ee',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      backgroundType: 'solid',
      backgroundGradient: '',
      blueprintLinesEnabled: true,
      tiltEffectEnabled: true,
      codeShadowEnabled: true,
      blueprintOpacity: 0.1,
      consoleCardBg: 'rgba(255, 255, 255, 0.03)',
      consoleCardBorder: 'rgba(255, 255, 255, 0.1)',
      successColor: '#10b981',
      errorColor: '#ef4444',
      warningColor: '#fbbf24'
    },
    darkTheme: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentColor: '#22d3ee',
      backgroundColor: '#0a0a0c',
      textColor: '#f8fafc',
      backgroundType: 'solid',
      backgroundGradient: '',
      blueprintLinesEnabled: true,
      tiltEffectEnabled: true,
      codeShadowEnabled: true,
      blueprintOpacity: 0.1,
      consoleCardBg: 'rgba(255, 255, 255, 0.03)',
      consoleCardBorder: 'rgba(255, 255, 255, 0.1)',
      successColor: '#10b981',
      errorColor: '#ef4444',
      warningColor: '#fbbf24'
    }
  };

  // Tab State Logic
  activeTab: 'brand' | 'hero' | 'appearance' = 'brand';
  activeSubTab: 'colors' | 'signature' | 'labels' = 'colors';

  constructor(
    private configService: ConfigService,
    private toast: ToastService,
    private dataService: DataService
  ) {}

  switchTab(tab: 'brand' | 'hero' | 'appearance'): void {
      this.activeTab = tab;
  }

  switchSubTab(tab: 'colors' | 'signature' | 'labels'): void {
      this.activeSubTab = tab;
  }

  ngOnInit() {
    this.configService.config$.subscribe(c => {
      if (c) {
        this.config = {
          ...this.config,
          ...c,
          lightTheme: { ...this.config.lightTheme, ...(c.lightTheme || {}) },
          darkTheme: { ...this.config.darkTheme, ...(c.darkTheme || {}) }
        };
      }
    });
  }

  get activeTheme() {
    return this.config.themeMode === 'light' ? this.config.lightTheme : this.config.darkTheme;
  }


  onLogoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.config.logoUrl = res.url;
          this.toast.success('Logo subido correctamente');
        },
        error: (err) => this.toast.error('Error al subir el logo')
      });
    }
  }

  removeLogo() {
    this.config.logoUrl = '';
    this.configService.updateConfig({ logoUrl: '' }).subscribe({
      next: () => this.toast.success('Logo eliminado correctamente'),
      error: () => this.toast.error('Error al eliminar el logo')
    });
  }

  saveConfig() {
    this.configService.updateConfig(this.config).subscribe({
      next: () => this.toast.success('Configuración guardada correctamente'),
      error: (err) => this.toast.error('Error al guardar configuración')
    });
  }

  resetToDefault() {
    if (confirm('¿Estás seguro de resetear a los valores por defecto?')) {
        // Implementation for reset if backend supports it, or just local defaults
    }
  }
}
