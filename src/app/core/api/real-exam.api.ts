import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export type StartExamDto = {
  licenseCode: string;
  templateId?: string | null;
};

export type StartExamResponse = {
  examId: string;
};

export type AttemptAnswerDto = {
  id: string;
  content: string;
};

export type AttemptQuestionDto = {
  id: string;
  topic: string;
  level: number;
  content: string;
  imageUrl?: string | null;
  answers: AttemptAnswerDto[];
};

export type AttemptDto = {
  id: string;
  createdAt: string;
  timeMinutes: number;
  totalQuestions: number;
  title: string;
  questions: AttemptQuestionDto[];
};

export type SubmitAnswerDto = {
  questionId: string;
  selectedAnswerId: string; // nếu chưa chọn thì gửi ""
};

export type SubmitExamDto = {
  examId: string;
  answers: SubmitAnswerDto[];
};

export type QuestionResultDto = {
  questionId: string;
  selectedAnswerId?: string | null;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation?: string | null;
  imageUrl?: string | null;
};

export type SubmitResultDto = {
  examId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  details: QuestionResultDto[];
  
};

@Injectable({ providedIn: 'root' })
export class RealExamApi {
  // ✅ nếu BE chạy cùng máy qua swagger https://localhost:44321
  // bạn có thể để trống baseUrl và dùng proxy.
  // Cách dễ nhất: để baseUrl đúng BE của bạn:
  
  constructor(private http: HttpClient) {}

  start(dto: StartExamDto): Observable<StartExamResponse> {
    return this.http.post<StartExamResponse>(`${environment.apiBaseUrl}/api/real-exams/start`, dto);
  }

  getAttempt(attemptId: string): Observable<AttemptDto> {
    return this.http.get<AttemptDto>(`${environment.apiBaseUrl}/api/real-exams/${attemptId}`);
  }

  submit(dto: SubmitExamDto): Observable<SubmitResultDto> {
    return this.http.post<SubmitResultDto>(`${environment.apiBaseUrl}/api/real-exams/submit`, dto);
  }
}
