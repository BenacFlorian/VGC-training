import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Router } from '@angular/router';
import { CrudTeamPokemonDialogComponent } from '../crud-team-pokemon-dialog/crud-team-pokemon-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from 'src/app/db/team.service';
class Pokemon {
  name: string = '';
  imageUrl: string = '/assets/unknownPokemon.png';
  moves?: string[] = [];
  item: string = '';
  ability: string = '';
  nature: string = '';
  isDefined: boolean = false;
  data: any;
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

  constructor(private teamService: TeamService, private dialog: MatDialog) {}

  ngOnInit() {
    this.team = this.initTeam();
    this.teamService.getTeam().subscribe(team => {
      if(this.team.length > 0) {
        team.forEach(poke => {
          this.team[poke.index].name = poke.name;
          this.team[poke.index].moves = poke.data.moves;
          this.team[poke.index].item = poke.data.item;
          this.team[poke.index].ability = poke.data.ability;
          this.team[poke.index].nature = poke.data.nature;
          this.team[poke.index].isDefined = true;
          this.team[poke.index].imageUrl = poke.data.pokemon.imageUrl;
          this.team[poke.index].data = poke.data;
        });
      }
    });
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
          poke.data = result.data;
          this.team[indexNotDefined] = poke;
          this.team[indexNotDefined].isDefined = true;
          this.teamService.addPokemonToTeam({
            index:indexNotDefined,
            name:poke.name,
            data:result.data
          }).subscribe();
        }
      }
    });
  } 
}
