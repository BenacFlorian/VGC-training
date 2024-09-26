import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  getRandomElement(moves: any): any {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  sanitizeName(name: any) {
    if(name === 'basculegion') return 'basculegion-male';
    if(name === 'basculegion-f') return 'basculegion-female';
    if(name === 'indeedee-f') return 'indeedee-female';
    if(name === 'indeedee') return 'indeedee-male';
    if(name === 'lycanroc') return 'lycanroc-midday';
    if(name === 'mimikyu') return 'mimikyu-disguised';
    if(name === 'toxtricity') return 'toxtricity-amped';
    if(name.includes('tauros')) return 'tauros';
    return name;
  }
  getAllAbilities(pokemonTopMoveset: any[]): any {
    const abilities: any[] = [];
    for(const pokemon of pokemonTopMoveset){
      for(const ability of pokemon.abilities){
        abilities.push(ability);
      }
    }
    const tableauUnique = abilities.map((ab)=> ab.name).filter((element, index) => {
      return abilities.map((ab)=> ab.name).indexOf(element) === index;
    });
    return tableauUnique.map((ability: string) => ability.toLowerCase().replace(/ /g, '-')); 
  }

  constructor() { }
  
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getRandomElements<T>(array: T[], count: number = 4): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
