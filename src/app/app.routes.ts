import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
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
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
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
  {
    path: 'def-or-spe-def',
    loadComponent: () => import('./pages/def-spedef-what-best/def-spedef-what-best.page').then( m => m.DefSpedefWhatBestPage)
  },
  {
    path: 'abilities-quiz',
    loadComponent: () => import('./pages/abilities-quiz/abilities-quiz.page').then( m => m.AbilitiesQuizPage)
  },
  {
    path: 'calc-quiz',
    loadComponent: () => import('./pages/calc-quiz/calc-quiz.page').then( m => m.CalcQuizPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
];
