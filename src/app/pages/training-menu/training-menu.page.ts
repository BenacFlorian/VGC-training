import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { speedometer, timerOutline, barChartOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.page.html',
  styleUrls: ['./training-menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TrainingMenuPage {
  score: { speedVS: any; speedQuiz: any; defOrDefSpe: any; } | undefined;

  constructor(private router: Router, private localStorageService: LocalStorageService) {
    addIcons({ speedometer, timerOutline, barChartOutline });
  }

  getScore(){
    const speedVS = this.localStorageService.getItem('speedVersusData');
    const speedQuiz = this.localStorageService.getItem('speedQuizData');
    const defOrDefSpe = this.localStorageService.getItem('defOrDefSpeData');
    const score = {
      speedVS: speedVS.score?.percentGoodAnswer,
      speedQuiz: speedQuiz.score?.percentGoodAnswer,
      defOrDefSpe: defOrDefSpe.score?.percentGoodAnswer
    };
    return score;
  }

  goToSpeedVersus(){
    this.router.navigateByUrl('/speed-versus');
  }
  goToSpeedQuiz(){
    this.router.navigateByUrl('/speed-quiz');
  }
  goToDefOrSpedDef(){
    this.router.navigateByUrl('/def-or-spe-def');
  }
}
