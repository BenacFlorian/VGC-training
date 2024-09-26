import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SpeedVersusComponent } from '../../components/speed-versus/speed-versus.component';
import { FormattedPokemon, UsageSmogonService } from '../../http/requests/usage-smogon/usage-smogon.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-speed-versus',
  templateUrl: './speed-versus.page.html',
  styleUrls: ['./speed-versus.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SpeedVersusComponent]
})
export class SpeedVersusPage implements OnInit {
  pokeLeft: any;
  pokeRight: any;
  is2PokeLoaded: boolean = false;
  score: any;

  constructor(private pokemonService: PokemonService, private usageSmogonService: UsageSmogonService, private router: Router, private localStorageService: LocalStorageService) {}

  pokemonTopUsage: FormattedPokemon[] = [];

  ngOnInit() {

    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    this.score = speedVersusData.score;
    this.usageSmogonService.getUsageData().subscribe({
      next: (formattedData) => {
        this.pokemonTopUsage = formattedData;
        this.pokemonService.fetchTwoValidPokemon(this.pokemonTopUsage).subscribe((data)=>{
          this.pokeLeft = data[0];
          this.pokeRight = data[1];
          this.is2PokeLoaded = true;
        });
      },
      error: (error) => {
        window.alert(error);
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  public resetRequested(){
    this.is2PokeLoaded = false;
    this.pokemonService.fetchTwoValidPokemon(this.pokemonTopUsage).subscribe((data)=>{
      this.pokeLeft = data[0];
      this.pokeRight = data[1];
      this.is2PokeLoaded = true;
      const speedVersusData = this.localStorageService.getItem('speedVersusData');
      this.score = speedVersusData.score;
    });
  }

  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }
}
