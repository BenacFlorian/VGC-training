import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormattedPokemon, UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DefOrSpeDefComponent } from 'src/app/components/def-or-spe-def/def-or-spe-def.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-def-spedef-what-best',
  templateUrl: './def-spedef-what-best.page.html',
  styleUrls: ['./def-spedef-what-best.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DefOrSpeDefComponent]
})
export class DefSpedefWhatBestPage implements OnInit {

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
    const defOrDefSpeData = this.localStorageService.getItem('defOrDefSpeData');
    this.score = defOrDefSpeData.score;

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
    const defOrDefSpeData = this.localStorageService.getItem('defOrDefSpeData');
    this.score = defOrDefSpeData.score;
    timer(150).subscribe(() => {
      this.isPokeLoaded = true;
    });
  }
  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }

}
