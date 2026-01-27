import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type AnswerReviewDto = {
  id: string;          // GUID
  content: string;
  isCorrect: boolean;
};

type ReviewDetailDto = {
  questionId: string;             // GUID
  topic?: string | null;
  questionContent?: string | null;
  imageUrl?: string | null;

  selectedAnswerId?: string | null; // GUID | null
  correctAnswerId?: string | null;  // GUID | null (fallback)
  isCorrect: boolean;
  explanation?: string | null;

  answers?: AnswerReviewDto[];
};

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrls: ['./review.css'],
})
export class ReviewPage {
  result: any = null;
  details: ReviewDetailDto[] = [];
  currentIndex = 0;

  // ✅ base BE
  private apiBase = 'https://localhost:44321';

  // ✅ đổi /images/... thành https://localhost:44321/images/...
  private toAbsUrl(u?: string | null): string | null {
    if (!u) return null;

    const s = u.trim();
    if (!s) return null;

    // đã là absolute
    if (/^https?:\/\//i.test(s)) return s;

    // ghép với BE
    const base = this.apiBase.replace(/\/$/, '');
    const path = s.startsWith('/') ? s : `/${s}`;
    return `${base}${path}`;
  }

  constructor(private router: Router) {
    const raw = localStorage.getItem('exam_result');
    this.result = raw ? JSON.parse(raw) : null;

    // BE trả "Details" hay "details" thì đều lấy được
    const list = (this.result?.details || this.result?.Details || []) as ReviewDetailDto[];

    if (!list.length) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    // ✅ chuẩn hoá: answers là mảng + imageUrl thành absolute url
    this.details = list.map(d => ({
      ...d,
      imageUrl: this.toAbsUrl(d.imageUrl),
      answers: Array.isArray(d.answers) ? d.answers : [],
    }));
  }

  get current(): ReviewDetailDto {
    return this.details[this.currentIndex];
  }

  private normGuid(v?: string | null): string {
    return (v || '').trim().toLowerCase();
  }

  goTo(i: number) {
    if (i < 0 || i >= this.details.length) return;
    this.currentIndex = i;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToResult() {
    const license = this.result?.license || 'B';
    const set = this.result?.set || '1';
    this.router.navigateByUrl(`/result?license=${license}&set=${set}`);
  }

  retry() {
    const license = this.result?.license || 'B';
    const set = this.result?.set || '1';
    this.router.navigateByUrl(`/practice?license=${license}&set=${set}`);
  }

  navState(i: number): 'current' | 'correct' | 'wrong' {
    if (i === this.currentIndex) return 'current';
    return this.details[i].isCorrect ? 'correct' : 'wrong';
  }

  isChosen(answerId: string): boolean {
    return this.normGuid(this.current.selectedAnswerId) === this.normGuid(answerId);
  }

  // ✅ ƯU TIÊN dùng a.isCorrect, correctAnswerId chỉ fallback
  isCorrectAnswer(answer: AnswerReviewDto): boolean {
    if (answer?.isCorrect === true) return true;

    const correctId = this.normGuid(this.current.correctAnswerId);
    return correctId !== '' && correctId === this.normGuid(answer.id);
  }

  get explanationText(): string {
    return (this.current.explanation || '').trim() || 'Chưa có giải thích cho câu này.';
  }

  trackByAnswerId(_: number, a: AnswerReviewDto) {
    return a.id;
  }
}
