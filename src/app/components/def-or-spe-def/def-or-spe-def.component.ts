import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pokemon } from 'src/app/http/requests/pokemon/pokemon.service';
import { UtilityService } from 'src/app/services/utility.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'comp-def-or-spe-def',
  templateUrl: './def-or-spe-def.component.html',
  styleUrls: ['./def-or-spe-def.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule],
})
export class DefOrSpeDefComponent  implements OnInit {
  @Input() poke!: Pokemon;
  
  @Output() resetRequested = new EventEmitter<number>();

  src: string = '';
  name: string = '';
  def: number = 0;
  speDef: number = 0;

  isAnswered: boolean = false;
  hasRightAnswer: boolean | undefined;
  rightAnswer: 'def' | 'speDef' | 'same' | undefined;
  answerChoose: 'def' | 'speDef' | 'same' | undefined;

  userGuess: 'def' | 'speDef' | 'same' | undefined;
  score: any;


  constructor(private utilityService: UtilityService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.src = this.poke.sprites.front_default;
    this.name = this.utilityService.capitalizeFirstLetter(this.poke.name);
    this.def = this.poke.stats[2].base_stat;
    this.speDef = this.poke.stats[4].base_stat;

    const defOrDefSpeData = this.localStorageService.getItem('defOrDefSpeData');
    if(defOrDefSpeData.score){
      this.score = defOrDefSpeData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0,
        strike: 0,
        bestStrike: 0
      };
      defOrDefSpeData.score = this.score;
      this.localStorageService.setItem('defOrDefSpeData', defOrDefSpeData);
    }
  }

  reinitQuiz(){
    this.resetRequested.emit(this.hasRightAnswer ? 1 : 0);
  }  

  answer(side: 'def' | 'speDef' | 'same'){
    if(this.isAnswered) return;
    this.answerChoose = side;
    this.isAnswered = true;
    if(side === 'def'){
      if(this.def > this.speDef){
        this.hasRightAnswer = true;
        if(!!this.score){
          this.score.nbGoodAnswer++;
          this.score.strike++;
          if(this.score.strike > this.score.bestStrike){
            this.score.bestStrike = this.score.strike;
          }
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
          this.score.strike = 0;
        }
      }
    }

    if(side === 'speDef'){
      if(this.def < this.speDef){
        this.hasRightAnswer = true;
        if(!!this.score){
          this.score.nbGoodAnswer++;
          this.score.strike++;
          if(this.score.strike > this.score.bestStrike){
            this.score.bestStrike = this.score.strike;
          }
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
          this.score.strike = 0;
        } 
      }
    }
    if(side === 'same'){
      if(this.def === this.speDef){
        this.hasRightAnswer = true;
        if(!!this.score){
          this.score.nbGoodAnswer++;
          this.score.strike++;
          if(this.score.strike > this.score.bestStrike){
            this.score.bestStrike = this.score.strike;
          }
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
          this.score.strike = 0;
        }
      }
    }

    const diff = this.def - this.speDef;
    if(diff > 0){
      this.rightAnswer = 'def'
    }
    if(diff < 0){
      this.rightAnswer = 'speDef';
    }
    if(diff === 0){
      this.rightAnswer = 'same';
    }

    if(!!this.score){
      this.score.percentGoodAnswer = Math.round((this.score.nbGoodAnswer * 100 / (this.score.nbGoodAnswer + this.score.nbBadAnswer)));
    }

    const defOrDefSpeData = this.localStorageService.getItem('defOrDefSpeData');
    defOrDefSpeData.score = this.score;
    this.localStorageService.setItem('defOrDefSpeData', defOrDefSpeData);
  }
}
