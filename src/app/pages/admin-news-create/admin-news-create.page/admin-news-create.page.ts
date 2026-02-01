import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NewsApi } from '../../../core/api/news.api';
import { AuthStore } from '../../../core/auth/auth.store';

type NewsCreateForm = {
  title: string;
  excerpt: string;
  contentHtml: string;
  isPublished: boolean;
};

@Component({
  selector: 'app-admin-news-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-news-create.page.html',
  styleUrls: ['./admin-news-create.page.css'],
})
export class AdminNewsCreatePage {
  loading = false;
  error = '';

  form: NewsCreateForm = {
    title: '',
    excerpt: '',
    contentHtml: '',
    isPublished: true,
  };

  thumbnailFile: File | null = null;

  constructor(
    private api: NewsApi,
    private router: Router,
    private auth: AuthStore
  ) {}

  ngOnInit() {
    if (!this.auth.isAdmin) {
      this.router.navigateByUrl('/admin/login');
    }
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.thumbnailFile = input.files?.[0] || null;
  }

  async submit() {
    this.error = '';

    const title = this.form.title.trim();
    const excerpt = this.form.excerpt.trim();
    const contentHtml = this.form.contentHtml.trim();

    if (!title || !excerpt || !contentHtml) {
      this.error = 'Vui lòng nhập đủ: Tiêu đề, Mô tả ngắn, Nội dung';
      return;
    }

    try {
      this.loading = true;

      const fd = new FormData();
      fd.append('title', title);
      fd.append('excerpt', excerpt);
      fd.append('contentHtml', contentHtml);
      fd.append('isPublished', String(this.form.isPublished));
      if (this.thumbnailFile) fd.append('thumbnail', this.thumbnailFile);

      const res = await this.api.create(fd);
      await this.router.navigateByUrl(`/news/${res.slug}`);
    } catch (e: any) {
      // Nếu BE trả 401/403 -> đá về login cho admin
      const msg = e?.message || 'Đăng bài thất bại';
      if (msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('unauthorized')) {
        this.auth.clear();
        await this.router.navigateByUrl('/admin/login');
        return;
      }
      this.error = msg;
    } finally {
      this.loading = false;
    }
  }
}
