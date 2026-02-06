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
    if (this.loading) return; // tránh spam click
    this.error = '';

    const u = (this.username || '').trim();
    const p = this.password || '';

    // validate cơ bản
    if (!u || !p) {
      this.error = 'Vui lòng nhập tài khoản và mật khẩu.';
      return;
    }

    try {
      this.loading = true;

      const res = await this.authApi.login(u, p);

      // ✅ lưu session
      this.authStore.setSession(res.accessToken, res.role);

      // ✅ điều hướng về trang admin registrations cho tiện test
      // (bạn muốn về news/new thì đổi lại)
      await this.router.navigateByUrl('/admin/registrations');
      // await this.router.navigateByUrl('/admin/news/new');
    } catch (e: any) {
      this.error = e?.message || 'Đăng nhập thất bại';
    } finally {
      this.loading = false;
    }
  }
}
