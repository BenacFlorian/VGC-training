import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AbilitiesService {
  private apiUrl = 'https://pokeapi.co/api/v2/ability';

  constructor(private http: HttpClient) { }

  getAllAbilities(): Observable<{name: string, url: string}[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=1000`).pipe(
      map(response => response.results)
    );
  }

  getAbilityDetails(abilityName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ability/${abilityName}`);
  }
}