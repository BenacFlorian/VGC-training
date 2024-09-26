import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  private apiUrl = 'https://pokeapi.co/api/v2/move';

  constructor(private http: HttpClient) { }

  getAllMoves(): Observable<{name: string, url: string}[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=1000`).pipe(
      map(response => response.results)
    );
  }

  getMove(moveName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${moveName}`);
  }

  getMoveDetails(moveUrl: string): Observable<any> {
    return this.http.get<any>(moveUrl);
  }
}