import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { speedometer, timerOutline, barChartOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import db from 'src/app/services/db.service';
import { forkJoin, from } from 'rxjs';
import { UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { MovesetSmogonService } from 'src/app/http/requests/moveset-smogon/moveset-smogon.service';
import { AbilitiesService } from 'src/app/http/requests/abilities/abilities.service';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.page.html',
  styleUrls: ['./training-menu.page.scss'],
  standalone: true,
  imports: [IonicModule, MatButtonModule, CommonModule, MatCardModule]
})
export class TrainingMenuPage {
  score: { speedVS: any; speedQuiz: any; defOrDefSpe: any; abilitiesQuiz: any; calcQuiz: any; } | undefined;

  constructor(private router: Router, private localStorageService: LocalStorageService, private usageSmogonService: UsageSmogonService, private movesetSmogonService: MovesetSmogonService, private abilitiesService: AbilitiesService, private pokemonService: PokemonService) {
    addIcons({ speedometer, timerOutline, barChartOutline });
  }

  getScore(){
    const speedVS = this.localStorageService.getItem('speedVersusData');
    const speedQuiz = this.localStorageService.getItem('speedQuizData');
    const defOrDefSpe = this.localStorageService.getItem('defOrDefSpeData');
    const abilitiesQuiz = this.localStorageService.getItem('abilitiesQuizData');
    const calcQuiz = this.localStorageService.getItem('calcQuizData');
    const score = {
      speedVS: speedVS.score?.percentGoodAnswer,
      speedQuiz: speedQuiz.score?.percentGoodAnswer,
      defOrDefSpe: defOrDefSpe.score?.percentGoodAnswer,
      abilitiesQuiz: abilitiesQuiz.score?.percentGoodAnswer,
      calcQuiz: calcQuiz.score?.percentGoodAnswer
    };
    return score;
  }
  goToSettings(){
    this.router.navigateByUrl('/settings');
  }

  goToSpeedVersus(){
    this.router.navigateByUrl('/speed-versus');
  }
  goToSpeedQuiz(){
    this.router.navigateByUrl('/speed-quiz');
  }
  goToDefOrSpedDef(){
    this.router.navigateByUrl('/def-or-spe-def');
  }
  goToAbilitiesQuiz(){
    this.router.navigateByUrl('/abilities-quiz');
  }
  goToCalcQuiz(){
    this.router.navigateByUrl('/calc-quiz');
  }
  resetStats(){
    this.localStorageService.removeItem('speedVersusData');
    this.localStorageService.removeItem('speedQuizData');
    this.localStorageService.removeItem('defOrDefSpeData');
    this.localStorageService.removeItem('abilitiesQuizData'); 
    this.localStorageService.removeItem('calcQuizData'); 
  }
  resetData(){
    this.localStorageService.removeItem('usages');
    this.localStorageService.removeItem('usagesDate');
    this.localStorageService.removeItem('topMoveset');
    this.localStorageService.removeItem('topMovesetDate'); 
    this.localStorageService.removeItem('topPokemons');
    this.localStorageService.removeItem('topPokemonsDate'); 
    this.localStorageService.removeItem('abilities');
    this.localStorageService.removeItem('abilitiesDate');
    from(db.pokemons.clear()).subscribe(() => {
      forkJoin([
        this.usageSmogonService.getUsageData(),
        this.movesetSmogonService.getTopMoveset(),
        this.abilitiesService.getAllAbilities()
      ]).subscribe(async ([usage, moveset, abilities]) => {
        this.pokemonService.getAllTopPokemon(usage).subscribe((pokemons) => {
          console.log(pokemons);
        });
      });
    });
    
  }
}
