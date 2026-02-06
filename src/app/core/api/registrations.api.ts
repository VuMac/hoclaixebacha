import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth.store';

export type CourseRegistration = {
    id: string;
    fullName: string;
    phone: string;
    licenseCode: string;
    note?: string | null;
    status: string;
    createdAt: string;
};

export type ListParams = {
    page?: number;
    pageSize?: number;
    q?: string;
    status?: string;
};

@Injectable({ providedIn: 'root' })
export class RegistrationsApi {
    private base = `${environment.apiBaseUrl}/api/registrations`;

    constructor(private auth: AuthStore) { }

    async list(params: ListParams = {}): Promise<{ items: CourseRegistration[]; total: number }> {
        const qs = new URLSearchParams();
        if (params.page) qs.set('page', String(params.page));
        if (params.pageSize) qs.set('pageSize', String(params.pageSize));
        if (params.q) qs.set('q', params.q);
        if (params.status) qs.set('status', params.status);

        const res = await fetch(`${this.base}?${qs.toString()}`, {
            headers: this.authHeader(),
        });

        if (!res.ok) throw new Error(await res.text().catch(() => 'Load failed'));

        const total = Number(res.headers.get('X-Total-Count') || '0');
        const items = (await res.json()) as CourseRegistration[];
        return { items, total };
    }

    async updateStatus(id: string, status: string): Promise<void> {
        const res = await fetch(`${this.base}/${id}/status`, {
            method: 'PATCH',
            headers: {
                ...this.authHeader(),
                'Content-Type': 'application/json',
            },
            // ✅ BE nhận string => body phải là JSON string
            body: JSON.stringify(status.trim().toUpperCase()),
        });

        if (!res.ok) throw new Error(await res.text().catch(() => 'Update failed'));
    }

    private authHeader(): Record<string, string> {
        // Nếu BE chưa bật [Authorize] thì header này có cũng không sao.
        const token = this.auth.token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
