import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { CalcQuizComponentService } from './calc-quiz.service';
import { Pokemon } from '@smogon/calc';
import { UtilityService } from 'src/app/services/utility.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'comp-calc-quiz',
  templateUrl: './calc-quiz.component.html',
  styleUrls: ['./calc-quiz.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CalcQuizComponent implements OnInit {
  @Input() leftSide!: any;
  @Input() rightSide!: any;
  @Output() resetRequested = new EventEmitter<number>();

  srcRight: string = '';
  srcLeft: string = '';
  nameLeft: string = '';
  nameRight: string = '';

  isAnswered: boolean = false;
  hasRightAnswer: boolean | undefined;
  rightAnswer: Partial<{ minDamage: number, maxDamage: number, result: 'KO' | '50-' | '50+', calc: string }> = {};
  answerChoose: 'KO' | '50-' | '50+' | undefined;

  randomAttack: any;
  srcType: string = '';
  nameAttack: string = '';
  srcCategory: string = '';
  powerAttack: number = 0;
  score: any;

  pokemonLeft: any;
  pokemonRight: any;
  items: any = undefined;
  calc: any;
  constructor(private calcQuizComponentService: CalcQuizComponentService, public utilityService: UtilityService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.srcRight = this.rightSide.sprites.front_default;
    this.srcLeft = this.leftSide.sprites.front_default;
    
    const calcQuizData = this.localStorageService.getItem('calcQuizData');
    if(calcQuizData.score){
      this.score = calcQuizData.score;
    }else{
      this.score = {
        nbGoodAnswer: 0,
        nbBadAnswer: 0,
        percentGoodAnswer: 0,
        strike: 0,
        bestStrike: 0
      };
      calcQuizData.score = this.score;
      this.localStorageService.setItem('calcQuizData', calcQuizData);
    }

    const quizSetup = this.calcQuizComponentService.setupQuiz(this.leftSide, this.rightSide);
    if(!quizSetup){
      this.resetRequested.emit();
      return;
    }
    // faut créer un set complet du pokemon de gauche
    this.leftSide.name = this.sanitizeName(this.leftSide.name);
    this.rightSide.name = this.sanitizeName(this.rightSide.name);
    this.pokemonLeft = new Pokemon(9, this.leftSide.name, {
      moves: this.leftSide.moves.map((move: any) => move.name),
      ability: this.leftSide.ability.name,
      item: this.leftSide.item.name,
      nature: quizSetup.categoryAttack === 'special' ? 'modest'  : 'adamant',
      evs: { [quizSetup.categoryAttack === 'special' ? 'spa' : 'atk']: 252 },
      ivs: { [quizSetup.categoryAttack === 'special' ? 'spa' : 'atk']: 31 },
      boosts: {}
    });
    this.pokemonRight = new Pokemon(9, this.rightSide.name, {
      moves: this.rightSide.moves.map((move: any) => move.name),
      ability: this.rightSide.ability.name,
      item: this.rightSide.item.name,
      nature: quizSetup.categoryAttack === 'special' ? 'calm'  : 'bold',
      evs: { [quizSetup.categoryAttack === 'special' ? 'spd' : 'def']: 252, 'hp': 252 },
      ivs: { [quizSetup.categoryAttack === 'special' ? 'spd' : 'def']: 31, 'hp': 31 },
      boosts: {}
    });
    this.items = {
      left: {
        name: !!this.leftSide.item.names.find((name: any) => name.language.name === 'en') ? this.leftSide.item.names.find((name: any) => name.language.name === 'en').name : this.leftSide.item.name,
        src: this.leftSide.item.sprites.default,
      },
      right: {
        name: !!this.rightSide.item.names.find((name: any) => name.language.name === 'en') ? this.rightSide.item.names.find((name: any) => name.language.name === 'en').name : this.rightSide.item.name,
        src: this.rightSide.item.sprites.default,
      },
    }
    this.randomAttack = quizSetup.randomAttack;
    this.nameAttack = quizSetup.nameAttack;
    this.srcCategory = quizSetup.srcCategory;
    this.powerAttack = quizSetup.powerAttack;
    this.srcType = quizSetup.srcType;
  }

  sanitizeName(name: any) {
    if(name === 'basculegion-male') return 'basculegion';
    if(name === 'basculegion-female') return 'basculegion-f';
    if(name === 'indeedee-female') return 'indeedee-f';
    if(name === 'indeedee-male') return 'indeedee';
    if(name === 'lycanroc-midday') return 'lycanroc';
    if(name === 'mimikyu-disguised') return 'mimikyu';
    if(name === 'toxtricity-amped') return 'toxtricity';
    if(name === 'tatsugiri-curly') return 'tatsugiri';
    if(name === 'maushold-family-of-four') return 'maushold';
    if(name === 'palafin-zero') return 'palafin';
    if(name === 'tauros-paldea-blaze-breed') return 'tauros-paldea-blaze';
    if(name === 'tauros-paldea-aqua-breed') return 'tauros-paldea-aqua';
    return name;
  }

  answer(answer: string) {
    if(this.isAnswered) return;
    this.answerChoose = answer as 'KO' | '50-' | '50+';
    const rightAnswer = this.calcQuizComponentService.calculateKO(this.leftSide, this.rightSide, this.randomAttack);
    this.rightAnswer = rightAnswer;
    this.isAnswered = true;
    this.hasRightAnswer = this.answerChoose === rightAnswer.result;
    this.calc = rightAnswer.calc;
    if(this.hasRightAnswer){
      this.score.nbGoodAnswer++;
      this.score.strike++;
      if(this.score.strike > this.score.bestStrike){
        this.score.bestStrike = this.score.strike;
      }
    }else{
      this.score.nbBadAnswer++;
      this.score.strike = 0;      
    }

    if(!!this.score){
      this.score.percentGoodAnswer = Math.round((this.score.nbGoodAnswer * 100 / (this.score.nbGoodAnswer + this.score.nbBadAnswer)));
    }

    const calcQuizData = this.localStorageService.getItem('calcQuizData');
    calcQuizData.score = this.score;
    this.localStorageService.setItem('calcQuizData', calcQuizData);
  }

  reinitVersus() {
    // Implémentez la logique de réinitialisation ici si nécessaire
    this.resetRequested.emit();
  }
}
