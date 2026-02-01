import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // ✅ thêm RouterLink, RouterLinkActive
import { FormsModule } from '@angular/forms';

type License = { code: string; name: string };

type PracticeSet = {
  id: number;
  title: string;
  tag: string;
  questions: number;
  minutes: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive], // ✅ thêm RouterLink, RouterLinkActive
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardPage {
  licenses: License[] = [
    // XE MÁY
    { code: 'A', name: 'A - Xe máy' },
    { code: 'B1_MOTO', name: 'B1 (mô tô 3 bánh)' },

    // Ô TÔ CON
    { code: 'B', name: 'B - Ô tô' },

    // XE TẢI
    { code: 'C1', name: 'C1 - Xe tải ≤ 7.5 tấn' },
    { code: 'C', name: 'C - Xe tải > 7.5 tấn' },

    // XE KHÁCH
    { code: 'D1', name: 'D1 - Xe khách 8–16 chỗ' },
    { code: 'D2', name: 'D2 - Xe khách 17–29 chỗ' },
    { code: 'D', name: 'D - Xe khách ≥ 30 chỗ' },

    // XE ĐẦU KÉO / RƠ-MOÓC
    { code: 'BE', name: 'BE - Ô tô B kéo rơ-moóc' },
    { code: 'C1E', name: 'C1E - C1 kéo rơ-moóc' },
    { code: 'CE', name: 'CE - Xe đầu kéo / container' },
    { code: 'D1E', name: 'D1E - D1 kéo rơ-moóc' },
    { code: 'D2E', name: 'D2E - D2 kéo rơ-moóc' },
    { code: 'DE', name: 'DE - D kéo rơ-moóc' },
  ];

  private toBackendLicense(code: string): string {
    const c = (code || '').trim().toUpperCase();

    // xe máy
    if (c === 'A') return 'A2';
    if (c === 'B1_MOTO') return 'A3';

    // ô tô con: B
    if (c === 'B') return 'B';

    // tải/khách
    if (c === 'C1') return 'C';
    if (c === 'D1' || c === 'D2') return 'D';

    // rơ-moóc
    if (c === 'BE') return 'B';
    if (c === 'C1E' || c === 'CE') return 'C';
    if (c === 'D1E' || c === 'D2E' || c === 'DE') return 'D';

    return c;
  }

  selectedLicense = 'B';
  practiceSets: PracticeSet[] = [];

  isModalOpen = false;
  selectedSet: PracticeSet | null = null;

  constructor(private router: Router) {
    this.generatePracticeSets();
  }

  onLicenseChange() {
    this.generatePracticeSets();
  }

  startPractice() {
    const beCode = this.toBackendLicense(this.selectedLicense);
    this.router.navigateByUrl(`/practice?license=${beCode}`);
  }

  openSet(setId: number) {
    const found = this.practiceSets.find((s) => s.id === setId);
    if (!found) return;

    this.selectedSet = found;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSet = null;
  }

  startExam() {
    if (!this.selectedSet) return;
    const setId = this.selectedSet.id;

    const beCode = this.toBackendLicense(this.selectedLicense);

    this.router.navigateByUrl(`/practice?license=${beCode}&set=${setId}`);
    this.closeModal();
  }

  generatePracticeSets() {
    const licenseLabel = this.getLicenseLabel(this.selectedLicense);

    this.practiceSets = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      tag: 'Đề luật mới của Bộ Công An',
      title: `Bằng lái xe hạng ${licenseLabel} dành cho xe 4 bánh`,
      questions: 30,
      minutes: 20,
    }));
  }

  private getLicenseLabel(code: string) {
    if (code === 'B1_MOTO') return 'B1';
    return code;
  }
}
