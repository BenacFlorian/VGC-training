import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'comp-abilities-quiz',
  templateUrl: './abilities-quiz.component.html',
  styleUrls: ['./abilities-quiz.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AbilitiesQuizComponent implements OnInit {
  @Input() abilities: any[] = [];
  @Output() resetRequested = new EventEmitter<number>();
  
  selectedAbilityIndex: 0 | 1 | 2 | 3 | undefined;
  options: any[] = [];
  description: string | undefined;

  isAnswered: boolean = false;
  hasRightAnswer: boolean | undefined;
  rightAnswer:  0 | 1 | 2 | 3 | undefined;
  answerChoose:   0 | 1 | 2 | 3 | undefined;
  score: any;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.selectRandomAbility();
    const abilitiesQuizData = this.localStorageService.getItem('abilitiesQuizData');
    if(abilitiesQuizData.score){
      this.score = abilitiesQuizData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0, 
        strike: 0, 
        bestStrike: 0
      };
      abilitiesQuizData.score = this.score;
      this.localStorageService.setItem('abilitiesQuizData', abilitiesQuizData);
    }
  }

  selectRandomAbility() {
    this.selectedAbilityIndex  = Math.floor(Math.random() * 4)  as 0 | 1 | 2 | 3;
    const selectedAbility = this.abilities[this.selectedAbilityIndex];
    const effect_entries = selectedAbility.effect_entries.find((entry: any) => entry.language.name === 'en');
    const flavor_text_entries = selectedAbility.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
    this.description = effect_entries?.effect || flavor_text_entries?.flavor_text;
    if(!this.description || this.description.trim() === ''){
      this.reinitQuiz();
    }
  }

  answer(answer: 0 | 1 | 2 | 3){
    if(this.isAnswered) return;
    this.answerChoose = answer;
    this.isAnswered = true;

    if(answer == this.selectedAbilityIndex){
      this.hasRightAnswer = true;
      this.score.strike++;
      if(this.score.strike > this.score.bestStrike){
        this.score.bestStrike = this.score.strike;
      }
      this.score.nbGoodAnswer++;
    }else{
      this.hasRightAnswer = false;
      this.score.strike = 0;
      this.score.nbBadAnswer++;
    }

    this.rightAnswer = this.selectedAbilityIndex as 0 | 1 | 2 | 3;
    if(!!this.score){
      this.score.percentGoodAnswer = Math.round((this.score.nbGoodAnswer * 100 / (this.score.nbGoodAnswer + this.score.nbBadAnswer)));
    }
    const abilitiesQuizData = this.localStorageService.getItem('abilitiesQuizData');
    abilitiesQuizData.score = this.score;
    this.localStorageService.setItem('abilitiesQuizData', abilitiesQuizData);
  }
  
  reinitQuiz(){
    this.resetRequested.emit(1);
  }
}
