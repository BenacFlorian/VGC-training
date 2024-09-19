import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
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
