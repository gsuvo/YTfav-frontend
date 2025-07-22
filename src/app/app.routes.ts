import { Route, Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { videosRoutes } from './features/videos/video.routes';
import { favoritesRoutes } from './features/favorites/favorites.routes';

export const appRoutes: Route[] = [
  ...authRoutes,
  { path: '', redirectTo: 'videos', pathMatch: 'full' },
  ...videosRoutes,
  ...favoritesRoutes,
  { path: '**', redirectTo: 'videos' }
];