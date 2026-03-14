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
    socialLinks: {
      linkedin: '',
      phone: '',
      email: '',
      cvUrl: ''
    },
    languages: []
  };

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => { if (p) this.profile = p; },
      error: () => this.toast.error('Error al cargar el perfil')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo imagen...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.profile.avatarUrl = res.url;
          this.toast.success('Imagen subida con éxito');
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
