import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MovesetSmogonService } from 'src/app/http/requests/moveset-smogon/moveset-smogon.service';
import { CalcQuizComponent } from 'src/app/components/calc-quiz/calc-quiz.component';
import { switchMap } from 'rxjs';
import { CalcQuizService } from './calc-quiz.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { forkJoin } from 'rxjs';
import { UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-calc-quiz',
  templateUrl: './calc-quiz.page.html',
  styleUrls: ['./calc-quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CalcQuizComponent, MatButtonModule, MatCardModule, MatButtonToggleModule, ReactiveFormsModule]
})
export class CalcQuizPage implements OnInit {
  pokeLeft: any;
  pokeRight: any;
  is2PokeLoaded: boolean = false;
  score: any;
  whichSpread: 'mostCommon' | 'max' = 'mostCommon';
  isSettingsOpen: boolean = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private calcQuizService: CalcQuizService, 
    private usageSmogonService: UsageSmogonService,
    private movesetSmogonService: MovesetSmogonService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) { 
    this.form = this.fb.group({
      whichSpread: new FormControl(this.whichSpread)
    });
  }

  ngOnInit() {
    const calcQuizData = this.localStorageService.getItem('calcQuizData');
    this.score = calcQuizData.score;
    forkJoin([
      this.calcQuizService.getData(),
      this.movesetSmogonService.getTopMoveset()
    ])
    .subscribe(([data, topMoveset]) => {
      this.pokeLeft = data.pokeLeft;
      this.pokeLeft.smogonStats = this.utilityService.getSmogonStats(data.pokeLeft, topMoveset);
      this.pokeRight = data.pokeRight;
      this.pokeRight.smogonStats = this.utilityService.getSmogonStats(data.pokeRight, topMoveset);
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
