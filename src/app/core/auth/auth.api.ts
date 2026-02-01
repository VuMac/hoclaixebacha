import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LoginResponse = { accessToken: string; role: string };

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private base = `${environment.apiBaseUrl}/api/auth`;

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${this.base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(t || 'Sai tài khoản hoặc mật khẩu');
    }
    return res.json();
  }
}
