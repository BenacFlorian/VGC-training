import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudTeamPokemonDialogService {

  natures = [
    { label: 'Bold +10% Def -10% Att', name: 'bold' },
    { label: 'Quirky Neutral', name: 'quirky' },
    { label: 'Brave +10% Att -10% Speed', name: 'brave' },
    { label: 'Calm +10% Sp. Def -10% Att', name: 'calm' },
    { label: 'Quiet +10% Sp. Att -10% Speed', name: 'quiet' },
    { label: 'Docile Neutral', name: 'docile' },
    { label: 'Mild +10% Sp. Att -10% Def', name: 'mild' },
    { label: 'Rash +10% Sp. Att -10% Sp. Def', name: 'rash' },
    { label: 'Gentle +10% Sp. Def -10% Def', name: 'gentle' },
    { label: 'Hardy Neutral', name: 'hardy' },
    { label: 'Jolly +10% Speed -10% Sp. Att', name: 'jolly' },
    { label: 'Lax +10% Def -10% Sp. Def', name: 'lax' },
    { label: 'Impish +10% Def -10% Sp. Att', name: 'impish' },
    { label: 'Sassy +10% Sp. Def -10% Speed', name: 'sassy' },
    { label: 'Naughty +10% Att -10% Sp. Def', name: 'naughty' },
    { label: 'Modest +10% Sp. Att -10% Att', name: 'modest' },
    { label: 'Naive +10% Speed -10% Sp. Def', name: 'naive' },
    { label: 'Hasty +10% Speed -10% Def', name: 'hasty' },
    { label: 'Careful +10% Sp. Def -10% Sp. Att', name: 'careful' },
    { label: 'Bashful Neutral', name: 'bashful' },
    { label: 'Relaxed +10% Def -10% Speed', name: 'relaxed' },
    { label: 'Adamant +10% Att -10% Sp. Att', name: 'adamant' },
    { label: 'Serious Neutral', name: 'serious' },
    { label: 'Lonely +10% Att -10% Def', name: 'lonely' },
    { label: 'Timid +10% Speed -10% Att', name: 'timid' }
  ];

  constructor() {}

  getNatures(): any[] {
    return this.natures;
  }

  public _filterPokemons(value: string, pokemons: any[]): any[] {
    const filterValue = value.toLowerCase();
    return pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(filterValue));
  }
  public _filterMoves(value: string, moves: any[]): any[] {
    const filterValue = value.toLowerCase();
    return moves.filter(move => move.name.toLowerCase().includes(filterValue));
  }
  public _filterItems(value: string, items: any[]): any[] {
    const filterValue = value.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(filterValue));
  }
  public _filterAbilities(value: string, abilities: any[]): any[] {
    const filterValue = value.toLowerCase();
    return abilities.filter(ability => ability.name.toLowerCase().includes(filterValue));
  }
  public _filterNatures(value: string, natures: any[]): any[] {
    const filterValue = value.toLowerCase();
    return natures.filter(nature => nature.name.toLowerCase().includes(filterValue));
  }

  public formatSpread(spread: any): string{
    const hp = !!spread.hpStats && spread.hpStats != 0 ? `Hp: ${spread.hpStats}` : '';
    const att = !!spread.attStats && spread.attStats != 0 ? `Att: ${spread.attStats}` : '';
    const def = !!spread.defStats && spread.defStats != 0 ? `Def: ${spread.defStats}` : '';
    const spA = !!spread.spAStats && spread.spAStats != 0 ? `SpA: ${spread.spAStats}` : '';
    const spD = !!spread.spDStats && spread.spDStats != 0 ? `SpD: ${spread.spDStats}` : '';
    const spe = !!spread.speStats && spread.speStats != 0 ? `Spe: ${spread.speStats}` : '';
    return `${hp} ${att} ${def} ${spA} ${spD} ${spe}`;
  }

}