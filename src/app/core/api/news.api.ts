import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth.store';

export type NewsListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string | null;
  createdAt: string;
};

export type NewsDetail = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string | null;
  contentHtml: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class NewsApi {
  private base = `${environment.apiBaseUrl}/api/news`;

  constructor(private auth: AuthStore) {}

  async list(): Promise<NewsListItem[]> {
    const res = await fetch(this.base);
    if (!res.ok) throw new Error('Không tải được danh sách tin tức');
    return res.json();
  }

  async getBySlug(slug: string): Promise<NewsDetail> {
    const res = await fetch(`${this.base}/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Không tải được bài viết');
    return res.json();
  }

  async create(formData: FormData): Promise<{ slug: string }> {
    const token = this.auth.token;
    if (!token) throw new Error('Bạn chưa đăng nhập admin');

    const res = await fetch(this.base, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(t || 'Đăng bài thất bại');
    }
    return res.json();
  }
}
