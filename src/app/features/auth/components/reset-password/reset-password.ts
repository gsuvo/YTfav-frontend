import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  password = '';
  confirmPassword = '';
  loading = false;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  get passwordMinLength(): boolean {
    return this.password.length >= 6;
  }
  get passwordHasUpper(): boolean {
    return /[A-Z]/.test(this.password);
  }
  get passwordHasLower(): boolean {
    return /[a-z]/.test(this.password);
  }
  get passwordHasNumber(): boolean {
    return /\d/.test(this.password);
  }
  get passwordsMatch(): boolean {
    return !!this.password && !!this.confirmPassword && this.password === this.confirmPassword;
  }


  onReset() {
    if (!this.passwordMinLength) {
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    if (!this.passwordHasUpper) {
      this.snackBar.open('La contraseña debe tener al menos una mayúscula.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    if (!this.passwordHasLower) {
      this.snackBar.open('La contraseña debe tener al menos una minúscula.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    if (!this.passwordHasNumber) {
      this.snackBar.open('La contraseña debe tener al menos un número.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    if (!this.passwordsMatch) {
      this.snackBar.open('Las contraseñas no coinciden.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    this.loading = true;
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada correctamente.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.message || 'No se pudo actualizar la contraseña.';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
