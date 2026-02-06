import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/** =========================
 *  Types
 *  ========================= */
type CTA = {
  label: string;
  link: string; // '/route' hoặc '#anchor'
};

type QuickCard = {
  icon?: string;
  title: string;
  subtitle: string;
  cta: { label: string; link: string };
  badge?: string;
  disabled?: boolean;
  art?: string; // ảnh nhỏ
};

type CourseCard = {
  id: string;
  title: string;
  duration: string;
  fee: string;
  image: string;
  icon?: string;
  detailHtml: string;

  imageError?: boolean;
};

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.css'],
})
export class IntroPage implements OnDestroy {
  constructor(private router: Router) { }

  /** =========================
   *  CONTACT
   *  ========================= */
  contactPhone = '0393655992';

  copiedText = '';
  private copyTimer: any;

  /** Zalo link chuẩn: 84 + bỏ số 0 đầu */
  get zaloLink(): string {
    const phone = (this.contactPhone || '').trim();
    if (!phone) return 'https://zalo.me';

    const phone84 = phone.startsWith('0') ? '84' + phone.slice(1) : phone;
    return `https://zalo.me/${phone84}`;
  }

  get telLink(): string {
    const phone = (this.contactPhone || '').trim();
    return phone ? `tel:${phone}` : 'tel:';
  }

  async copyTextFn(text: string) {
    const value = (text || '').trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback cho browser cũ
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    this.copiedText = value;
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => (this.copiedText = ''), 1500);
  }

  copyText(text: string) {
    return this.copyTextFn(text);
  }

  /** =========================
   *  CONSULT FORM (nếu bạn dùng)
   *  ========================= */
  consultName = '';
  consultPhone = '';

  // ✅ Optional: lưu khóa học đã chọn để tư vấn nhanh
  consultCourse = ''; // bạn có thể bind vào input hidden / text nếu muốn

  submitConsult(e: Event) {
    e.preventDefault();

    const name = (this.consultName || '').trim();
    const phone = (this.consultPhone || '').trim();
    if (!name || !phone) return;

    const courseTxt = (this.consultCourse || '').trim();
    alert(
      `Đã gửi đăng ký tư vấn!\nHọ tên: ${name}\nĐiện thoại: ${phone}${courseTxt ? `\nKhóa học: ${courseTxt}` : ''
      }`
    );

    this.consultName = '';
    this.consultPhone = '';
    this.consultCourse = '';
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
   *  COURSE CARDS (grid + modal)
   *  ========================= */
  courseCards: CourseCard[] = [
    {
      id: 'A1',
      title: 'Học lái xe mô tô hạng A1',
      duration: '02 ngày',
      fee: '800.000 VNĐ',
      image: 'assets/A1.jpg',
      icon: '🛵',
      detailHtml: `
        <p><b>Xe mô tô hai bánh</b> có dung tích xi-lanh đến 125 cm³ hoặc công suất động cơ điện đến 11 kW.</p>
        <h4>1. Điều kiện</h4>
        <ul>
          <li>Đủ 18 tuổi (tính đến ngày dự thi sát hạch).</li>
          <li>Cư trú / học tập / làm việc hợp pháp tại Việt Nam.</li>
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
      id: 'B_AT',
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
      id: 'B_MT',
      title: 'Học lái xe ô tô hạng B số sàn',
      duration: '3 tháng',
      fee: '17.000.000 VNĐ',
      image: 'assets/BB.jpg',
      icon: '🚙',
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
      id: 'C1',
      title: 'Học lái xe ô tô hạng C1',
      duration: '3 tháng',
      fee: '21.000.000 VNĐ',
      image: 'assets/C.jpg',
      icon: '🚚',
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

  /** =========================
   *  MODAL
   *  ========================= */
  isCourseModalOpen = false;
  selectedCourse: CourseCard | null = null;

  openCourseDetail(course: CourseCard) {
    this.selectedCourse = course;
    this.isCourseModalOpen = true;
    this.lockBodyScroll(true);
  }

  closeCourseDetail() {
    this.isCourseModalOpen = false;
    this.selectedCourse = null;
    this.lockBodyScroll(false);
  }

  private lockBodyScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  /**
   * ✅ NEW: Đăng ký học ngay (trong popup)
   * - đóng modal
   * - scroll xuống contact
   * - lưu khóa học để bạn dùng (tùy chọn)
   */
  registerNow(course: CourseCard | null) {
    if (!course) return;

    // đóng modal trước cho sạch UI
    this.closeCourseDetail();

    // chuyển trang + truyền khóa học
    this.router.navigate(['/register'], {
      queryParams: {
        courseId: course.id,
        title: course.title,
        fee: course.fee,
        duration: course.duration,
      },
    });
  }
  /** =========================
   *  NAV HELPERS
   *  ========================= */
  go(url: string) {
    if (!url) return;

    // anchor
    if (url.startsWith('#')) {
      this.scrollTo(url.substring(1));
      return;
    }

    // internal route
    this.router.navigateByUrl(url);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** =========================
   *  LIFECYCLE
   *  ========================= */
  ngOnDestroy(): void {
    clearTimeout(this.copyTimer);
    this.lockBodyScroll(false);
  }
}
