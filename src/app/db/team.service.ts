import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import db from 'src/app/db/db.service';

export interface TeamPokemon {
  id?: number;
  teamId: number;
  pokemonId: string;
  ability: string;
  item: string;
  nature: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  hpStats: number;
  attStats: number;
  defStats: number;
  spAStats: number;
  spDStats: number;
  speStats: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor() {}

  addPokemonToTeam(pokemon: any): Observable<number> {
    return from(db.teamPokemons.add(pokemon));
  }

  clearPokemonFromTeam(): Observable<void> {
    return from(db.teamPokemons.clear());
  }

  getTeam(): Observable<any[]> {
    return from(db.teamPokemons
      .toArray()
    );
  }

}

