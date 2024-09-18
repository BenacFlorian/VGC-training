import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormattedPokemon, UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DefOrSpeDefComponent } from 'src/app/components/def-or-spe-def/def-or-spe-def.component';
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

  constructor(private pokemonService: PokemonService, private usageSmogonService: UsageSmogonService, private router: Router) { }

  ngOnInit() {
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
    });
  }
  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }

}
