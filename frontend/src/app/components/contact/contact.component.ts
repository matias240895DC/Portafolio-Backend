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
    
    this.dataService.sendMessage(this.form).subscribe({
      next: () => {
        this.successMsg = 'Mensaje enviado con éxito.';
        this.submitting = false;
        this.resetForm();
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

  downloadCV() {
    if (this.profile?.socialLinks?.cvUrl) {
      window.open(this.profile.socialLinks.cvUrl, '_blank');
    }
  }
}
