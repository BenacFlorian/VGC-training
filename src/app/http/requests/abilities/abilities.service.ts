import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AbilitiesService {
  private apiUrl = 'https://pokeapi.co/api/v2/ability';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  getAllAbilities(): Observable<{name: string, url: string}[]> {
    const cachedAbilities = this.localStorageService.getItem('abilities');
    const cachedAbilitiesDate = this.localStorageService.getItem('abilitiesDate');
    if (!!cachedAbilities.abilities && !!cachedAbilitiesDate.date && new Date(cachedAbilitiesDate.date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
      return of(cachedAbilities.abilities);
    }
    return this.http.get<any>(`${this.apiUrl}?limit=1000`).pipe(
      map(response => response.results)
    );
  }

  getAbilityDetails(abilityName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ability/${abilityName}`);
  }
}