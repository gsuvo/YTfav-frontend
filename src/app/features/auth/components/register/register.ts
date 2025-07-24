import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment.prod';
import { RecaptchaModule } from 'ng-recaptcha-2';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RecaptchaModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  recaptchaSiteKey = environment.RECAPTCHA_SITE_KEY;
  recaptchaToken: string | null = null;
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }
  onRecaptchaResolved(token: string | null) {
    this.recaptchaToken = token;
    this.cdr.markForCheck();
  }
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  get passwordValue(): string {
    return this.form.get('password')?.value || '';
  }
  get confirmPasswordValue(): string {
    return this.form.get('confirmPassword')?.value || '';
  }
  get passwordMinLength(): boolean {
    return this.passwordValue.length >= 6;
  }
  get passwordHasUpper(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }
  get passwordHasLower(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }
  get passwordHasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }
  get passwordsMatch(): boolean {
    return !!this.passwordValue && !!this.confirmPasswordValue && this.passwordValue === this.confirmPasswordValue;
  }

  submit() {
    if (this.form.invalid) {
      if (this.form.errors?.['passwordMismatch']) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
      }
      return;
    }
    // Obtener el token del widget clásico
    let token = null;
    try {
      token = window['grecaptcha']?.getResponse();
    } catch {}
    if (!token) {
      this.snackBar.open('Completa el reCAPTCHA', 'Cerrar', { duration: 3000 });
      return;
    }
    this.recaptchaToken = token;
    this.loading = true;
    // Registro y login automático para mostrar el usuario en el header
    const { username, email, password } = this.form.value;
    this.auth.register({ username, email, password, recaptchaToken: this.recaptchaToken })
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          // Login automático tras registro
          this.auth.login({ email, password }).subscribe({
            next: (res) => {
              this.auth.saveToken(res.token);
              this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
              this.router.navigate(['/videos']);
            },
            error: (err) => {
              this.snackBar.open('Error al iniciar sesión', 'Cerrar', { duration: 3000 });
              this.router.navigate(['/login']);
            }
          });
        },
        error: err => {
          this.snackBar.open(err.error?.message || 'Error en el registro', 'Cerrar', { duration: 3000 });
        }
      });
  }
}
