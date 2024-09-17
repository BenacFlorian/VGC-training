import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpService } from '../../http.service';
import { CapacitorHttp } from '@capacitor/core';

export interface FormattedPokemon {
  name: string;
  rankUse: string;
  percentUse: number;
  percentRealUsage: number;
  rawUsage: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsageSmogonService {
  private baseUrl = 'https://www.smogon.com/stats/';

  constructor(
    private httpService:HttpService,
    private http: HttpClient,
    private platform: Platform
  ) { }

  getUsageData(): Observable<FormattedPokemon[]> {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    return this.findValidUrl(formattedDate).pipe(
      switchMap(url => {
        return this.http.get(url, { responseType: 'text' })
      }),
      map(content => this.formatUsage(content))
    );
  }

  private findValidUrl(date: string, letter: string = 'z'): Observable<string> {
    if (letter < 'a') {
      return throwError(() => new Error('Aucune URL valide trouvée'));
    }

    const url = `${this.baseUrl}${date}/gen9vgc2024reg${letter}bo3-1760.txt`;

    return from(CapacitorHttp.get({ url })).pipe(
      switchMap(response => {
        if (response.status >= 200 && response.status < 300) {
          return of(url);
        } else {
          return throwError(() => new Error(`HTTP error! status: ${response.status}`));
        }
      }),
      catchError((err) => {
        console.error('Error fetching URL:', url, err);
        return this.findValidUrl(date, String.fromCharCode(letter.charCodeAt(0) - 1));
      })
    );
  }

  // ----------------------------------------------------------------------------------------------

  private formatUsage(content: string): FormattedPokemon[] {
    return content.split('\n').filter(this.isPokemonLine).map(line => this.formatPokemonLine(line)).filter((poke)=> poke.rawUsage > 1500);
  }

  private isPokemonLine(line: string): boolean {
    const regex = /^\|\s+\d/;
    return regex.test(line.trim());
  }

  private formatPokemonLine(line: string): FormattedPokemon {
    const lineSplitted = line.trim().split('|');
    return {
      name: lineSplitted[2].trim(),
      rankUse: lineSplitted[1].trim(),
      rawUsage: parseFloat(lineSplitted[4].trim()),
      percentUse: Math.round(parseFloat(lineSplitted[3].trim().replace('%',''))),
      percentRealUsage: Math.round(parseFloat(lineSplitted[7].trim().replace('%',''))),
    };
  }
}
