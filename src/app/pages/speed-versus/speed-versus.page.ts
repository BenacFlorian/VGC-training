import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SpeedVersusComponent } from '../../components/speed-versus/speed-versus.component';
import { FormattedPokemon, UsageSmogonService } from '../../http/requests/usage-smogon/usage-smogon.service';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
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
  pokemons: any[] = [];

  constructor(
    private pokemonService: PokemonService,
    private usageSmogonService: UsageSmogonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService
  ) {}


  ngOnInit() {

    this.is2PokeLoaded = false;
    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    this.score = speedVersusData.score;

    this.usageSmogonService.getUsageData().subscribe({
      next: (formattedData) => {        
        this.pokemonService.getAllTopPokemon(formattedData).subscribe((pokemons) => {
          this.pokemons = pokemons;
          const randomPokemons = this.utilityService.getTwoRandomPokemons(pokemons);
          this.pokeLeft = JSON.parse(randomPokemons?.[0].data);
          this.pokeRight = JSON.parse(randomPokemons?.[1].data);
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
    const randomPokemons = this.utilityService.getTwoRandomPokemons(this.pokemons);
    this.pokeLeft = JSON.parse(randomPokemons?.[0].data);
    this.pokeRight = JSON.parse(randomPokemons?.[1].data);
    this.cdr.detectChanges();
    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    this.score = speedVersusData.score;
    timer(150).subscribe(() => {
      this.is2PokeLoaded = true;
    });
  }

  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }
}
