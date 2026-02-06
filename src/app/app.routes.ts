import { Routes } from '@angular/router';

import { LoginPage } from './pages/login/login';
import { DashboardPage } from './pages/dashboard/dashboard';
import { PracticePage } from './pages/practice/practice';
import { ResultPage } from './pages/result/result';
import { ReviewPage } from './pages/review/review';
import { IntroPage } from './pages/intro/intro/intro';

import { NewsPage } from './pages/news.page/news.page';
import { NewsDetailPage } from './pages/news-detail/news-detail';

import { AdminNewsCreatePage } from './pages/admin-news-create/admin-news-create.page/admin-news-create.page';

import { AdminGuard } from './core/guards/admin.guard';
import { AdminLoginPage } from './pages/admin-login/admin-login.page/admin-login.page';
import { RegisterComponent } from './pages/register/register';
import { AdminRegistrationsPage } from './pages/admin-registrations/admin-registrations.page/admin-registrations.page';

// ✅ NEW: admin registrations page

export const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },

  { path: 'intro', component: IntroPage },

  { path: 'login', component: LoginPage },

  { path: 'dashboard', component: DashboardPage },
  { path: 'practice', component: PracticePage },
  { path: 'result', component: ResultPage },
  { path: 'review', component: ReviewPage },

  // public
  { path: 'register', component: RegisterComponent },
  { path: 'news', component: NewsPage },
  { path: 'news/:slug', component: NewsDetailPage },

  // admin
  { path: 'admin/login', component: AdminLoginPage },

  // ✅ NEW: admin registrations list
  {
    path: 'admin/registrations',
    component: AdminRegistrationsPage,
    canActivate: [AdminGuard],
  },

  {
    path: 'admin/news/new',
    component: AdminNewsCreatePage,
    canActivate: [AdminGuard],
  },

  { path: '**', redirectTo: 'intro' },
];
