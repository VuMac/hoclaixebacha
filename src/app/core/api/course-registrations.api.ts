import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type CourseRegistrationStatus = 'new' | 'processing' | 'done' | 'cancel';

export type CourseRegistrationListItemDto = {
  id: string;
  fullName: string;
  phone: string;
  licenseCode: string;
  note?: string | null;
  status: CourseRegistrationStatus;
  createdAt: string; // ISO string
};

export type CreateCourseRegistrationDto = {
  fullName: string;
  phone: string;
  licenseCode: string;
  note?: string | null;
};

export type UpdateCourseRegistrationStatusDto = {
  status: CourseRegistrationStatus;
};

@Injectable({ providedIn: 'root' })
export class CourseRegistrationsApi {
  constructor(private http: HttpClient) {}

  create(dto: CreateCourseRegistrationDto): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/course-registrations`, dto);
  }

  // query status optional: /api/course-registrations?status=new
  list(status?: CourseRegistrationStatus): Observable<CourseRegistrationListItemDto[]> {
    const url =
      status
        ? `${environment.apiBaseUrl}/api/course-registrations?status=${encodeURIComponent(status)}`
        : `${environment.apiBaseUrl}/api/course-registrations`;

    return this.http.get<CourseRegistrationListItemDto[]>(url);
  }

  updateStatus(id: string, dto: UpdateCourseRegistrationStatusDto): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/api/course-registrations/${id}/status`, dto);
  }
}
