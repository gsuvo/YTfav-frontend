
import { Route } from "@angular/router";
import { Login } from "./components/login/login";
import { Register } from "./components/register/register";
import { ResetPassword } from "./components/reset-password/reset-password";
import { ForgotPassword } from "./components/forgot-password/forgot-password";
export const authRoutes: Route[] = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword }
];