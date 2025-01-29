import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import db from 'src/app/db/db.service';

export interface Ruleset {
  id?: string;
  label: string;
  isActive: boolean;
  gen: number;
}

@Injectable({
  providedIn: 'root'
})
export class RulesetService {
  constructor() {}

  initRuleset(): Observable<any> {
    return from(db.rulesets.clear()).pipe(
      switchMap(() => this.addRuleset({ label: 'A', id: 'a', isActive: false, gen: 9, startDate: new Date('2022-12-02'), endDate: new Date('2023-01-31') })),
      switchMap(() => this.addRuleset({ label: 'B', id: 'b', isActive: false, gen: 9, startDate: new Date('2023-02-01'), endDate: new Date('2023-04-01') })),
      switchMap(() => this.addRuleset({ label: 'C', id: 'c', isActive: false, gen: 9, startDate: new Date('2023-04-02'), endDate: new Date('2023-06-30') })),
      switchMap(() => this.addRuleset({ label: 'D', id: 'd', isActive: false, gen: 9, startDate: new Date('2023-07-01'), endDate: new Date('2023-09-30') })),
      switchMap(() => this.addRuleset({ label: 'E', id: 'e', isActive: false, gen: 9, startDate: new Date('2023-10-01'), endDate: new Date('2024-01-03') })),
      switchMap(() => this.addRuleset({ label: 'F', id: 'f', isActive: false, gen: 9, startDate: new Date('2024-01-04'), endDate: new Date('2024-05-01') })),
      switchMap(() => this.addRuleset({ label: 'G', id: 'g', isActive: true, gen: 9, startDate: new Date('2025-01-06'), endDate: new Date('2025-04-30'), previousEndDate: new Date('2024-08-31') })),
      switchMap(() => this.addRuleset({ label: 'H', id: 'h', isActive: false, gen: 9, startDate: new Date('2024-09-01'), endDate: new Date('2025-01-05') })),
    );
  }

  addRuleset(ruleset: any): Observable<string> {
    return from(db.rulesets.add(ruleset));
  }

  clearRuleset(): Observable<void> {
    return from(db.rulesets.clear());
  }

  getActiveRuleset(): Observable<any> {
    return from(db.rulesets
      .toArray()
      .then((rulesets) => rulesets.find((ruleset) => ruleset.isActive && ruleset.gen == 9))
    );
  }
  getRuleset(): Observable<any[]> {
    return from(db.rulesets
      .toArray()
    );
  }

}

