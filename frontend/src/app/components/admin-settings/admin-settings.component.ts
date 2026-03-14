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
    themeMode: 'dark',
    lightTheme: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentColor: '#22d3ee',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      backgroundType: 'solid',
      backgroundGradient: ''
    },
    darkTheme: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentColor: '#22d3ee',
      backgroundColor: '#0a0a0c',
      textColor: '#f8fafc',
      backgroundType: 'solid',
      backgroundGradient: ''
    }
  };

  constructor(
    private configService: ConfigService,
    private toast: ToastService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.configService.config$.subscribe(c => {
      if (c) {
        this.config = { ...c };
        // Ensure theme objects exist if coming from old DB
        if (!this.config.lightTheme) this.config.lightTheme = { ...this.config as any };
        if (!this.config.darkTheme) this.config.darkTheme = { ...this.config as any };
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
