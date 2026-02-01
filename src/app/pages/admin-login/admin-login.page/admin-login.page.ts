import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '../../../core/auth/auth.api';
import { AuthStore } from '../../../core/auth/auth.store';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.css'],
})
export class AdminLoginPage {
  username = 'admin';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authApi: AuthApi,
    private authStore: AuthStore,
    private router: Router
  ) {}

  async submit() {
    this.error = '';
    try {
      this.loading = true;
      const res = await this.authApi.login(this.username.trim(), this.password);
      this.authStore.setSession(res.accessToken, res.role);
      await this.router.navigateByUrl('/admin-news-create');
    } catch (e: any) {
      this.error = e?.message || 'Đăng nhập thất bại';
    } finally {
      this.loading = false;
    }
  }
}
