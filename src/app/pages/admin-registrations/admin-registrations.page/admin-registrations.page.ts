import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistrationsApi, CourseRegistration } from '../../../core/api/registrations.api';

type StatusOption = { value: string; label: string };

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './admin-registrations.page.html',
  styleUrls: ['./admin-registrations.page.css'],
})
export class AdminRegistrationsPage {
  loading = false;
  error = '';

  // filters
  q = '';
  status = ''; // '' | NEW | CALLED | DONE | CANCEL
  page = 1;
  pageSize = 20;

  total = 0;
  items: CourseRegistration[] = [];

  // ✅ đồng bộ với BE: NEW/CALLED/DONE/CANCEL
  statusOptions: StatusOption[] = [
    { value: '', label: 'Tất cả' },
    { value: 'NEW', label: 'Mới' },
    { value: 'CALLED', label: 'Đã gọi' },
    { value: 'DONE', label: 'Hoàn tất' },
    { value: 'CANCEL', label: 'Hủy' },
  ];

  rowStatusOptions: StatusOption[] = [
    { value: 'NEW', label: 'Mới' },
    { value: 'CALLED', label: 'Đã gọi' },
    { value: 'DONE', label: 'Hoàn tất' },
    { value: 'CANCEL', label: 'Hủy' },
  ];

  constructor(private api: RegistrationsApi) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.error = '';
    try {
      this.loading = true;

      const res = await this.api.list({
        page: this.page,
        pageSize: this.pageSize,
        q: this.q.trim() || undefined,
        status: this.status || undefined, // NEW/CALLED/DONE/CANCEL
      });

      // ✅ đảm bảo status hiển thị đúng (upper)
      this.items = res.items.map((x) => ({
        ...x,
        status: (x.status || '').toUpperCase(),
        licenseCode: (x.licenseCode || '').toUpperCase(),
      }));

      this.total = res.total;
    } catch (e: any) {
      this.error = e?.message || 'Không tải được dữ liệu';
    } finally {
      this.loading = false;
    }
  }

  async applyFilters() {
    this.page = 1;
    await this.load();
  }

  async clearFilters() {
    this.q = '';
    this.status = '';
    this.page = 1;
    await this.load();
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  async prev() {
    if (this.page <= 1) return;
    this.page--;
    await this.load();
  }

  async next() {
    if (this.page >= this.totalPages) return;
    this.page++;
    await this.load();
  }

  licenseLabel(code: string) {
    const map: Record<string, string> = {
      A1: 'A1 – Xe máy < 175cc',
      A2: 'A2 – Xe máy > 175cc',
      B1: 'B1 – Ô tô số tự động',
      B2: 'B2 – Ô tô số sàn',
      C: 'C – Xe tải',
      D: 'D – Xe chở người',
      E: 'E – Xe chở người > 30 chỗ',
    };
    return map[code] || code;
  }

  statusBadge(s: string) {
    const map: Record<string, string> = {
      NEW: 'Mới',
      CALLED: 'Đã gọi',
      DONE: 'Hoàn tất',
      CANCEL: 'Hủy',
    };
    return map[s] || s;
  }

  async changeRowStatus(item: CourseRegistration, newStatus: string) {
    const nextStatus = (newStatus || '').toUpperCase();
    if (nextStatus === item.status) return;

    const old = item.status;
    item.status = nextStatus; // optimistic UI

    try {
      // ✅ gửi đúng format cho BE (body là string)
      await this.api.updateStatus(item.id, nextStatus);
    } catch (e: any) {
      item.status = old;
      alert(e?.message || 'Cập nhật thất bại');
    }
  }
}
