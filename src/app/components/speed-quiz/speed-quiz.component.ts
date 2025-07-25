import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from 'src/app/http/requests/pokemon/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatButtonModule } from '@angular/material/button';

interface ScoreSpeedQuiz {
  nbGoodAnswer: number;
  nbBadAnswer: number;  
  percentGoodAnswer: number;
}
@Component({
  selector: 'comp-speed-quiz',
  templateUrl: './speed-quiz.component.html',
  styleUrls: ['./speed-quiz.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule],
})
export class SpeedQuizComponent  implements OnInit {
  @Input() poke!: Pokemon;
  
  @Output() resetRequested = new EventEmitter<number>();

  src: string = '';
  name: string = '';
  speed: number = 0;

  isAnswered: boolean = false;
  hasRightAnswer: boolean | undefined;
  rightAnswer: number | undefined;
  answerChoose: number | undefined;

  userGuess: number | undefined;
  score: any;

  constructor(private utilityService: UtilityService, private localStorageService: LocalStorageService)  { }

  ngOnInit() {
    this.src = this.poke.sprites.front_default;
    this.name = this.utilityService.capitalizeFirstLetter(this.poke.name);
    this.speed = this.getMaxSpeed(this.poke.stats);

    const speedQuizData = this.localStorageService.getItem('speedQuizData');
    if(speedQuizData.score){
      this.score = speedQuizData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0,
        strike: 0,
        bestStrike: 0
      };
      speedQuizData.score = this.score;
      this.localStorageService.setItem('speedQuizData', speedQuizData);
    }
  }

  reinitQuiz(){
    this.resetRequested.emit(this.hasRightAnswer ? 1 : 0);
  }
  
  getMaxSpeed(stats: any): number{
    const maxSpeed = Math.trunc(((2*stats[5].base_stat+31+(252/4))*(50/100)+5)*1.1);
    return maxSpeed;
  }

  validateGuess() {
    if(this.isAnswered) return;
    if (this.userGuess === this.speed) {
      this.hasRightAnswer = true;
      if(!!this.score){
        this.score.nbGoodAnswer++;
        this.score.strike++;
        if(this.score.strike > this.score.bestStrike){
          this.score.bestStrike = this.score.strike;
        }
      }
    } else {
      this.hasRightAnswer = false;
      if(!!this.score){
        this.score.nbBadAnswer++;
        this.score.strike = 0;
      }
    }
    if(!!this.score){
      this.score.percentGoodAnswer = Math.round((this.score.nbGoodAnswer * 100 / (this.score.nbGoodAnswer + this.score.nbBadAnswer)));
    }
    this.isAnswered = true;
    this.localStorageService.setItem('speedQuizData', { score: this.score});
  }
}
