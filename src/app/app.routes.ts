import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { DashboardPage } from './pages/dashboard/dashboard';
import { PracticePage } from './pages/practice/practice';
import { ResultPage } from './pages/result/result';
import { ReviewPage } from './pages/review/review';
import { IntroPage } from './pages/intro/intro/intro';

export const routes: Routes = [

  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  { path: 'practice', component: PracticePage },
  { path: 'result', component: ResultPage },
  { path: 'review', component: ReviewPage },
  {path: 'intro', component: IntroPage},
  { path: '**', redirectTo: 'dashboard' },

];
