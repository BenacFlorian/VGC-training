
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/http/requests/pokemon/pokemon.service';
import { UsageSmogonService } from 'src/app/http/requests/usage-smogon/usage-smogon.service';
import { AbilitiesService } from 'src/app/http/requests/abilities/abilities.service';
import { MovesetSmogonService } from 'src/app/http/requests/moveset-smogon/moveset-smogon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage {

  isDataLoaded = false;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private usageSmogonService: UsageSmogonService,
    private movesetSmogonService: MovesetSmogonService,
    private abilitiesService: AbilitiesService
  ) {}

  discoverPrograms() {
    this.router.navigate(['/training-menu']);
  }

  ngOnInit() {
    forkJoin([
      this.usageSmogonService.getUsageData(),
      this.movesetSmogonService.getTopMoveset(),
      this.abilitiesService.getAllAbilities()
    ]).subscribe(async ([usage, moveset, abilities]) => {
      this.pokemonService.getAllTopPokemon(usage).subscribe((pokemons) => {
        this.isDataLoaded = true;
      });
    });
  }
}
