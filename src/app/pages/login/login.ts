import { Component } from '@angular/core'; // Decorator để khai báo đây là 1 Angular Component
import { CommonModule } from '@angular/common'; // Chứa các directive cơ bản như *ngIf, *ngFor...
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Reactive Form + validator
import { Router } from '@angular/router'; // Điều hướng trang sau khi login (navigate)

@Component({
  selector: 'app-login', // Tên thẻ component dùng trong HTML: <app-login></app-login>
  standalone: true, // Standalone component (không cần khai báo trong NgModule)
  imports: [CommonModule, ReactiveFormsModule], // Import để dùng *ngIf/*ngFor và reactive forms trong template
  templateUrl: './login.html', // File giao diện HTML của trang login
  styleUrls: ['./login.css'], // File CSS của trang login
})
export class LoginPage {
  hidePassword = true; // true = ẩn mật khẩu (type="password"), false = hiện (type="text")
  loading = false; // trạng thái đang xử lý đăng nhập (để disable nút/hiện "đang đăng nhập...")

  form: any; // FormGroup (để any cho nhanh; nếu typed thì khai báo FormGroup)

  constructor(
    private fb: FormBuilder, // FormBuilder để tạo form (Reactive Forms)
    private router: Router // Router để điều hướng sau đăng nhập
  ) {
    // Khởi tạo form gồm 2 field: username và password
    // Validators.required: bắt buộc không được để trống
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Getter để dùng gọn trong template:
  // ví dụ: username?.touched, username?.invalid...
  get username() {
    return this.form.get('username');
  }

  // Getter tương tự cho password
  get password() {
    return this.form.get('password');
  }

  // Hàm chạy khi bấm nút "Đăng nhập" (ngSubmit)
  submit() {
  this.form.markAllAsTouched();
  if (this.form.invalid) return;

  this.loading = true;

  // demo giả lập login thành công
  setTimeout(() => {
    this.loading = false;
    this.router.navigateByUrl('/dashboard'); // <-- chuyển sang trang như hình
  }, 600);
}
  goForgot() {
    // tạm thời làm demo
    alert('Chưa làm trang quên mật khẩu');
    // sau này có route thì dùng:
    // this.router.navigateByUrl('/forgot-password');
  }

}
