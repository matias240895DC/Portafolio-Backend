import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProjectGalleryComponent } from './components/project-gallery/project-gallery.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AuthGuard } from './guards/auth.guard';

import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminStacksComponent } from './components/admin-stacks/admin-stacks.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';

import { AdminSoftSkillsComponent } from './components/admin-soft-skills/admin-soft-skills.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';

import { AdminTestimonialsComponent } from './components/admin-testimonials/admin-testimonials.component';
import { AdminMessagesComponent } from './components/admin-messages/admin-messages.component';
import { AdminCommentsComponent } from './components/admin-comments/admin-comments.component';
import { AdminIconsComponent } from './components/admin-icons/admin-icons.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectGalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: AdminProjectsComponent },
      { path: 'stacks', component: AdminStacksComponent },
      { path: 'soft-skills', component: AdminSoftSkillsComponent },
      { path: 'testimonials', component: AdminTestimonialsComponent },
      { path: 'messages', component: AdminMessagesComponent },
      { path: 'comments', component: AdminCommentsComponent },
      { path: 'icons', component: AdminIconsComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'settings', component: AdminSettingsComponent }

    ]
  },
  { path: '**', redirectTo: '' }
];
