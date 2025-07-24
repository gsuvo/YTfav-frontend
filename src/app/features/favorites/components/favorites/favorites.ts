import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, FormsModule, SafeUrlPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  getInputValue(event: Event): string {
    return event && event.target && (event.target as HTMLInputElement).value || '';
  }
  favorites = signal<any[]>([]);
  filteredFavorites = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.loading.set(false);
      return;
    }
    this.http.get<any[]>('https://y-tfav-backend.vercel.app/api/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: favs => {
        this.favorites.set(favs);
        this.filteredFavorites.set(favs);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearchChange(q: string) {
    this.searchQuery = q;
    const queryLower = q.trim().toLowerCase();
    if (!queryLower) {
      this.filteredFavorites.set(this.favorites());
      return;
    }
    this.filteredFavorites.set(
      this.favorites().filter(f => f.title.toLowerCase().includes(queryLower))
    );
  }
  
  removeFavorite(videoId: string) {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.http.delete(`https://y-tfav-backend.vercel.app/api/favorites/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        const updated = this.favorites().filter(f => f.videoId !== videoId);
        this.favorites.set(updated);
        this.onSearchChange(this.searchQuery);
        this.snackBar.open('Video eliminado de favoritos', 'Cerrar', {
          duration: 2500,
          panelClass: ['snackbar-success']
        });
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar el video', 'Cerrar', {
          duration: 2500,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
