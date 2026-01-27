import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css'],
})
export class ResultPage {
  result: any = null;

  // UI hiển thị thôi
  totalAttemptsLimit = 100;

  // stats theo đúng license + set
  bestScore = 0;
  latestScore = 0;
  attemptCount = 0;
  latestAgoText = '';

  constructor(private router: Router) {
    const raw = localStorage.getItem('exam_result');
    this.result = raw ? JSON.parse(raw) : null;

    if (this.result) {
      // đảm bảo có set để filter history
      if (this.result.set == null) this.result.set = '1';
      this.loadStatsFromHistory();
    }
  }

  // ====== SCORE ======
  get scoreOver10(): number {
    if (!this.result) return 0;
    const total = Number(this.result.total || 0);
    const correct = Number(this.result.correct || 0);
    if (total <= 0) return 0;
    return Math.round((correct / total) * 10);
  }

  get scoreOver100(): number {
    if (!this.result) return 0;
    const total = Number(this.result.total || 0);
    const correct = Number(this.result.correct || 0);
    if (total <= 0) return 0;
    return Math.round((correct / total) * 100);
  }

  /**
   * PASS theo “thi thật”:
   * - ưu tiên dùng result.pass (từ BE)
   * - nếu chưa có, dùng passMark + criticalWrong
   * - fallback cuối cùng: >=80%
   */
  get pass(): boolean {
    if (!this.result) return false;

    // 1) ưu tiên flag BE trả về
    if (typeof this.result?.pass === 'boolean') return this.result.pass;

    const total = Number(this.result?.total || 0);
    const correct = Number(this.result?.correct || 0);

    // 2) nếu có passMark thì dùng luật thật
    const passMark = Number(this.result?.passMark || 0);
    const criticalWrong = !!this.result?.criticalWrong;

    if (passMark > 0) {
      return !criticalWrong && correct >= passMark;
    }

    // 3) fallback: 80%
    return total > 0 && correct / total >= 0.8;
  }

  // "cách đây X phút"
  get lastTimeAgoText(): string {
    const ts = Number(this.result?.createdAt || 0);
    if (!ts) return 'vừa xong';
    return this.timeAgoText(ts);
  }

  // ====== NAV ======
  viewDetail() {
    this.router.navigateByUrl('/review');
  }

  retry() {
    const license = this.result?.license || 'B';
    const set = this.result?.set || '1';
    this.router.navigateByUrl(`/practice?license=${license}&set=${set}`);
  }

  goDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  // ====== HISTORY STATS ======
  private calcScore(correct: number, total: number) {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
  }

  private timeAgoText(ts: number) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'vài giây trước';
    if (min < 60) return `${min} phút trước`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    return `${d} ngày trước`;
  }

  private loadStatsFromHistory() {
    const raw = localStorage.getItem('exam_history');
    const history = raw ? JSON.parse(raw) : [];

    const lic = this.result?.license || 'B';
    const set = this.result?.set || '1';

    const same = history.filter(
      (r: any) => r.license === lic && String(r.set ?? '1') === String(set)
    );

    this.attemptCount = same.length;

    if (same.length) {
      const latest = same[0]; // newest first
      this.latestScore = this.calcScore(Number(latest.correct || 0), Number(latest.total || 0));
      this.latestAgoText = this.timeAgoText(Number(latest.createdAt || Date.now()));
      this.bestScore = Math.max(...same.map((r: any) => this.calcScore(Number(r.correct || 0), Number(r.total || 0))));
    } else {
      // fallback nếu chưa có history
      this.latestScore = this.scoreOver100;
      this.bestScore = this.scoreOver100;
      this.latestAgoText = this.lastTimeAgoText;
      this.attemptCount = 1;
    }
  }
}
