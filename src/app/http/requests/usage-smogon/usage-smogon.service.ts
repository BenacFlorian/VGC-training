import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { from, Observable, of, throwError, take, switchMap, map, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../../http.service';
import { CapacitorHttp } from '@capacitor/core';
import { subMonths } from 'date-fns';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RulesetService } from 'src/app/db/ruleset.service';

@Injectable({
  providedIn: 'root'
})
export class UsageSmogonService {
  private baseUrl = 'https://www.smogon.com/stats/';
  public usages: any[] | undefined;

  constructor(
    private http: HttpClient,
    private rulesetService: RulesetService,
    private localStorageService: LocalStorageService
  ) { }

  getUsageData(): Observable<any[]> {
    const usages = this.localStorageService.getItem('usages');
    const usagesDate = this.localStorageService.getItem('usagesDate');
    const today = new Date();
    const usagesDateObj = new Date(usagesDate);
    if (usages && usagesDateObj.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
      return of(usages);
    }

    return this.getUrl().pipe(
      switchMap(url => this.http.get(url, { responseType: 'text' })),
      map(response => this.formatUsage(response)),
      tap(formattedData => {
        this.localStorageService.setItem('usages', formattedData);
        this.localStorageService.setItem('usagesDate', new Date().toISOString());
      })
    );
  }

  private getUrl(): Observable<string> {
    return this.rulesetService.getActiveRuleset().pipe(
        map((ruleset) => {
            const date = subMonths(new Date(), 1);
            let dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if(this.isNewRuleset(ruleset)){
              dateString = `${ruleset.previousEndDate.getFullYear()}-${String(ruleset.previousEndDate.getMonth() + 1).padStart(2, '0')}`;              
            }
            return `${this.baseUrl}${dateString}/gen9vgc2024reg${ruleset.id}bo3-1760.txt`;
        })
    );
  }

  private isNewRuleset(ruleset: any): boolean {
    const todayMonth = `${new Date().getMonth()}${new Date().getFullYear()}`;
    const rulesetMonth = `${ruleset.startDate.getMonth()}${ruleset.startDate.getFullYear()}`;
    return todayMonth == rulesetMonth;
  }
  // ----------------------------------------------------------------------------------------------

  private formatUsage(content: string): any[] {
    this.usages = content.split('\n').filter(this.isPokemonLine).map(line => this.formatPokemonLine(line)).filter((poke)=> poke.rankUse <= 100);
    this.localStorageService.setItem('usages', this.usages);
    this.localStorageService.setItem('usagesDate', new Date());
    return this.usages;
  }

  private isPokemonLine(line: string): boolean {
    const regex = /^\|\s+\d/;
    return regex.test(line.trim());
  }

  private formatPokemonLine(line: string): any {
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
