import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS, JwtModuleOptions } from '@auth0/angular-jwt';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';
import { provideHttpClient, withFetch } from '@angular/common/http';
export function jwtOptionsFactory(): JwtModuleOptions {
  return{
    tokenGetter: () => localStorage.getItem('access_token'),
    alloedDomains: ['localhost:3000'],
    disallowedRoutes:[]
  }as JwtModuleOptions;
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes), 
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    ),
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: process.env['RECAPTCHA_SITE_KEY'] || ''},
    RecaptchaV3Module,
  ]
};
