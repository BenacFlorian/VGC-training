import { Component, OnInit } from '@angular/core';
import { AbilitiesQuizUtilityService } from './abilities-quiz-utility.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AbilitiesQuizComponent } from 'src/app/components/abilities-quiz/abilities-quiz.component';
import { Router } from '@angular/router';
import { AbilitiesService } from '../../http/requests/abilities/abilities.service';
import { forkJoin, timer } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-abilities-quiz',
  templateUrl: './abilities-quiz.page.html',
  styleUrls: ['./abilities-quiz.page.scss'],
  providers: [AbilitiesQuizUtilityService],
  standalone: true,
  imports: [IonicModule, CommonModule, AbilitiesQuizComponent]
})
export class AbilitiesQuizPage implements OnInit {
  abilities: string[] = [];
  isQuestionCreated: boolean = false;
  abilitiesWithDetails: any[] = [];
  abilitiesForQuiz: any[] = [];
  score: any;

  constructor(
    private abilitiesQuizUtilityService: AbilitiesQuizUtilityService,
    private abilitiesService: AbilitiesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    const abilitiesQuizData = this.localStorageService.getItem('abilitiesQuizData');
    this.score = abilitiesQuizData.score;
    this.loadAbilities();
  }

  public resetRequested(){
    this.isQuestionCreated = false;
    const abilitiesQuizData = this.localStorageService.getItem('abilitiesQuizData');
    this.score = abilitiesQuizData.score;
    this.cdr.detectChanges();
    timer(150).subscribe(() => {
      this.loadAbilities();
    });
  }
  

  loadAbilities() {
    this.abilitiesService.getTopAbilities()
      .subscribe((abilitiesWithDetails) => {
        this.abilitiesForQuiz = this.utilityService.getRandomElements(abilitiesWithDetails);
        this.isQuestionCreated = true;
      })
  }

  backToMenu() {
    this.router.navigateByUrl('/training-menu');
  }
}
