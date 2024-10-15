import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Router } from '@angular/router';
import { CrudTeamPokemonDialogComponent } from '../crud-team-pokemon-dialog/crud-team-pokemon-dialog.component';
import { MatDialog } from '@angular/material/dialog';
class Pokemon {
  name: string = '';
  imageUrl: string = '/assets/unknownPokemon.png';
  moves?: string[] = [];
  item: string = '';
  ability: string = '';
  nature: string = '';
  isDefined: boolean = false;
}

@Component({
  selector: 'comp-settings-team',
  templateUrl: './settings-team.component.html',
  styleUrls: ['./settings-team.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatListModule, CommonModule] // Ajouter CommonModule ici
})
export class SettingsTeamComponent implements OnInit {
  @Output() goToSettings = new EventEmitter<void>();

  // { name: 'Pikachu', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', moves: ['Volt Crash', 'PistoVolt'], item: 'Potion' },
  team: Pokemon[] = [];

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    if(this.team.length === 0) {
      this.team = this.initTeam()
    }
  }

  initTeam(): Pokemon[] {
    return [
      new Pokemon(),
      new Pokemon(),
      new Pokemon(),
      new Pokemon(),
      new Pokemon(),
      new Pokemon(),
    ];
  }

  backToSettings() {
    this.goToSettings.emit();
  }

  openDialog(pokemon: Pokemon) {
    if(pokemon.isDefined) {
      return;
    }
    const dialogRef = this.dialog.open(CrudTeamPokemonDialogComponent, {
      width: '90%', 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const indexNotDefined = this.team.findIndex(pokemon => !pokemon.isDefined);
        if(indexNotDefined !== -1) {
          const poke = this.team[indexNotDefined];
          poke.name = result.name;
          poke.moves = result.data.moves;
          poke.item = result.data.item;
          poke.ability = result.data.ability;
          poke.nature = result.data.nature;
          poke.imageUrl = result.data.pokemon.imageUrl;
          this.team[indexNotDefined] = poke;
          this.team[indexNotDefined].isDefined = true;
        }
      }
    });
  } 
}
