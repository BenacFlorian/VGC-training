
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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ItemsService } from 'src/app/http/requests/items/items.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule],
})
export class HomePage {

  isDataLoaded = false;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private usageSmogonService: UsageSmogonService,
    private movesetSmogonService: MovesetSmogonService,
    private abilitiesService: AbilitiesService,
    private itemsService: ItemsService
  ) {}

  discoverPrograms() {
    this.router.navigate(['/training-menu']);
  }

  ngOnInit() {
    forkJoin([
      this.usageSmogonService.getUsageData(),
      this.movesetSmogonService.getTopMoveset(),
      this.abilitiesService.getAllAbilities(),
      this.itemsService.fetchAndStoreItems()
    ]).subscribe(async ([usage, moveset, abilities, items]) => {
      console.log("usage");
      this.pokemonService.getAllTopPokemon(usage).subscribe((pokemons) => {
        console.log("pokemons");
        this.isDataLoaded = true;
      });
    });
  }
}
