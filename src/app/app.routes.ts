import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'training-menu',
    loadComponent: () => import('./pages/training-menu/training-menu.page').then((m) => m.TrainingMenuPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'training-menu',
    loadComponent: () => import('./pages/training-menu/training-menu.page').then( m => m.TrainingMenuPage)
  },
  {
    path: 'speed-versus',
    loadComponent: () => import('./pages/speed-versus/speed-versus.page').then( m => m.SpeedVersusPage)
  },
  {
    path: 'speed-quiz',
    loadComponent: () => import('./pages/speed-quiz/speed-quiz.page').then( m => m.SpeedQuizPage)
  },
];
