import { Injectable } from '@angular/core';
import { HttpService } from '../../http.service';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { FormattedPokemon } from '../usage-smogon/usage-smogon.service';

export interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private indexAlreadyChecked: number[] = [];

  constructor(private httpService: HttpService) { }

  public fetchOneValidPokemon(pokemonTopUsage: FormattedPokemon[]): Observable<string | any> {

    const indexPokeRandom = this.getOneRandomPokemon(pokemonTopUsage);
    const poke = pokemonTopUsage[indexPokeRandom];

    return this.getPokemon(poke.name.toLowerCase()).pipe(
        catchError(error => {
          console.log(`Erreur pour le Pokémon de gauche (${poke.name}):`, error);
          return of('');  // Retourne une chaîne vide au lieu de null
        })
    ).pipe(
      map(([leftPokemon, rightPokemon]) => {
        if (leftPokemon && rightPokemon) {
          return [leftPokemon, rightPokemon];
        } else {
          throw new Error('Un ou les deux Pokémon sont invalides');
        }
      }),
      catchError(() => this.fetchOneValidPokemon(pokemonTopUsage))
    );
  }


  public fetchTwoValidPokemon(pokemonTopUsage: FormattedPokemon[]): Observable<string | any[]> {

    const indexPokeRandom = this.getTwoRandomPokemon(pokemonTopUsage);
    const pokeLeft = pokemonTopUsage[indexPokeRandom[0]];
    const pokeRight = pokemonTopUsage[indexPokeRandom[1]];

    return forkJoin(
      [
        this.getPokemon(pokeLeft.name.toLowerCase()).pipe(
            catchError(error => {
              console.log(`Erreur pour le Pokémon de gauche (${pokeLeft.name}):`, error);
              return of('');  // Retourne une chaîne vide au lieu de null
            })
        ),
        this.getPokemon(pokeRight.name.toLowerCase()).pipe(
            catchError(error => {
              console.log(`Erreur pour le Pokémon de droite (${pokeRight.name}):`, error);
              return of('');  // Retourne une chaîne vide au lieu de null
            })
        )
      ]
    ).pipe(
      map(([leftPokemon, rightPokemon]) => {
        if (leftPokemon && rightPokemon) {
          return [leftPokemon, rightPokemon];
        } else {
          throw new Error('Un ou les deux Pokémon sont invalides');
        }
      }),
      catchError(() => this.fetchTwoValidPokemon(pokemonTopUsage))
    );
  }

  getTwoRandomPokemon(pokemonTopUsage: FormattedPokemon[]): [number, number] {
    const max = pokemonTopUsage.length - 1;
    let first = Math.floor(Math.random() * (max + 1));
    let second = Math.floor(Math.random() * (max + 1));
    
    // S'assurer que les deux nombres sont différents
    while (second === first) {
      second = Math.floor(Math.random() * (max + 1));
    }
    
    return [first, second];
  }
  getOneRandomPokemon(pokemonTopUsage: FormattedPokemon[]): number {
    const max = pokemonTopUsage.length - 1;
    let first = Math.floor(Math.random() * (max + 1));
    
    return first;
  }

  /**
   * Récupère les informations sur un Pokémon spécifique.
   * @param nameOrId Le nom ou l'ID du Pokémon
   * @returns Un Observable contenant les informations sur le Pokémon
   */
  getPokemon(nameOrId: string | number): Observable<any> {
    return this.httpService.get<Pokemon>(`${this.baseUrl}/${nameOrId}`);
  }
}
