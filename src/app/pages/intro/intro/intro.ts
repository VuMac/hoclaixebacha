import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/** ===== Types ===== */
type QuickCard = {
  icon?: string;
  title: string;
  subtitle: string;
  cta: { label: string; link: string };
  badge?: string;
  disabled?: boolean;
};

type CourseCard = {
  id: string;
  title: string;
  duration: string;
  fee: string;
  image: string;
  icon?: string;
  alt?: boolean;
  imageError?: boolean;
  detailHtml: string;
};

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.css'],
})
export class IntroPage implements OnDestroy {
  constructor(private router: Router) {}

  /** =========================
   *  CONTACT (call / zalo / copy)
   *  ========================= */
  contactPhone = '0393655992';

  copiedText = '';
  private copyTimer: any;

  get zaloLink(): string {
    // format 84xxxxxxxxx cho ổn trên nhiều máy
    const phone84 = this.contactPhone.startsWith('0')
      ? '84' + this.contactPhone.slice(1)
      : this.contactPhone;

    return `https://zalo.me/${phone84}`;
  }

  async copyTextFn(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback cho browser cũ
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    this.copiedText = text;
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => (this.copiedText = ''), 1500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.copyTimer);
    document.body.style.overflow = '';
  }

  /** =========================
   *  CONSULT FORM (nếu bạn còn dùng ở chỗ khác)
   *  ========================= */
  consultName = '';
  consultPhone = '';

  submitConsult(e: Event) {
    e.preventDefault();
    const name = (this.consultName || '').trim();
    const phone = (this.consultPhone || '').trim();
    if (!name || !phone) return;

    alert(`Đã gửi đăng ký tư vấn!\nHọ tên: ${name}\nĐiện thoại: ${phone}`);

    this.consultName = '';
    this.consultPhone = '';
  }

  /** =========================
   *  QUICK CARDS
   *  ========================= */
  cards: QuickCard[] = [
    {
      icon: '🪪',
      title: 'Tra cứu GPLX',
      subtitle: 'Thông tin & hướng dẫn',
      cta: { label: 'Tra cứu', link: '/dashboard' },
    },
    {
      icon: '🧾',
      title: 'Biểu mẫu',
      subtitle: 'Tải biểu mẫu cần thiết',
      cta: { label: 'Xem', link: '/dashboard' },
    },
    {
      icon: '🧠',
      title: 'Thi thử lý thuyết',
      subtitle: 'Bộ đề chuẩn mới',
      cta: { label: 'Luyện', link: '/dashboard' },
    },
    {
      icon: '🎮',
      title: 'Thi thử mô phỏng',
      subtitle: 'Tính năng đang phát triển',
      cta: { label: 'Sắp có', link: '#top' },
      badge: 'Đang phát triển',
      disabled: true,
    },
    {
      icon: '🚗',
      title: 'B – Ô tô',
      subtitle: 'Luyện đề ô tô (gộp B1/B2)',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '🛵',
      title: 'A – Xe máy',
      subtitle: 'Luyện đề xe máy (gộp A1/A2)',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '📌',
      title: 'Đăng ký học',
      subtitle: 'Nhận tư vấn nhanh',
      cta: { label: 'Liên hệ', link: '#contact' },
    },
  ];

  /** =========================
   *  THÔNG TIN KHÓA HỌC (grid + modal)
   *  ========================= */
  courseCards: CourseCard[] = [
    {
      id: 'A1',
      title: 'Học lái xe mô tô hạng A1',
      duration: '02 ngày',
      fee: '800.000 VNĐ',
      image: 'assets/A1.jpg',
      icon: '🛵',
      alt: true,
      detailHtml: `
        <p><b>Xe mô tô hai bánh</b> có dung tích xi-lanh đến 125 cm³ hoặc công suất động cơ điện đến 11 kW.</p>
        <h4>1. Điều kiện</h4>
        <ul>
          <li>Là công dân Việt Nam hoặc người nước ngoài cư trú / học tập / làm việc hợp pháp tại Việt Nam.</li>
          <li>Đủ 18 tuổi (tính đến ngày dự thi sát hạch).</li>
        </ul>
        <h4>2. Hồ sơ</h4>
        <ul>
          <li>CCCD/CMND (bản sao).</li>
          <li>Giấy khám sức khỏe đúng mẫu.</li>
          <li>Ảnh thẻ 3x4 (nền xanh).</li>
        </ul>
      `,
    },
    {
      id: 'A',
      title: 'Học lái xe mô tô hạng A',
      duration: '04 ngày',
      fee: '2.000.000 VNĐ',
      image: 'assets/A.jpg',
      icon: '🏍️',
      detailHtml: `
        <p><b>Mô tô trên 125 cm³</b> hoặc xe mô tô điện công suất lớn theo quy định.</p>
        <h4>1. Điều kiện</h4>
        <ul>
          <li>Đủ 18 tuổi.</li>
          <li>Đảm bảo sức khỏe theo quy định.</li>
        </ul>
        <h4>2. Hồ sơ</h4>
        <ul>
          <li>CCCD/CMND (bản sao).</li>
          <li>Giấy khám sức khỏe đúng mẫu.</li>
          <li>Ảnh thẻ 3x4.</li>
        </ul>
      `,
    },
    {
      id: 'B01',
      title: 'Học lái xe ô tô hạng B số tự động',
      duration: '3 tháng',
      fee: '16.000.000 VNĐ',
      image: 'assets/B.jpg',
      icon: '🚗',
      detailHtml: `
        <p>Khóa học phù hợp người mới bắt đầu, ưu tiên xe số tự động.</p>
        <h4>Nội dung</h4>
        <ul>
          <li>Lý thuyết + mô phỏng + sa hình</li>
          <li>Thực hành sân tập & đường trường</li>
        </ul>
      `,
    },
    {
      id: 'B_MT_CARD',
      title: 'Học lái xe ô tô hạng B số sàn',
      duration: '3 tháng',
      fee: '17.000.000 VNĐ',
      image: 'assets/BB.jpg',
      icon: '🚙',
      alt: true,
      detailHtml: `
        <p>Khóa học xe số sàn, phù hợp học viên muốn kỹ năng lái tốt & chắc.</p>
        <h4>Nội dung</h4>
        <ul>
          <li>Lý thuyết, mô phỏng, sa hình</li>
          <li>Thực hành sân tập & đường trường</li>
        </ul>
      `,
    },
    {
      id: 'C1_CARD',
      title: 'Học lái xe ô tô hạng C1',
      duration: '3 tháng',
      fee: '21.000.000 VNĐ',
      image: 'assets/C.jpg',
      icon: '🚚',
      alt: true,
      detailHtml: `
        <p>Khóa học dành cho học viên đăng ký hạng C1 theo quy định hiện hành.</p>
        <h4>Nội dung</h4>
        <ul>
          <li>Lý thuyết + mô phỏng</li>
          <li>Thực hành sân tập & đường trường</li>
        </ul>
      `,
    },
    {
      id: 'FORKLIFT',
      title: 'Học vận hành xe nâng hàng',
      duration: '3 tháng',
      fee: '4.200.000 VNĐ',
      image: 'assets/Nang.jpg',
      icon: '🏗️',
      detailHtml: `
        <p>Chương trình đào tạo vận hành xe nâng hàng an toàn và đúng kỹ thuật.</p>
        <h4>Nội dung</h4>
        <ul>
          <li>Nguyên lý vận hành & an toàn lao động</li>
          <li>Thực hành thao tác nâng – hạ – xếp dỡ</li>
        </ul>
      `,
    },
  ];

  isCourseModalOpen = false;
  selectedCourse: CourseCard | null = null;

  openCourseDetail(c: CourseCard) {
    this.selectedCourse = c;
    this.isCourseModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCourseDetail() {
    this.isCourseModalOpen = false;
    this.selectedCourse = null;
    document.body.style.overflow = '';
  }

  /** =========================
   *  NAV HELPERS
   *  ========================= */
  go(url: string) {
    if (!url) return;

    if (url.startsWith('#')) {
      this.scrollTo(url.substring(1));
      return;
    }

    this.router.navigateByUrl(url);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Nếu bạn dùng ở HTML: (click)="copyText('039...')" */
  copyText(text: string) {
    return this.copyTextFn(text);
  }
}
