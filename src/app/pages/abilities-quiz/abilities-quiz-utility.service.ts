import { Injectable } from '@angular/core';
import { UsageSmogonService } from '../../http/requests/usage-smogon/usage-smogon.service';
import { MovesetSmogonService } from '../../http/requests/moveset-smogon/moveset-smogon.service';
import { UtilityService } from '../../services/utility.service';
import { Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbilitiesService } from '../../http/requests/abilities/abilities.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AbilitiesQuizUtilityService {
  pokemonTopMoveset: any[] | undefined;

  constructor(
    private usageSmogonService: UsageSmogonService,
    private movesetSmogonService: MovesetSmogonService,
    private utilityService: UtilityService,
    private http: HttpClient
  ) { }

  getAbilities(): Observable<string[]> {
    return from(this.initializeData()).pipe(
      map(() => this.utilityService.getAllAbilities(this.pokemonTopMoveset as any[]))
    );
  }

  private async initializeData(): Promise<void> {
    const usageData = await this.usageSmogonService.getUsageData().toPromise();
    const movesetData = await this.movesetSmogonService.getMovesetData().toPromise();

    if(!!movesetData && !!usageData){
      this.pokemonTopMoveset = movesetData.filter(pokemon => 
        usageData.some(usagePokemon => usagePokemon.name === pokemon.name)
      );
    }
  }

  getAbilitiesWithDetails(topAbilities: {name: string, url: string}[]): Observable<any[]> {
    return forkJoin(
      topAbilities.map(ability => {
        return this.http.get<any>(ability.url);
      })
    );
  }
}