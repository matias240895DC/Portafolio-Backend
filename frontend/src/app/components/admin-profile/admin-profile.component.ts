import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profile: any = {
    about: '',
    yearsOfExperience: 0,
    avatarUrl: '',
    orbitImageLightUrl: '',
    orbitImageDarkUrl: '',
    socialLinks: {
      linkedin: '',
      phone: '',
      email: '',
      cvUrl: ''
    },
    languages: [],
    experience: [],
    education: []
  };

  // State to manage which tab is currently active
  activeTab: 'bio' | 'contact' | 'stats' = 'bio';

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  switchTab(tabToken: 'bio' | 'contact' | 'stats'): void {
    this.activeTab = tabToken;
  }

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => { if (p) this.profile = p; },
      error: () => this.toast.error('Error al cargar el perfil')
    });
  }

  onFileSelected(event: any) {
    this.uploadImageToProfileField(event, 'avatarUrl', 'imagen');
  }

  onOrbitImageSelected(event: any, mode: 'light' | 'dark') {
    const targetField = mode === 'light' ? 'orbitImageLightUrl' : 'orbitImageDarkUrl';
    const targetLabel = mode === 'light' ? 'imagen de modo claro' : 'imagen de modo oscuro';
    this.uploadImageToProfileField(event, targetField, targetLabel);
  }

  private uploadImageToProfileField(event: any, field: string, label: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo imagen...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.profile[field] = res.url;
          this.toast.success(`${label} subida con éxito`);
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error al subir la imagen');
        }
      });
    }
  }

  onLanguageIconSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo icono...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.profile.languages[index].icon = res.url;
          this.toast.success('Icono subido');
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error al subir icono');
        }
      });
    }
  }

  onCvSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo CV...');
      this.dataService.uploadPdf(file).subscribe({
        next: (res) => {
          this.profile.socialLinks.cvUrl = res.url;
          this.toast.success('CV subido con éxito');
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error al subir el CV');
        }
      });
    }
  }

  saveProfile() {
    const { _id, __v, ...cleanProfile } = this.profile;
    this.dataService.updateProfile(cleanProfile).subscribe({
      next: () => this.toast.success('Perfil actualizado con éxito'),
      error: (err) => {
        console.error(err);
        this.toast.error('Error al actualizar el perfil');
      }
    });
  }

  addLanguage() {
    if (!this.profile.languages) {
      this.profile.languages = [];
    }
    this.profile.languages.push({ name: '', level: '', icon: '' });
  }

  removeLanguage(index: number) {
    this.profile.languages.splice(index, 1);
  }
}
