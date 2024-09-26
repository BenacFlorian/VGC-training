import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpeedQuizComponent } from 'src/app/components/speed-quiz/speed-quiz.component';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { FormattedPokemon, UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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

  constructor(private pokemonService: PokemonService, private usageSmogonService: UsageSmogonService, private router: Router, private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    const speedQuizData = this.localStorageService.getItem('speedQuizData');
    this.score = speedQuizData.score;
    this.usageSmogonService.getUsageData().subscribe({
      next: (formattedData) => {
        this.pokemonTopUsage = formattedData;
        this.pokemonService.fetchOneValidPokemon(this.pokemonTopUsage).subscribe((data)=>{
          this.poke = data;
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
    this.pokemonService.fetchOneValidPokemon(this.pokemonTopUsage).subscribe((data)=>{
      this.poke = data;
      this.isPokeLoaded = true;
      const speedQuizData = this.localStorageService.getItem('speedQuizData');
      this.score = speedQuizData.score;
    });
  }
  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }

}
