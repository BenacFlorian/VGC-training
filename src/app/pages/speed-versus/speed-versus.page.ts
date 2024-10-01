import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SpeedVersusComponent } from '../../components/speed-versus/speed-versus.component';
import { UsageSmogonService } from '../../http/requests/usage-smogon/usage-smogon.service';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatCardModule } from '@angular/material/card';
import { MovesetSmogonService } from 'src/app/http/requests/moveset-smogon/moveset-smogon.service';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-speed-versus',
  templateUrl: './speed-versus.page.html',
  styleUrls: ['./speed-versus.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SpeedVersusComponent, MatCardModule, MatButtonModule, MatButtonToggleModule, ReactiveFormsModule]
})
export class SpeedVersusPage implements OnInit {
  pokeLeft: any;
  pokeRight: any;
  is2PokeLoaded: boolean = false;
  score: any;
  pokemons: any[] = [];
  topMoveset: any[] = [];
  whichSpread: 'mostCommon' | 'max' = 'mostCommon';
  isSettingsOpen: boolean = false;
  form: FormGroup;

  constructor(
    private pokemonService: PokemonService,
    private usageSmogonService: UsageSmogonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private movesetSmogonService: MovesetSmogonService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      whichSpread: new FormControl(this.whichSpread)
    });
  }

  ngOnInit() {
    this.is2PokeLoaded = false;
    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    this.score = speedVersusData.score;

    forkJoin([
      this.usageSmogonService.getUsageData(),
      this.movesetSmogonService.getTopMoveset()
    ])
    .subscribe({
      next: ([formattedData, topMoveset]) => { 
        this.topMoveset = topMoveset;       
        this.pokemonService.getAllTopPokemon(formattedData).subscribe((pokemons) => {
          this.pokemons = pokemons;
          const randomPokemons = this.utilityService.getTwoRandomPokemons(pokemons);
          this.pokeLeft = JSON.parse(randomPokemons?.[0].data);
          this.pokeLeft.smogonStats = this.getSmogonStats(this.pokeLeft, topMoveset);
          this.pokeRight = JSON.parse(randomPokemons?.[1].data);
          this.pokeRight.smogonStats = this.getSmogonStats(this.pokeRight, topMoveset);
          this.is2PokeLoaded = true;
        });
      },
      error: (error) => {
        window.alert(error);
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  getSmogonStats(poke: any, formattedData: any[]): any {
    const smogonStats = formattedData.find((pokemon) => this.utilityService.sanitizeName(pokemon.name.toLowerCase()) === poke.name.toLowerCase());
    return smogonStats;
  }

  public resetRequested(){
    this.is2PokeLoaded = false;
    const randomPokemons = this.utilityService.getTwoRandomPokemons(this.pokemons);
    this.pokeLeft = JSON.parse(randomPokemons?.[0].data);
    this.pokeLeft.smogonStats = this.getSmogonStats(this.pokeLeft, this.topMoveset);
    this.pokeRight = JSON.parse(randomPokemons?.[1].data);
    this.pokeRight.smogonStats = this.getSmogonStats(this.pokeRight, this.topMoveset);
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
