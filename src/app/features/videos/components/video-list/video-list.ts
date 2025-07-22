import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/production/environment';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const apiKey = environment.YOUTUBE_API_KEY;

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    SafeUrlPipe,
    MatSnackBarModule
  ],
  templateUrl: './video-list.html',
  styleUrl: './video-list.scss'
})
export class VideoList {
  query = '';
  videos = signal<any[]>([]);
  private readonly API_KEY = apiKey;
  private querySubject = new Subject<string>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.querySubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(q => {
      this.search(q);
    });
  }

  onQueryChange(q: string) {
    this.query = q;
    this.querySubject.next(q);
  }

  search(q: string) {
    if (!q.trim()) {
      this.videos.set([]);
      return;
    }
    this.http.get<any>(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: this.API_KEY,
        q,
        part: 'snippet',
        maxResults: '10',
        type: 'video'
      }
    }).subscribe(res => {
      const items = res.items.map((item: any) => ({
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId
      }));
      this.videos.set(items);
    });
  }
  addToFavorites(video: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.snackBar.open('Por favor inicia sesión para guardar favoritos.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    this.http.post('http://localhost:3000/favorites', video, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.snackBar.open('¡Video guardado como favorito!', 'Cerrar', { duration: 2500, panelClass: ['snackbar-success'] });
      },
      error: (err) => {
        const msg = err.error?.message === 'Video already in favorites'
          ? 'Este video ya está en tu lista de favoritos.'
          : 'No se pudo guardar el favorito.';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  getInputValue(event: Event): string {
    return event && event.target && (event.target as HTMLInputElement).value || '';
  }
}
