import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpeedQuizComponent } from 'src/app/components/speed-quiz/speed-quiz.component';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { FormattedPokemon, UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-speed-quiz',
  templateUrl: './speed-quiz.page.html',
  styleUrls: ['./speed-quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, SpeedQuizComponent, CommonModule]
})
export class SpeedQuizPage implements OnInit {

  public pokemonTopUsage: FormattedPokemon[] = [];
  public poke: any;
  public isPokeLoaded: boolean = false;
  public score: any;
  public pokemons: any[] = [];
  constructor(
    private pokemonService: PokemonService, 
    private usageSmogonService: UsageSmogonService, 
    private router: Router, 
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.isPokeLoaded = false;
    const speedQuizData = this.localStorageService.getItem('speedQuizData');
    this.score = speedQuizData.score;

    this.usageSmogonService.getUsageData().subscribe({
      next: (formattedData) => {        
        this.pokemonService.getAllTopPokemon(formattedData).subscribe((pokemons) => {
          this.pokemons = pokemons;
          const randomPokemons = this.utilityService.getTwoRandomPokemons(pokemons);
          this.poke = JSON.parse(randomPokemons?.[0].data);
          this.isPokeLoaded = true;
        });
      },
      error: (error) => {
        window.alert(error);
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  public resetRequested(){
    this.isPokeLoaded = false;
    const randomPokemons = this.utilityService.getTwoRandomPokemons(this.pokemons);
    this.poke = JSON.parse(randomPokemons?.[0].data);
    this.cdr.detectChanges();
    const speedQuizData = this.localStorageService.getItem('speedQuizData');
    this.score = speedQuizData.score;
    timer(150).subscribe(() => {
      this.isPokeLoaded = true;
    });
  }
  
  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }

}
