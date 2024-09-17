import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from 'src/app/http/requests/pokemon/pokemon.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'comp-speed-quiz',
  templateUrl: './speed-quiz.component.html',
  styleUrls: ['./speed-quiz.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
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

  constructor() { }

  ngOnInit() {}

  reinitQuiz(){
    this.resetRequested.emit(this.hasRightAnswer ? 1 : 0);
  }

}
