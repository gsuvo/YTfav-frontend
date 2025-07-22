import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  goToVideos() {
    this.router.navigate(['/videos']);
  }
  user = signal<any>(null);
  isLoggedIn = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user.set(user);
      this.isLoggedIn.set(!!user);
    });
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn.set(false);
    window.location.reload();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }
}
