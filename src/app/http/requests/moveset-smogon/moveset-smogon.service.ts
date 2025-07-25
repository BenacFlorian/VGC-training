import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, map, switchMap, of, throwError, forkJoin } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';
import { UsageSmogonService } from '../usage-smogon/usage-smogon.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { subMonths } from 'date-fns';
import { RulesetService } from 'src/app/db/ruleset.service';

@Injectable({
  providedIn: 'root'
})
export class MovesetSmogonService {
    private baseUrl = 'https://www.smogon.com/stats';
    private moveset: any;

    constructor(
        private http: HttpClient,
        private usageSmogonService: UsageSmogonService,
        private localStorageService: LocalStorageService,
        private rulesetService: RulesetService
    ) { }

    getTopMoveset(): Observable<any[]> {
        const topMoveset = this.localStorageService.getItem('topMoveset');
        const topMovesetDate = this.localStorageService.getItem('topMovesetDate');
        
        const today = new Date();
        const topMovesetDateObj = new Date(topMovesetDate);
        if (topMoveset && topMovesetDateObj.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
            return of(topMoveset);
        }

        return forkJoin([
            this.usageSmogonService.getUsageData(),
            this.getMovesetData()
        ]).pipe(
            map(([usageData, movesetData]) => {
                const topMoveset =  movesetData.filter((pokemon: any) => usageData.some((usagePokemon: any) => usagePokemon.name === pokemon.name));
                this.localStorageService.setItem('topMoveset', topMoveset);
                this.localStorageService.setItem('topMovesetDate', new Date());
                console.log("topMoveset");
                return topMoveset;
            })
        );
    }

    getMovesetData(): Observable<any[]> {
        if(this.moveset){
            return of(this.moveset);
        }

        return this.getUrl().pipe(
            switchMap(url => this.http.get(url, { responseType: 'text' })),
            map(content => this.formatMoveset(content))
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
                return `${this.baseUrl}/${dateString}/moveset/gen9vgc2024reg${ruleset.id}bo3-1760.txt`;
            })
        );
    }

    private isNewRuleset(ruleset: any): boolean {
        const todayMonth = `${new Date().getMonth()}${new Date().getFullYear()}`;
        const rulesetMonth = `${ruleset.startDate.getMonth()}${ruleset.startDate.getFullYear()}`;
        return todayMonth == rulesetMonth;
    }

    formatMoveset(content: string){
        this.moveset = content.split('| Checks and Counters                    |')
        .map((line)=> this.formatPokemonMoveset(line))
        .filter((el)=> el.name != null);
        return this.moveset;
    }

    formatPokemonMoveset(line: string){
        const pokemon = line.split('+----------------------------------------+').filter((el)=> {
            return el.trim().replace('\r\n', '') !== '';
        }).map((el)=> el.replace(/\r\n/g, '').trim());

        const spread = this.getSpread(pokemon[4]);
        return {
            name: this.getName(pokemon[0]),
            abilities: this.getAbilities(pokemon[2]),
            items: this.getItems(pokemon[3]),
            spread,
            spreadMeanings: this.getSpreadMeaningTab(spread),
            moves: this.getMoves(pokemon[5])
        };
    }

    getMeaningWithPercent(spreadMeaningTab: any[]): any[] {
        const spreadMeaningWithPercent: any[] = [];
        spreadMeaningTab.forEach((spreadMeaning: any)=>{
            spreadMeaningWithPercent.push(spreadMeaning);
        });
        return spreadMeaningWithPercent;
    }

    getSpreadMeaningTab(spreads: any[]): any[] {
        const spreadMeanings = spreads?.map((spread: any)=> {
            return this.getSpreadMeaning(spread);
        });

        const spreadMeaningWithPercent: any[] = [];
        spreadMeanings?.forEach((spreadMeaning)=>{
            let index = spreadMeaningWithPercent.findIndex((spread)=> spread.meaning === spreadMeaning.meaning);
            if(index == -1){
                spreadMeaningWithPercent.push(spreadMeaning);
            }else{
                spreadMeaningWithPercent[index] = {
                    meaning: spreadMeaningWithPercent[index].meaning,
                    percent: spreadMeaningWithPercent[index].percent + spreadMeaning.percent
                }
            }
        });
        return spreadMeaningWithPercent;
    }

    getSpreadMeaning(spread: any): any {
        var meaning = '';
        const splited = spread.name.split('/');
        let hp = parseInt(splited[0].split(':')[1]);
        let att = parseInt(splited[1]);
        let def = parseInt(splited[2]);
        let attSpe = parseInt(splited[3]);
        let defSpe = parseInt(splited[4]);
        let vit = parseInt(splited[5]);
        
        if(vit > 200){
            meaning+= ' Fast';
        }
        if(hp + def + defSpe > 200){
            meaning+= ' Bulky';
        }
        if(attSpe + att > 200){
            meaning+= ' Offense';
        }
        if(meaning == ''){
            meaning = 'Balance';
        }
        return {
            meaning, 
            percent: parseFloat(spread.percent.replaceAll('%',''))
        };
    }

    getName(line: string): string {
        return line?.split('|').map((el)=> el.trim()).filter((el)=> el != '')[0];
    }

    getAbilities(line: string): any[] {
        return line?.split('|').map((el: string)=> el.trim()).filter((el: string)=> el != '' && el != "Abilities").map((ability: string)=>{
            const match = ability.match(/^(.*?)\s+(\d+\.\d+%)/);
            if(match && match[1] == 'Other') return;
            return {
                name: match ? match[1] : null,
                percent: match ? match[2] : null
            }
        }).filter((el)=> el != null)
        // slice because too much spread break css
        .slice(0, 6);
    }

    getItems(line: string): any[] {
        return line?.split('|').map((el)=> el.trim()).filter((el)=> el != '' && el != "Items").map((items)=>{
            const match = items.match(/^(.*?)\s+(\d+\.\d+%)/);
            if(match && match[1] == 'Other') return;
            return {
                name: match ? match[1] : null,
                percent: match ? match[2] : null    
            }
        }).filter((el)=> el != null)
        // slice because too much spread break css
        .slice(0, 6);  
    }

    getSpread(line: string): any[] {
        return line?.split('|').map((el: string)=> el.trim()).filter((el: string)=> el != '' && el != "Spreads").map((items: string)=>{
            const match = items.match(/^(.*?)\s+(\d+\.\d+%)/);
            if(match && match[1] == 'Other') return;
            return {
                name: match ? match[1] : null,
                percent: match ? match[2] : null
            }
        }).filter((el)=> el != null)
        // slice because too much spread break css
        .slice(0, 6)
        // slice because too much spread break css;  
    }

    getMoves(line: string): any[] {
        const moves = line?.split('|').map((el)=> el.trim()).filter((el)=> el != '' && el != "Moves").map((items)=>{
            const match = items.match(/^(.*?)\s+(\d+\.\d+%)/);
            if(match && match[1] == 'Other') return;
            return {
                name: match ? match[1] : null,
                percent: match ? match[2] : null
            }
        }).filter((el)=> el != null)
        // slice because too much spread break css
        .slice(0, 6);
        while (moves?.length < 6) {
            moves.push({name: '-', percent: null});
        }
        return moves;
    }

}
