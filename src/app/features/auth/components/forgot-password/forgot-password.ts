import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email) {
      this.snackBar.open('Por favor ingresa tu email.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    this.loading = true;
    this.auth.recoverPassword(this.email).subscribe({
      next: () => {
        this.snackBar.open('Si el email está registrado, recibirás instrucciones para recuperar tu contraseña.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-success'] });
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.snackBar.open('No se pudo enviar el correo de recuperación.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        this.loading = false;
      }
    });
  }
}
