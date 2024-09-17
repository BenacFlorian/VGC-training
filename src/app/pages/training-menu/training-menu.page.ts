import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { speedometer, timerOutline, barChartOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.page.html',
  styleUrls: ['./training-menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TrainingMenuPage {
  constructor(private router: Router) {
    addIcons({ speedometer, timerOutline, barChartOutline });
  }

  goToSpeedVersus(){
    this.router.navigateByUrl('/speed-versus');
  }
  goToSpeedQuiz(){
    this.router.navigateByUrl('/speed-quiz');
  }
}
