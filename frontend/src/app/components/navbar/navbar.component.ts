import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { API_CONFIG } from '../../config/api.config';


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
  private currentConfig: any = null;
  private cursorOverlayEl: HTMLDivElement | null = null;
  private cursorOverlayImgEl: HTMLImageElement | null = null;
  private interactiveSelector = 'a,button,[role="button"],input[type="button"],input[type="submit"],input[type="reset"],summary,.tab-btn,.glow-btn,.ghost-btn,.menu-toggle,.action-btn';
  private onMouseMoveHandler = (event: MouseEvent) => this.handleMouseMove(event);
  private onWindowBlurHandler = () => this.setCursorVisible(false);

  constructor(
    public auth: AuthService,
    public configService: ConfigService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.applyCustomHoverCursor();
      },
      error: (err) => console.error('Error loading profile in navbar', err)
    });

    this.configService.config$.subscribe((cfg) => {
      this.currentConfig = cfg;
      this.applyCustomHoverCursor();
    });

    this.initCursorOverlay();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  downloadCV() {
    if (this.profile?.socialLinks?.cvUrl) {
      let downloadUrl = this.profile.socialLinks.cvUrl;
      
      // If it's a backend API route (MongoDB PDF storage)
      if (downloadUrl.startsWith('/api')) {
        const backendHost = API_CONFIG.baseUrl.replace(/\/api$/, '');
        downloadUrl = backendHost + downloadUrl;
      } 
      // Ensure absolute URL for external links
      else if (!downloadUrl.startsWith('http')) {
        downloadUrl = 'https://' + downloadUrl;
      }
      
      // Force download for Cloudinary URLs using path variable
      if (downloadUrl.includes('res.cloudinary.com') && downloadUrl.includes('/upload/') && !downloadUrl.includes('fl_attachment')) {
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
      }
      
      window.open(downloadUrl, '_blank');
    }
  }

  private getCursorLogoUrl(): string {
    const lightUrl = this.profile?.orbitImageLightUrl || '';
    const darkUrl = this.profile?.orbitImageDarkUrl || '';
    const avatarUrl = this.profile?.avatarUrl || '';
    const configLogoUrl = this.currentConfig?.logoUrl || '';

    // Read active mode from current config first, then body class as runtime fallback.
    const activeMode: 'light' | 'dark' =
      this.currentConfig?.themeMode === 'light' || this.currentConfig?.themeMode === 'dark'
        ? this.currentConfig.themeMode
        : (document.body.classList.contains('light-mode') ? 'light' : 'dark');
    const isLightMode = activeMode === 'light';

    return isLightMode
      ? (lightUrl || darkUrl || configLogoUrl || avatarUrl)
      : (darkUrl || lightUrl || configLogoUrl || avatarUrl);
  }

  private applyCustomHoverCursor(): void {
    const cursorLogo = this.getCursorLogoUrl();
    const fallbackCursorDataUri =
      "url(\"data:image/svg+xml;utf8," +
      encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>" +
        "<path d='M6 4 L6 52 L20 39 L30 59 L38 55 L28 35 L48 35 Z' fill='%230f172a' stroke='%2322d3ee' stroke-width='3' stroke-linejoin='round'/>" +
        "<path d='M10 10 L10 44 L20 35 L29 52 L34 49 L25 31 L41 31 Z' fill='%23ffffff' opacity='0.95'/>" +
        "<text x='35' y='17' fill='%2322d3ee' font-size='9' font-family='Arial' font-weight='700'>BK</text>" +
        "</svg>"
      ) +
      "\") 5 3";

    if (cursorLogo) {
      if (this.cursorOverlayImgEl) {
        this.cursorOverlayImgEl.src = cursorLogo;
      }
      document.documentElement.style.setProperty('--custom-hover-cursor', `url("${cursorLogo}") 8 8`);
      return;
    }

    if (this.cursorOverlayImgEl) {
      this.cursorOverlayImgEl.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='44' viewBox='0 0 96 44'>" +
            "<path d='M3 2 L3 31 L11 24 L17 40 L22 38 L16 22 L30 22 Z' fill='%230f172a' stroke='%2322d3ee' stroke-width='2' stroke-linejoin='round'/>" +
            "<path d='M5 6 L5 27 L11 22 L16 35 L19 33 L14 20 L25 20 Z' fill='%23ffffff' opacity='0.96'/>" +
            "<text x='33' y='24' fill='%2322d3ee' font-size='14' font-family='Arial' font-weight='700'>BACKEND</text>" +
          "</svg>"
        );
    }

    document.documentElement.style.setProperty('--custom-hover-cursor', fallbackCursorDataUri);
  }

  private initCursorOverlay(): void {
    if (this.cursorOverlayEl) return;

    const overlay = document.createElement('div');
    overlay.className = 'custom-cursor-overlay';

    const img = document.createElement('img');
    img.alt = 'Custom cursor';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    this.cursorOverlayEl = overlay;
    this.cursorOverlayImgEl = img;
    this.applyCustomHoverCursor();

    document.addEventListener('mousemove', this.onMouseMoveHandler);
    window.addEventListener('blur', this.onWindowBlurHandler);
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.cursorOverlayEl) return;

    // Compensate internal transparent margins from the cursor image
    this.cursorOverlayEl.style.transform = `translate3d(${event.clientX - 28}px, ${event.clientY - 18}px, 0)`;
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    const isInteractive = !!hoveredElement?.closest(this.interactiveSelector);
    this.setCursorVisible(isInteractive);
  }

  private setCursorVisible(visible: boolean): void {
    if (!this.cursorOverlayEl) return;
    this.cursorOverlayEl.classList.toggle('visible', visible);
  }
}
