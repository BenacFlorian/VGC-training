import { Injectable } from '@angular/core';
import { HttpService } from '../../http.service';
import { catchError, forkJoin, map, Observable, of, EMPTY, switchMap, from } from 'rxjs';
import { UtilityService } from '../../../services/utility.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import db from 'src/app/services/db.service';

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

  public pokemons: any;

  constructor(
    private httpService: HttpService, 
    private utilityService: UtilityService, 
    private localStorageService: LocalStorageService
  ) {}

  public getAllTopPokemon(topPokemon: any[]): Observable<any[]> {
    return from(db.pokemons.count()).pipe(
      switchMap(pokemonCount => {
        const cachedTopPokemonDate = this.localStorageService.getItem('topPokemonsDate');
        const isCacheValid = cachedTopPokemonDate && 
          new Date(cachedTopPokemonDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
        
        if (pokemonCount > 0 && isCacheValid) {
          // Si des Pokémon existent déjà et que la date en cache est valide, on les retourne
          return from(db.pokemons.toArray());
        }
  
        // Si pokemonCount == 0 ou le cache est invalide, on doit recharger les données
        return from(db.pokemons.clear()).pipe(  // On supprime toutes les lignes existantes
          switchMap(() => 
            forkJoin(
              topPokemon.map(pokemon => this.getPokemon(pokemon.name.toLowerCase()))
            )
          ),
          switchMap(pokemons => {
            // Après avoir vidé la base, on insère les nouveaux Pokémon
            return this.insertPokemons(pokemons).pipe(
              switchMap(() => {
                // Mise à jour de la date en cache et retour des Pokémon
                this.localStorageService.setItem('topPokemonsDate', new Date());
                return of(pokemons);
              })
            );
          })
        );
      })
    );
  }

  public getPokemons(){
    return this.pokemons;
  }
  public getPokemonFromDB(name: string): any {
    const formattedName = this.utilityService.sanitizeName(name);
    return db.pokemons.where('name').equals(formattedName).first();
  }
  public getPokemonsFromDB(): any {
    return db.pokemons.toArray();
  }

  insertPokemons(pokemons: any[]): Observable<number> {
    return from(
      db.pokemons.bulkAdd(
        pokemons.map(pokemon => ({
          name: pokemon.name,
          data: JSON.stringify(pokemon),
        }))
      )
    );
  }

  public fetchOneValidPokemon(pokemonTopUsage: any[]): Observable<any> {
    const indexPokeRandom = this.getOneRandomPokemon(pokemonTopUsage);
    const poke = pokemonTopUsage[indexPokeRandom];

    return this.getPokemon(poke.name.toLowerCase()).pipe(
      catchError(error => {
        console.log(`Erreur pour le Pokémon (${poke.name}):`, error);
        return of('');  // Utiliser EMPTY au lieu de of('')
      }),
      map(pokemon => {
        if (pokemon) {
          return pokemon;
        } else {
          throw new Error('Le Pokémon est invalide');
        }
      }),
      catchError(() => this.fetchOneValidPokemon(pokemonTopUsage))
    );
  }

  public fetchTwoValidPokemon(pokemonTopUsage: any[]): Observable<string | any[]> {

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

  getTwoRandomPokemon(pokemonTopUsage: any[]): [number, number] {
    const max = pokemonTopUsage.length - 1;
    let first = Math.floor(Math.random() * (max + 1));
    let second = Math.floor(Math.random() * (max + 1));
    
    // S'assurer que les deux nombres sont différents
    while (second === first) {
      second = Math.floor(Math.random() * (max + 1));
    }
    
    return [first, second];
  }
  getOneRandomPokemon(pokemonTopUsage: any[]): number {
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
    const formattedName = this.utilityService.sanitizeName(nameOrId);
    return this.httpService.get<Pokemon>(`${this.baseUrl}/${formattedName}`);
  }

  getAllPokemon(): Observable<any> {
    return this.httpService.get<Pokemon>(`${this.baseUrl}?limit=10000`);
  }
}
