import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private TOKEN = 'accessToken';
  private ROLE = 'role';

  setSession(token: string, role: string) {
    localStorage.setItem(this.TOKEN, token);
    localStorage.setItem(this.ROLE, role);
  }

  clear() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.ROLE);
  }

  get token() { return localStorage.getItem(this.TOKEN); }
  get role() { return localStorage.getItem(this.ROLE); }
  get isAdmin() { return this.role === 'Admin' && !!this.token; }
}
