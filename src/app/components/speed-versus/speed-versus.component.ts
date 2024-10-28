import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

@Component({
  selector: 'comp-speed-versus',
  templateUrl: './speed-versus.component.html',
  styleUrls: ['./speed-versus.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MatCardModule, MatButtonModule]
})
export class SpeedVersusComponent implements OnInit {
  @Input() leftSide!: any;
  @Input() rightSide!: any;
  @Input() whichSpread: 'mostCommon' | 'max' = 'mostCommon';
  @Input() whichPokemon: 'team' | 'random' = 'random';
  
  srcRight: string = '';
  srcLeft: string = '';
  nameLeft: string = '';
  nameRight: string = '';
  speedRight: number = 0;
  speedLeft: number = 0;

  isAnswered: boolean = false;
  hasRightAnswer: boolean | undefined;
  rightAnswer: 'left' | 'right' | 'same' | undefined;
  answerChoose: 'left' | 'right' | 'same' | undefined;
  score: any;

  isLeftSideMaxSpeed: boolean = false;
  isRightSideMaxSpeed: boolean = false;

  percentLeft: number = 0;
  percentRight: number = 0;

  ;

  @Output() resetRequested = new EventEmitter<number>();

  constructor(private localStorageService: LocalStorageService, private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.initSomeValues();
    this.speedLeft = this.getSpeed(this.leftSide, 'left')
    this.speedRight = this.getSpeed(this.rightSide, 'right')
  }

  initSomeValues(){
    this.srcRight = this.rightSide.sprites.front_default;
    this.srcLeft = this.leftSide.sprites.front_default;
    this.nameLeft = this.utilityService.capitalizeFirstLetter(this.leftSide.name);
    this.nameRight = this.utilityService.capitalizeFirstLetter(this.rightSide.name);

    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    if(speedVersusData.score){
      this.score = speedVersusData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0,
        strike: 0,
        bestStrike: 0
      };
      speedVersusData.score = this.score;
      this.localStorageService.setItem('speedVersusData', speedVersusData);
    }
  }

  getSpeed(poke: any, side: 'left' | 'right'): number{
    if(this.whichSpread === 'mostCommon'){ 
      const common = this.getMostCommonSpeed(poke.smogonStats);
      if(side === 'left' && common.percent === 0) this.isLeftSideMaxSpeed = true;
      if(side === 'right' && common.percent === 0) this.isRightSideMaxSpeed = true;
      const maxSpeed = common.speed;
      const coef = common.natureCoeff;
      const iv = coef === 0.9 ? 0 : 31;
      if(side === 'left') this.percentLeft = Math.round(common.percent);
      if(side === 'right') this.percentRight = Math.round(common.percent);
      return Math.trunc(((2*poke.stats[5].base_stat+iv+(maxSpeed/4))*(50/100)+5)*coef);
    }
    if(this.whichSpread === 'max'){
      return Math.trunc(((2*poke.stats[5].base_stat+31+(252/4))*(50/100)+5)*1.1);
    }
    return 0;
  }
  
  getMostCommonSpeed(stats: any): {speed: number, natureCoeff: number, percent: number} {
    // Brave Quiet Sassy Relaxed -10%
    // Jolly Naive Hasty Timid +10%
    const evSpeeds: any[] = [];
    if(!stats || !stats.spread) return {speed: 252, natureCoeff: 1.1, percent: 0};
    stats.spread.forEach((spread: any)=>{
      const speed = spread.name.split('/')[spread.name.split('/').length - 1];
      const ftSpeed = parseFloat(speed) === 4 ? 0 : parseFloat(speed);
      const nature = spread.name.split('/')[0].split(':')[0];
      const natureCoeff = ["Brave", "Quiet", "Sassy", "Relaxed"].includes(nature) ? 0.9 : ["Jolly", "Naive", "Hasty", "Timid"].includes(nature) ? 1.1 : 1;
      const index = evSpeeds.findIndex((speed: any)=> speed.speed === ftSpeed && speed.natureCoeff === natureCoeff);
      if(index === -1){
        evSpeeds.push({
          speed: ftSpeed,
          natureCoeff: natureCoeff,
          percent: parseFloat(spread.percent.replace('%', ''))
        });
      }else{
        evSpeeds[index].percent += parseFloat(spread.percent.replace('%', ''));
      }
    });
    evSpeeds.sort((a: any, b: any)=> b.percent - a.percent);
    return evSpeeds[0];
  }

  answer(side: 'left' | 'right' | 'same'){
    if(this.isAnswered) return;
    this.answerChoose = side;
    this.isAnswered = true;
    if(side === 'left'){
      if(this.speedLeft > this.speedRight){
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

    if(side === 'right'){
      if(this.speedLeft < this.speedRight){
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
      if(this.speedLeft === this.speedRight){
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

    const diff = this.speedLeft - this.speedRight;
    if(diff > 0){
      this.rightAnswer = 'left'
    }
    if(diff < 0){
      this.rightAnswer = 'right';
    }
    if(diff === 0){
      this.rightAnswer = 'same';
    }

    if(!!this.score){
      this.score.percentGoodAnswer = Math.round((this.score.nbGoodAnswer * 100 / (this.score.nbGoodAnswer + this.score.nbBadAnswer)));
    }

    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    speedVersusData.score = this.score;
    this.localStorageService.setItem('speedVersusData', speedVersusData);
  }

  reinitVersus() {
    this.resetRequested.emit(this.hasRightAnswer ? 1 : 0);
  }
}
