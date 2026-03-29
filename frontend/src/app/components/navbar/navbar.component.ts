import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  profile: any = null;

  constructor(
    public auth: AuthService,
    public configService: ConfigService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => this.profile = p,
      error: (err) => console.error('Error loading profile in navbar', err)
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  downloadCV() {
    if (this.profile?.socialLinks?.cvUrl) {
      const url = this.profile.socialLinks.cvUrl;
      let downloadUrl = url;
      
      // If it's a legacy Cloudinary URL, append fl_attachment to force download
      if (url.includes('cloudinary.com')) {
        const separator = url.includes('?') ? '&' : '?';
        downloadUrl = `${url}${separator}fl_attachment=true`;
      }
      
      window.open(downloadUrl, '_blank');
    }
  }
}
