import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  form = {
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 0
  };
  submitting = false;
  successMsg = '';
  profile: any = null;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => this.profile = p,
      error: (err) => console.error('Error loading profile in feedback', err)
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitting = true;
    
    this.dataService.submitTestimonial(this.form).subscribe({
      next: () => {
        this.successMsg = '¡Gracias! Tu feedback será revisado por el administrador.';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: () => {
        this.successMsg = 'Ocurrió un error. Intenta nuevamente.';
        this.submitting = false;
      }
    });
  }
}
