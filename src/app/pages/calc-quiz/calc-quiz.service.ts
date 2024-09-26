import { Injectable } from '@angular/core';
import { MovesetSmogonService } from '../../http/requests/moveset-smogon/moveset-smogon.service';
import { PokemonService } from '../../http/requests/pokemon/pokemon.service';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UtilityService } from '../../services/utility.service';
import { MovesService } from '../../http/requests/moves/moves.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalcQuizService {

  constructor(
    private movesetSmogonService: MovesetSmogonService,
    private pokemonService: PokemonService,
    private utilityService: UtilityService,
    private movesService: MovesService,
    private http: HttpClient
  ) { }

  getData(): Observable<any> {
    return this.movesetSmogonService.getTopMoveset().pipe(
      switchMap((pokemonList) => {
        const [pokemon1, pokemon2] = this.utilityService.getRandomElements(pokemonList, 2);
        // const [pokemon1, pokemon2] = [pokemonList[103], pokemonList[1]]; // pour tester le support
        return forkJoin([
          this.getPokemonWithMoves(pokemon1),
          this.getPokemonWithMoves(pokemon2)
        ]);
      }),
      switchMap(([left, right]) => {
        if (this.isSupport(left)) {
          // Recharger deux nouveaux Pokémon si le Pokémon de gauche est un support
          return this.getData();
        } else {
          return of({ pokeLeft: left, pokeRight: right });
        }
      }),
      catchError((error) => {
        console.log('Erreur lors de la récupération des données:', error);
        return this.getData();
      })
    );
  }

  private isSupport(pokemon: any): boolean {
    const statusMoves = ['status', 'other']; // Liste des types de mouvements de statut
    const statusMoveCount = pokemon.moves.filter((move: any) => statusMoves.includes(move.category)).length;
    return statusMoveCount > pokemon.moves.length / 2;
  }

  private getPokemonWithMoves(pokemon: any): Observable<any> {
    const formattedName = pokemon.name.toLowerCase().replace(/ /g, '-');
    return this.pokemonService.getPokemon(formattedName).pipe(
      switchMap((pokemonDetails) => {
        const movesToFetch = pokemon.moves.map((move:any) => move.name.toLowerCase().replace(/ /g, '-'));
        return forkJoin(movesToFetch.filter((move:string) => move !== '-').map((move:string) => {
          return this.movesService.getMove(move);
        })).pipe(
          switchMap((moveDetails) => {
            const ability = this.findTopAbility(pokemon, pokemonDetails);
            const item = this.findTopItem(pokemon);

            // Faire un appel HTTP pour obtenir les détails complets de l'abilité et de l'item
            return forkJoin([
              this.http.get(ability.ability.url),
              this.http.get(`https://pokeapi.co/api/v2/item/${item}`)
            ]).pipe(
              map(([abilityDetails, itemDetails]: [any, any]) => {
                return {
                  ...pokemonDetails,
                  ability: abilityDetails,
                  item: itemDetails,
                  moves: this.getMovesDetailsWithUsages(pokemon, moveDetails).sort((a: any, b: any) => a.usage - b.usage).filter((move: any) => move.damage_class.name !== 'status' && move?.power > 0)
                };
              })
            );
          })
        );
      })
    );
  }

  getMovesDetailsWithUsages(pokemon: any, moveDetails: any) {
    return moveDetails.map((move: any) => {
      return {
        ...move,
        usage: parseFloat(this.getUsage(pokemon, move).replace('%', ''))
      };
    });
  }

  getUsage(pokemon: any, move: any) {
    const moveSd = pokemon.moves.find((m: any) => m.name.toLowerCase().replace(/ /g, '-') === move.name.toLowerCase().replace(/ /g, '-'));
    return moveSd.percent;
  }

  private findTopAbility(pokemon: any, pokemonDetails: any): any {
    const abilityTopUsageShowdown = pokemon.abilities.find((ability: any) => {
      const abilitiesPercent = pokemon.abilities.map((a: any) => a.percent.replace('%', ''));
      return Math.round(ability.percent.replace('%','')) === Math.round(Math.max(...abilitiesPercent));
    });

    return pokemonDetails.abilities.find((ability: any) => 
      ability.ability.name === abilityTopUsageShowdown.name.toLowerCase().replace(/ /, '-')
    );
  }

  private findTopItem(pokemon: any): string {
    const itemTopUsageShowdown = pokemon.items.find((item: any) => {
      const itemsPercent = pokemon.items.map((i: any) => i.percent.replace('%', ''));
      return Math.round(item.percent.replace('%','')) === Math.round(Math.max(...itemsPercent));
    });

    return itemTopUsageShowdown ? itemTopUsageShowdown.name.toLowerCase().replace(/ /g, '-') : '';
  }
}