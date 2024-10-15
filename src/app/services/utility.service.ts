import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  getRandomElement(elements: any): any {
    return elements[Math.floor(Math.random() * elements.length)];
  }
  sanitizeName(name: any) {
    // if(name.includes('maushold') || name.includes('palafin') ) debugger;
    if(name === 'basculegion') return 'basculegion-male';
    if(name === 'basculegion-f') return 'basculegion-female';
    if(name === 'indeedee-f') return 'indeedee-female';
    if(name === 'indeedee') return 'indeedee-male';
    if(name === 'lycanroc') return 'lycanroc-midday';
    if(name === 'mimikyu') return 'mimikyu-disguised';
    if(name === 'toxtricity') return 'toxtricity-amped';
    // if(name === 'tatsugiri') return 'tatsugiri-curly';
    // if(name === 'maushold') return 'maushold-family-of-four';
    // if(name === 'palafin') return 'palafin-zero';
    if(name === 'tauros-paldea-blaze') return 'tauros-paldea-blaze-breed';
    if(name === 'tauros-paldea-aqua') return 'tauros-paldea-aqua-breed';
    return name;
  }
  getSmogonStats(poke: any, formattedData: any[]): any {
    const smogonStats = formattedData.find((pokemon) => this.sanitizeName(pokemon.name.toLowerCase()) === poke.name.toLowerCase());
    return smogonStats;
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

  getTwoRandomPokemons(pokemons: any[]): any[] | void {
    if (pokemons.length < 1) {
      console.log('no pokemons');
      return;
    }

    const getRandomIndex = () => Math.floor(Math.random() * pokemons.length);
    
    let firstIndex = getRandomIndex();
    let secondIndex = getRandomIndex();

    // S'assurer que les deux indices sont différents
    while (secondIndex === firstIndex && pokemons.length > 1) {
      secondIndex = getRandomIndex();
    }

    return [pokemons[firstIndex], pokemons[secondIndex]];
  }
}
