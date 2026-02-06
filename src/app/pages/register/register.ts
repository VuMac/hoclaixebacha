import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseRegistrationsApi } from '../../core/api/course-registrations.api'; // <-- sửa path cho đúng vị trí file bạn

type CourseInfo = { title: string; duration?: string; fee?: string; };
type LicenseClassOption = { value: string; label: string; };

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private regApi = inject(CourseRegistrationsApi);

  selectedCourseInfo: CourseInfo | null = null;
  loading = false;

  licenseClasses: LicenseClassOption[] = [
    { value: 'A1', label: 'A1 – Xe máy dưới 175cc' },
    { value: 'A2', label: 'A2 – Xe máy trên 175cc' },
    { value: 'B1', label: 'B1 – Ô tô số tự động' },
    { value: 'B2', label: 'B2 – Ô tô số sàn' },
    { value: 'C', label: 'C – Xe tải' },
    { value: 'D', label: 'D – Xe chở người (30 chỗ)' },
    { value: 'E', label: 'E – Xe chở người (>30 chỗ)' },
  ];

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)\d{9}$/)]],
    licenseClass: ['', [Validators.required]],
    courseId: [''],
    courseTitle: [''],
    duration: [''],
    fee: [''],
    note: [''],
  });

  ngOnInit() {
    this.route.queryParams.subscribe((q) => {
      const title = q['title'] || '';
      const duration = q['duration'] || '';
      const fee = q['fee'] || '';

      this.form.patchValue({
        courseId: q['courseId'] || '',
        courseTitle: title,
        duration,
        fee,
      });

      this.selectedCourseInfo = title ? { title, duration, fee } : null;
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.loading = true;

    this.regApi.create({
      fullName: v.fullName!,
      phone: v.phone!,
      licenseCode: v.licenseClass!, // map licenseClass -> licenseCode
      note: v.note || null,
    }).subscribe({
      next: () => {
        alert('Đã gửi đăng ký! Trung tâm sẽ liên hệ sớm.');
        this.form.patchValue({ fullName: '', phone: '', note: '', licenseClass: '' });
        this.form.markAsPristine();
      },
      error: (err) => {
        console.error(err);
        alert('Gửi đăng ký thất bại. Vui lòng thử lại.');
      },
      complete: () => this.loading = false,
    });
  }

  scrollToForm() {
    const el = document.getElementById('regForm');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
