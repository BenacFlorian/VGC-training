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
import { TeamService } from 'src/app/db/team.service';
import { radio } from 'ionicons/icons';

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
  pokemonsTeam: any[] = [];
  topMoveset: any[] = [];
  whichSpread: 'mostCommon' | 'max' = 'mostCommon';
  isSettingsOpen: boolean = false;
  form: FormGroup;
  whichPokemon: 'team' | 'random' = 'team';
  team: any[] = [];
  constructor(
    private pokemonService: PokemonService,
    private usageSmogonService: UsageSmogonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private teamService: TeamService, 
    private movesetSmogonService: MovesetSmogonService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      whichSpread: new FormControl(this.whichSpread),
      whichPokemon: new FormControl(this.whichPokemon)
    });
  }

  ngOnInit() {
    this.is2PokeLoaded = false;
    const speedVersusData = this.localStorageService.getItem('speedVersusData');
    this.score = speedVersusData.score;

    forkJoin([
      this.usageSmogonService.getUsageData(),
      this.movesetSmogonService.getTopMoveset(), 
      this.teamService.getTeam()
    ])
    .subscribe({
      next: ([formattedData, topMoveset, team]) => { 
        this.topMoveset = topMoveset;       
        this.pokemonService.getAllTopPokemon(formattedData).subscribe((pokemons) => {
          this.pokemons = pokemons;
          this.team = team;
          this.initData();
          
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
    this.initData();
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

  initData(){
    let randomPokemons;
    if(this.form.value.whichPokemon === 'team'){
      this.pokemonsTeam = this.pokemons.filter(poke => this.team.map(poke => poke.name.toLowerCase()).includes(poke.name.toLowerCase()));
      const randomTeam = this.utilityService.getTwoRandomPokemons(this.pokemonsTeam) || [];
      const randomRandom = this.utilityService.getTwoRandomPokemons(this.pokemons) || [];
      randomPokemons = [randomTeam[0], randomRandom[0]];
    }else{
      randomPokemons = this.utilityService.getTwoRandomPokemons(this.pokemons) || [];
    }


    this.pokeLeft = JSON.parse(randomPokemons?.[0].data);
    this.pokeLeft.smogonStats = this.utilityService.getSmogonStats(this.pokeLeft, this.topMoveset);
    this.pokeRight = JSON.parse(randomPokemons?.[1].data);
    this.pokeRight.smogonStats = this.utilityService.getSmogonStats(this.pokeRight, this.topMoveset);
  }
}
