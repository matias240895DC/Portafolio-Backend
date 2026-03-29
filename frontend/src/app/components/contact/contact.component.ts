import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  form = {
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 5
  };
  submitting = false;
  successMsg = '';
  private successMsgTimeout: ReturnType<typeof setTimeout> | null = null;
  profile: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => this.profile = p,
      error: (err) => console.error('Error loading profile in contact', err)
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitting = true;
    this.successMsg = '';
    this.clearSuccessTimeout();
    
    this.dataService.sendMessage(this.form).subscribe({
      next: () => {
        this.successMsg = 'Mensaje enviado con éxito.';
        this.submitting = false;
        this.resetForm();
        this.successMsgTimeout = setTimeout(() => {
          this.successMsg = '';
          this.successMsgTimeout = null;
        }, 4000);
      },
      error: () => {
        this.successMsg = 'Ocurrió un error. Intenta nuevamente.';
        this.submitting = false;
      }
    });
  }

  resetForm() {
    this.form = { name: '', email: '', company: '', message: '', rating: 5 };
  }

  private clearSuccessTimeout() {
    if (!this.successMsgTimeout) return;
    clearTimeout(this.successMsgTimeout);
    this.successMsgTimeout = null;
  }

  downloadCV() {
    if (this.profile?.socialLinks?.cvUrl) {
      let downloadUrl = this.profile.socialLinks.cvUrl;
      
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = 'https://' + downloadUrl;
      }
      
      // Force download for Cloudinary URLs using path variable
      if (downloadUrl.includes('res.cloudinary.com') && downloadUrl.includes('/upload/') && !downloadUrl.includes('fl_attachment')) {
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
      }
      
      window.open(downloadUrl, '_blank');
    }
  }
}
