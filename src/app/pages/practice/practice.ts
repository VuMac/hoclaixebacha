import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttemptDto, RealExamApi } from '../../core/api/real-exam.api';
import { environment } from '../../../environments/environment.development';

type UiAnswer = { id: string; content: string };
type UiQuestion = {
  id: string;
  topic: string;
  level: number;
  content: string;
  imageUrl?: string | null;
  answers: UiAnswer[];
  explanation?: string | null;
};

const GUID_EMPTY = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice.html',
  styleUrls: ['./practice.css'],
})
export class PracticePage implements OnDestroy {
  // URL query: ?license=B&set=1
  license = 'B';
  set = '1';

  loading = true;
  submitted = false;

  examId = ''; // attemptId
  attempt?: AttemptDto;

  questions: UiQuestion[] = [];
  selected: (string | null)[] = []; // answerId GUID

  currentIndex = 0;

  durationSeconds = 20 * 60;
  remainingSeconds = this.durationSeconds;
  private timerId: any = null;

  // chống gọi start nhiều lần khi queryParamMap emit lại
  private startedKey = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: RealExamApi
  ) {
    this.route.queryParamMap.subscribe((q) => {
      const lic = (q.get('license') || 'B').trim();
      const set = (q.get('set') || '1').trim();

      const key = `${lic}|${set}`;
      // nếu cùng key thì không start lại
      if (this.startedKey === key && this.examId) return;

      this.license = lic;
      this.set = set;
      this.startedKey = key;

      this.startRealExam();
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  trackByAnswerId(_: number, a: UiAnswer) {
    return a.id;
  }

  // ====== Option A helpers ======
  optionLabel(i: number): string {
    return 'ABCD'[i] ?? '';
  }

  /**
   * Nếu content kiểu: "Xe A... 3. Xe B... 2. Xe C..."
   * hoặc "1. ... 2. ... 3. ..." thì tách ra hiển thị nhiều dòng.
   * Trả null nếu không phải dạng đó.
   */
  splitNumberedOptions(text?: string | null): string[] | null {
    if (!text) return null;

    const re = /(\d+)\.\s*/g;
    const matches = [...text.matchAll(re)];
    if (matches.length < 2) return null;

    const lines: string[] = [];

    // prefix trước số đầu tiên
    const firstIdx = matches[0].index ?? 0;
    const prefix = text.slice(0, firstIdx).trim();

    // nếu prefix kết thúc bằng .!?… => coi như 1 câu riêng (vd: "Không biển nào.")
    // nếu prefix KHÔNG kết thúc bằng dấu câu => coi như từ khóa chung (vd: "Biển")
    let headPrefix = '';
    if (prefix) {
      if (/[.!?…]$/.test(prefix)) {
        lines.push(prefix);
      } else {
        headPrefix = prefix; // ví dụ: "Biển"
      }
    }

    for (let i = 0; i < matches.length; i++) {
      const num = matches[i][1];
      const start = (matches[i].index ?? 0) + matches[i][0].length;
      const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;

      let body = text.slice(start, end).trim().replace(/^[\.\-:]+\s*/, '');

      // ✅ Nếu prefix là "Biển" / "Hướng" / ... (không kết thúc dấu câu) => coi là từ chung
      if (i === 0 && headPrefix) {
        if (!body) body = `${headPrefix} ${num}`; // "Biển 1"
        else body = `${headPrefix} ${num}. ${body}`; // "Biển 1. ..."
        body = body.replace(/\s+/g, ' ').trim();
        lines.push(body);
        continue;
      }

      // bình thường: "2. Biển 2", "3. Cả ba biển"
      if (body) {
        body = body.replace(/\s+/g, ' ').trim();
        lines.push(`${num}. ${body}`);
      }
    }

    return lines.length ? lines : null;
  }

  // ====== API FLOW: start -> getAttempt ======
  startRealExam() {
    this.resetStateBeforeStart();
    this.api.start({ licenseCode: this.license }).subscribe({
      next: (res: { examId: string }) => {
        this.examId = res.examId;
        this.loadAttempt();
      },
      error: (err: any) => {
        console.error('startRealExam failed', err);
        alert(err?.error || err?.error?.message || 'Start exam lỗi');
        this.loading = false; // ⭐ bắt buộc
      }
    });
  }

  private loadAttempt() {
    if (!this.examId) return;

    this.api.getAttempt(this.examId).subscribe({
      next: (attempt: AttemptDto) => {
        this.attempt = attempt;

        // timeMinutes theo template (B = 20)
        const timeMin = attempt.timeMinutes ?? 20;
        this.durationSeconds = timeMin * 60;
        this.remainingSeconds = this.durationSeconds;

        // map AttemptDto -> UI questions
        this.questions = (attempt.questions ?? []).map((q: any) => {
          const rawImg = q.imageUrl ?? q.ImageUrl; // camelCase + PascalCase

          const mappedAnswers: UiAnswer[] = (q.answers ?? q.Answers ?? []).map((a: any) => ({
            id: a.id ?? a.Id,
            content: a.content ?? a.Content,
          }));

          // ✅ Option A: đẩy "Không đúng" xuống cuối cho đúng style đề
          mappedAnswers.sort((a, b) => {
            const ak = (a.content || '').trim().toLowerCase();
            const bk = (b.content || '').trim().toLowerCase();
            const aBad = ak === 'không đúng' ? 1 : 0;
            const bBad = bk === 'không đúng' ? 1 : 0;
            return aBad - bBad;
          });

          return {
            id: q.id ?? q.Id,
            topic: q.topic ?? q.Topic,
            level: q.level ?? q.Level,
            content: q.content ?? q.Content,
            imageUrl: this.toAbsUrl(rawImg),
            answers: mappedAnswers,
            explanation: null,
          };
        });

        this.selected = Array(this.questions.length).fill(null);

        if (this.questions.length > 0) this.startTimer();
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('getAttempt failed', err);
        this.loading = false;
      },
    });
  }

  private toAbsUrl(url?: string | null) {
    if (!url) return null;
    if (url.startsWith('http')) return url;

    const base = environment.apiBaseUrl
      .replace(/\/$/, '')
      .replace(/\/api$/, '');

    return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
  }

  private resetStateBeforeStart() {
    this.loading = true;
    this.submitted = false;

    this.examId = '';
    this.attempt = undefined;

    this.currentIndex = 0;
    this.questions = [];
    this.selected = [];

    this.stopTimer();
    this.durationSeconds = 20 * 60;
    this.remainingSeconds = this.durationSeconds;
  }

  // ====== GETTERS ======
  get hasQuestions() {
    return this.questions.length > 0;
  }

  get currentQ(): UiQuestion | null {
    return this.questions[this.currentIndex] || null;
  }

  get timeText() {
    return this.formatTime(this.remainingSeconds);
  }

  get isTimeWarning() {
    return this.remainingSeconds <= 5 * 60;
  }

  // ====== NAV ======
  goTo(index: number) {
    if (!this.hasQuestions) return;
    this.currentIndex = index;
  }

  choose(answerId: string) {
    if (this.submitted) return;
    this.selected[this.currentIndex] = answerId;
    console.log('picked', this.currentIndex, answerId, this.selected);
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  get isFirst() {
    return this.currentIndex === 0;
  }

  get isLast() {
    return this.currentIndex === this.questions.length - 1;
  }

  // ====== SUBMIT ======
  submit() {
    if (this.submitted || !this.hasQuestions || !this.attempt) return;

    this.submitted = true;
    this.stopTimer();

    const answers = this.questions.map((q, idx) => ({
      questionId: q.id,
      selectedAnswerId: this.selected[idx] ?? GUID_EMPTY,
    }));

    this.api
      .submit({
        examId: this.attempt.id,
        answers,
      })
      .subscribe({
        next: (result: any) => {
          localStorage.setItem(
            'exam_result',
            JSON.stringify({
              license: this.license,
              set: this.set,
              total: result.totalQuestions,
              correct: result.correctCount,
              scorePercent: result.scorePercent,
              details: result.details,
              createdAt: Date.now(),
            })
          );

          this.router.navigateByUrl(`/result?license=${this.license}&set=${this.set}`);
        },
        error: (err: any) => {
          console.error('submit failed', err);
          this.submitted = false;
        },
      });
  }

  // ====== UI HELPERS ======
  get notSavedCount() {
    return this.selected.filter((v) => v == null).length;
  }

  navState(i: number): 'current' | 'answered' | 'empty' {
    if (i === this.currentIndex) return 'current';
    return this.selected[i] == null ? 'empty' : 'answered';
  }

  backToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  // ====== TIMER ======
  startTimer() {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.submit();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  answerLines(text?: string | null): string[] {
    const s = (text ?? '').replace(/\r?\n/g, ' ').trim();
    if (!s) return [];

    const re = /(\d+)\.\s*/g;
    const matches: Array<{ num: string; start: number; end: number }> = [];
    let m: RegExpExecArray | null;

    while ((m = re.exec(s)) !== null) {
      matches.push({ num: m[1], start: m.index, end: re.lastIndex });
    }

    // Không có "2." "3." => trả nguyên chuỗi
    if (matches.length === 0) return [s];

    const lines: string[] = [];

    // Nếu trước "2." có đoạn text (vd "Không biển nào.") thì coi đó là "1."
    if (matches[0].start > 0) {
      const head = s.slice(0, matches[0].start).trim();
      if (head) lines.push(`1. ${this.trimTailDot(head)}`);
    } else {
      // Nếu bắt đầu bằng "1." thì sẽ được xử lý ở vòng lặp phía dưới
      // (không làm gì ở đây)
    }

    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const next = matches[i + 1];
      const seg = s.slice(cur.end, next ? next.start : s.length).trim();
      if (seg) lines.push(`${cur.num}. ${this.trimTailDot(seg)}`);
    }

    return lines.length ? lines : [s];
  }

  private trimTailDot(x: string) {
    // dọn dấu chấm cuối & khoảng trắng thừa để nhìn sạch hơn
    return x.replace(/\s+/g, ' ').replace(/\.\s*$/, '').trim();
  }
}



