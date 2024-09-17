import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
interface ScoreSpeedVersus {
  nbGoodAnswer: number;
  nbBadAnswer: number;  
  percentGoodAnswer: number;
}

@Component({
  selector: 'comp-speed-versus',
  templateUrl: './speed-versus.component.html',
  styleUrls: ['./speed-versus.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SpeedVersusComponent implements OnInit {
  @Input() leftSide!: Pokemon;
  @Input() rightSide!: Pokemon;
  
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
  score: ScoreSpeedVersus | undefined;

  @Output() resetRequested = new EventEmitter<number>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.srcRight = this.rightSide.sprites.front_default;
    this.srcLeft = this.leftSide.sprites.front_default;
    this.nameLeft = this.capitalizeFirstLetter(this.leftSide.name);
    this.nameRight = this.capitalizeFirstLetter(this.rightSide.name);
    this.speedLeft = this.getMaxSpeed(this.leftSide.stats)
    this.speedRight = this.getMaxSpeed(this.rightSide.stats)
    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    if(speedVersusData.score){
      this.score = speedVersusData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0
      };
      speedVersusData.score = this.score;
      this.localStorageService.setItem('speedVersusData', speedVersusData);
    }
  }
  
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getMaxSpeed(stats: any): number{
    const maxSpeed = Math.trunc(((2*stats[5].base_stat+31+(252/4))*(50/100)+5)*1.1);
    return maxSpeed;
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
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
        }
      }
    }

    if(side === 'right'){
      if(this.speedLeft < this.speedRight){
        this.hasRightAnswer = true;
        if(!!this.score){
          this.score.nbGoodAnswer++;
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
        } 
      }
    }
    if(side === 'same'){
      if(this.speedLeft === this.speedRight){
        this.hasRightAnswer = true;
        if(!!this.score){
          this.score.nbGoodAnswer++;
        }
      }else{
        this.hasRightAnswer = false;
        if(!!this.score){
          this.score.nbBadAnswer++;
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
