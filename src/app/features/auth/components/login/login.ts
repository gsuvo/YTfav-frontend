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
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.snackBar.open('¡Login exitoso!', 'Cerrar', { duration: 2500, panelClass: ['snackbar-success'] });
        this.router.navigate(['/']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al iniciar sesión';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }
}
