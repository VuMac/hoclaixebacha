import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsApi, NewsDetail } from '../../core/api/news.api';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-detail.html',
  styleUrls: ['./news-detail.css'],
})
export class NewsDetailPage implements OnInit {
  loading = true;
  error = '';
  data: NewsDetail | null = null;

  constructor(private route: ActivatedRoute, private api: NewsApi) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) {
      this.error = 'Thiếu slug bài viết';
      this.loading = false;
      return;
    }

    try {
      this.data = await this.api.getBySlug(slug);
    } catch (e: any) {
      this.error = e?.message || 'Không tải được bài viết';
    } finally {
      this.loading = false;
    }
  }
}
