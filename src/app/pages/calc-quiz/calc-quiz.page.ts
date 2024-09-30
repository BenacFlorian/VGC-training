import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MovesetSmogonService } from 'src/app/http/requests/moveset-smogon/moveset-smogon.service';
import { CalcQuizComponent } from 'src/app/components/calc-quiz/calc-quiz.component';
import { switchMap } from 'rxjs';
import { CalcQuizService } from './calc-quiz.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-calc-quiz',
  templateUrl: './calc-quiz.page.html',
  styleUrls: ['./calc-quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CalcQuizComponent, MatButtonModule, MatCardModule]
})
export class CalcQuizPage implements OnInit {
  pokeLeft: any;
  pokeRight: any;
  is2PokeLoaded: boolean = false;
  score: any;

  constructor(
    private router: Router,
    private calcQuizService: CalcQuizService, 
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const calcQuizData = this.localStorageService.getItem('calcQuizData');
    this.score = calcQuizData.score;
    this.calcQuizService.getData().subscribe((data) => {
      this.pokeLeft = data.pokeLeft;
      this.pokeRight = data.pokeRight;
      this.is2PokeLoaded = true;
    });
  }
  
  resetRequested(){
    this.is2PokeLoaded = false;
    this.calcQuizService.getData().subscribe((data) => {
      this.pokeLeft = data.pokeLeft;
      this.pokeRight = data.pokeRight;
      const calcQuizData = this.localStorageService.getItem('calcQuizData');
      this.score = calcQuizData.score;
      this.is2PokeLoaded = true;
    });
  }

  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }
}
