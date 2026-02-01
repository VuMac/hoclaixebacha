import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../auth/auth.store';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthStore, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAdmin) return true;
    this.router.navigateByUrl('/admin/login');
    return false;
  }
}
