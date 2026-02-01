import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;     // ví dụ: 12/01/2026
  tag?: string;     // ví dụ: "Thông báo"
};

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="page">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="left">
          <div class="title">Tin tức</div>
          <div class="sub">Cập nhật kỳ thi, hồ sơ, lịch khai giảng…</div>
        </div>

        <a class="btn-back" routerLink="/intro">← Quay lại</a>
      </div>
    </header>

    <main class="wrap">
      <div class="grid" *ngIf="news.length; else empty">
        <article class="card" *ngFor="let n of news">
          <div class="meta">
            <span class="tag" *ngIf="n.tag">{{ n.tag }}</span>
            <span class="date">{{ n.date }}</span>
          </div>

          <h3 class="h">{{ n.title }}</h3>
          <p class="p">{{ n.excerpt }}</p>

          <div class="actions">
            <button class="btn" type="button" disabled>Đọc thêm</button>
          </div>
        </article>
      </div>

      <ng-template #empty>
        <div class="empty">
          <div class="empty-title">Chưa có bài viết</div>
          <div class="empty-sub">Bạn có thể thêm tin tức ở trang này sau.</div>
        </div>
      </ng-template>
    </main>
  </div>
  `,
  styles: [`
    .page{min-height:100vh;background:#f4f7fb;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}
    .topbar{position:sticky;top:0;z-index:1000;background:#22307f;color:#fff;border-bottom:2px solid #ed1c24;box-shadow:0 4px 12px rgba(0,0,0,.15);}
    .topbar-inner{max-width:1200px;margin:0 auto;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:14px;}
    .title{font-weight:1000;font-size:20px;line-height:1.2;}
    .sub{opacity:.9;font-size:13px;margin-top:2px;}
    .btn-back{color:#fff;text-decoration:none;font-weight:900;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);}
    .wrap{max-width:1200px;margin:0 auto;padding:18px 16px 30px;}
    .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
    @media (max-width:1020px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
    @media (max-width:560px){.grid{grid-template-columns:1fr;}}
    .card{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:16px;padding:14px;box-shadow:0 12px 26px rgba(15,23,42,.06);display:flex;flex-direction:column;gap:10px;}
    .meta{display:flex;align-items:center;justify-content:space-between;gap:10px;}
    .tag{font-size:11px;font-weight:1000;padding:4px 8px;border-radius:999px;background:#fff3c6;color:#92400e;border:1px solid #f5c542;}
    .date{font-size:12px;color:rgba(15,23,42,.65);font-weight:800;}
    .h{margin:0;font-size:15px;font-weight:1000;line-height:1.3;}
    .p{margin:0;color:rgba(15,23,42,.75);font-size:13px;line-height:1.5;flex:1;}
    .actions{margin-top:auto;}
    .btn{width:100%;height:42px;border:0;border-radius:14px;background:linear-gradient(90deg,#ed1c24 0%,#22307f 100%);color:#fff;font-weight:1000;cursor:not-allowed;opacity:.8;}
    .empty{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:16px;padding:18px;box-shadow:0 12px 26px rgba(15,23,42,.06);}
    .empty-title{font-weight:1000;font-size:16px;}
    .empty-sub{margin-top:6px;color:rgba(15,23,42,.7);font-size:13px;}
  `]
})
export class NewsPage {
  // demo data (sau này bạn thay bằng API)
  news: NewsItem[] = [
    // {
    //   id: 'n1',
    //   title: 'Lịch khai giảng tháng 1',
    //   excerpt: 'Cập nhật lịch học và lịch thi mới nhất trong tháng…',
    //   date: '12/01/2026',
    //   tag: 'Thông báo',
    // },
  ];
}
