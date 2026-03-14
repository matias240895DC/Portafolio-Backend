import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  projectsCount = 0;
  pendingTestimonials = 0;
  contactCount = 0;
  isSidebarOpen = false;

  constructor(
    private dataService: DataService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.getProjects().subscribe(p => this.projectsCount = p.length);
    this.dataService.adminGetTestimonials().subscribe(t => {
      this.pendingTestimonials = t.filter(x => !x.approved).length;
    });
    this.dataService.getMessages().subscribe(m => {
      this.contactCount = m.filter(x => !x.read).length;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  isDashboardHome(): boolean {
    return this.router.url === '/admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
