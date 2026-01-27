import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type CourseKey = 'B_MT' | 'B_AT' | 'C1';

type Course = {
  tab: string;
  title: string;
  duration: string;
  datKm: string;
  mode: string;
  fee: string;
  examYard: string;
  slogan: string;
  price: string;
  commit1: string;
  commit2: string;
  image: string;
};

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.css'],
})
export class IntroPage {
  constructor(private router: Router) { }

  // ====== COURSE SECTION (giống ảnh) ======
  activeCourse: CourseKey = 'B_AT';

  consultName = '';
  consultPhone = '';

  cards = [
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
      subtitle: 'Mô phỏng tình huống',
      cta: { label: 'Luyện', link: '/dashboard' },
      badge: 'Mới ra mắt',
    },
    {
      icon: '🚗',
      title: 'B2 – Ô tô số sàn',
      subtitle: 'Luyện đề theo hạng',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '🚙',
      title: 'B1 – Ô tô tự động',
      subtitle: 'Dễ làm quen',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '🛵',
      title: 'A1 – Xe máy < 175cc',
      subtitle: 'Phổ biến nhất',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '🏍️',
      title: 'A2 – Xe máy > 175cc',
      subtitle: 'Phân khối lớn',
      cta: { label: 'Vào luyện', link: '/dashboard' },
    },
    {
      icon: '📌',
      title: 'Đăng ký học',
      subtitle: 'Nhận tư vấn nhanh',
      cta: { label: 'Đăng ký', link: '/intro' },
    },
  ];



  courses: Record<CourseKey, Course> = {
    B_MT: {
      tab: 'KHÓA HỌC HẠNG B SỐ SÀN',
      title: 'KHÓA HỌC HẠNG B SỐ SÀN',
      duration: '3 tháng',
      datKm: '810km',
      mode: '01 Học viên/ 01 thầy/ 01 xe',
      fee: 'Đóng nhiều đợt',
      examYard: 'Sân sát hạch Bắc Hà',
      slogan: 'BẮC HÀ - ĐEM ĐẾN GIÁ TRỊ TRƯỜNG TỒN',
      price: '8 TRIỆU',
      commit1: 'HỌC THI NHANH',
      commit2: 'LÁI GIỎI',
      image: 'assets/course-b.jpg',
    },
    B_AT: {
      tab: 'KHÓA HỌC HẠNG B SỐ TỰ ĐỘNG',
      title: 'KHÓA HỌC HẠNG B SỐ TỰ ĐỘNG',
      duration: '2 tháng',
      datKm: '710km',
      mode: '01 Học viên/ 01 thầy/ 01 xe',
      fee: 'Đóng nhiều đợt',
      examYard: 'Sân sát hạch Bắc Hà',
      slogan: 'BẮC HÀ - ĐEM ĐẾN GIÁ TRỊ TRƯỜNG TỒN',
      price: '8 TRIỆU',
      commit1: 'HỌC THI NHANH',
      commit2: 'LÁI GIỎI',
      image: 'assets/course-b.jpg',
    },
    C1: {
      tab: 'KHÓA HỌC HẠNG C1',
      title: 'KHÓA HỌC HẠNG C1',
      duration: '3 tháng',
      datKm: '850km',
      mode: '01 Học viên/ 01 thầy/ 01 xe',
      fee: 'Đóng nhiều đợt',
      examYard: 'Sân sát hạch Bắc Hà',
      slogan: 'BẮC HÀ - ĐEM ĐẾN GIÁ TRỊ TRƯỜNG TỒN',
      price: '12 TRIỆU',
      commit1: 'HỌC THI NHANH',
      commit2: 'LÁI GIỎI',
      image: 'assets/course-b.jpg',
    },
  };

  get course(): Course {
    return this.courses[this.activeCourse];
  }

  setCourse(key: CourseKey) {
    this.activeCourse = key;
  }

  submitConsult(e: Event) {
    e.preventDefault();
    const name = (this.consultName || '').trim();
    const phone = (this.consultPhone || '').trim();
    if (!name || !phone) return;

    // TODO: thay bằng call API sau
    alert(`Đã gửi đăng ký tư vấn!\nHọ tên: ${name}\nĐiện thoại: ${phone}`);

    this.consultName = '';
    this.consultPhone = '';
  }

  // nếu bạn muốn nút "Vào luyện" ở intro
  goPractice() {
    this.router.navigateByUrl('/dashboard');
  }

  go(url: string) {
    this.router.navigateByUrl(url);
  }
}
