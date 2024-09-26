import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AbilitiesQuizUtilityService } from 'src/app/pages/abilities-quiz/abilities-quiz-utility.service';
import { UtilityService } from 'src/app/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class AbilitiesService {
  private apiUrl = 'https://pokeapi.co/api/v2/ability';
  allTopAbilities: {name: string, url: string}[] = [];
  abilitiesWithDetails: any[] = [];
  abilitiesForQuiz: any[] = [];

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private abilitiesQuizUtilityService: AbilitiesQuizUtilityService, private utilityService: UtilityService) { }
  
  getTopAbilities(): Observable<any> {
    const abilities = this.localStorageService.getItem('abilities');
    
    if (!!abilities?.abilities) {
      // Retourne immédiatement un Observable avec les capacités du cache local
      return of(abilities.abilities);
    }
  
    // Utilise forkJoin pour faire les deux appels en parallèle et retourne un Observable
    return forkJoin([
      this.getAllAbilities(),
      this.abilitiesQuizUtilityService.getAbilities()
    ]).pipe(
      switchMap(([allAbilities, topAbilities]) => {
        // Filtre les capacités et récupère les détails
        this.allTopAbilities = this.filterTopAbilities(allAbilities, topAbilities);
        return this.getAbilitiesWithDetails(this.allTopAbilities);
      }),
      tap((abilitiesWithDetails) => {
        // Vérifie si les données dans le localStorage sont différentes avant de les mettre à jour
        const storedAbilities = this.localStorageService.getItem('abilities');
        if (!storedAbilities || JSON.stringify(storedAbilities.abilities) !== JSON.stringify(abilitiesWithDetails)) {
          this.localStorageService.setItem('abilities', { abilities: abilitiesWithDetails });
          this.localStorageService.setItem('abilitiesDate', new Date());
        }
      }),
      catchError((error) => {
        // Gestion des erreurs
        console.error('Erreur lors du chargement des capacités :', error);
        return throwError(() => new Error('Erreur lors du chargement des capacités'));
      })
    );
  }

  getAbilitiesWithDetails(topAbilities: {name: string, url: string}[]): Observable<any[]> {
    return forkJoin(
      topAbilities.map(ability => {
        return this.http.get<any>(ability.url);
      })
    );
  }
  
  filterTopAbilities(allAbilities: any[], quizAbilities: string[]): {name: string, url: string}[] {
    return allAbilities.filter(ability => quizAbilities.includes(ability.name));
  }

  getAllAbilities(): Observable<{name: string, url: string}[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=1000`).pipe(
      map(response => response.results)
    );
  }

  getAbilityDetails(abilityName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ability/${abilityName}`);
  }
}