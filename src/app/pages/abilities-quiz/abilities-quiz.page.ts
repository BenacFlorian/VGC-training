import { Component, OnInit } from '@angular/core';
import { AbilitiesQuizUtilityService } from './abilities-quiz-utility.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AbilitiesQuizComponent } from 'src/app/components/abilities-quiz/abilities-quiz.component';
import { Router } from '@angular/router';
import { AbilitiesService } from '../../http/requests/abilities/abilities.service';
import { forkJoin } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { LocalStorageService } from '../../services/local-storage.service';

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
  allTopAbilities: {name: string, url: string}[] = [];
  isQuestionCreated: boolean = false;
  abilitiesWithDetails: any[] = [];
  abilitiesForQuiz: any[] = [];
  score: any;

  constructor(
    private abilitiesQuizUtilityService: AbilitiesQuizUtilityService,
    private abilitiesService: AbilitiesService,
    private router: Router,
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
    this.loadAbilities();
  }

  loadAbilities() {
    forkJoin([
      this.abilitiesService.getAllAbilities(),
      this.abilitiesQuizUtilityService.getAbilities()
    ]).subscribe(
      ([allAbilities, quizAbilities]) => {

        if(JSON.stringify(this.localStorageService.getItem('abilities').abilities) !== JSON.stringify(allAbilities)) {            
          this.localStorageService.setItem('abilities', {
            abilities: allAbilities,
          });
          this.localStorageService.setItem('abilitiesDate', {
            date: new Date(),
          });
        }
        this.allTopAbilities = this.filterTopAbilities(allAbilities, quizAbilities);
        this.abilitiesQuizUtilityService.getAbilitiesWithDetails(this.allTopAbilities)
          .subscribe((abilitiesWithDetails) => {
            this.abilitiesWithDetails = abilitiesWithDetails;
            this.abilitiesForQuiz = this.utilityService.getRandomElements(this.abilitiesWithDetails);
            this.isQuestionCreated = true;
            console.log('Capacités principales chargées :', this.abilitiesWithDetails);
          });
      },
      (error) => {
        console.error('Erreur lors du chargement des capacités :', error);
      }
    );
  }

  filterTopAbilities(allAbilities: any[], quizAbilities: string[]): {name: string, url: string}[] {
    return allAbilities.filter(ability => quizAbilities.includes(ability.name));
  }

  backToMenu() {
    this.router.navigateByUrl('/training-menu');
  }
}
