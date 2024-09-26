import { Injectable } from '@angular/core';
import { calculate, Generations, Pokemon, Move } from '@smogon/calc';
import { UtilityService } from 'src/app/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class CalcQuizComponentService {
  constructor(private utilityService: UtilityService) {}

  setupQuiz(leftSide: any, rightSide: any) {
    const randomAttack = this.getAttack(leftSide, rightSide);
    if(!randomAttack) return;
    const nameAttack = this.utilityService.capitalizeFirstLetter(randomAttack?.name);
    const srcCategory = '/assets/' + randomAttack.damage_class.name + '.png';
    const powerAttack = randomAttack.power;
    const categoryAttack = randomAttack.damage_class.name;
    const srcType = '/assets/types/Pokemon_Type_Icon_' + this.utilityService.capitalizeFirstLetter(randomAttack.type.name) + '.png';

    return { randomAttack, nameAttack, srcCategory, powerAttack, srcType, categoryAttack };
  }

  getAttack(leftSide: any, rightSide: any) {
    const moveSorted = leftSide.moves.sort((a: any, b: any) => b.power - a.power).filter((move: any) => move.name != "Terablast");
    const effectiveMove = this.getEffectiveMove(moveSorted, rightSide);
    return effectiveMove;
  }

  private getEffectiveMove(moves: any[], rightSide: any): any {
    for (const move of moves) {
      const effectiveness = this.getTypeEffectiveness(move.type.name, rightSide.types);
      if (effectiveness > 1) {
        return move;
      }
    }

    for (const move of moves) {
      const effectiveness = this.getTypeEffectiveness(move.type.name, rightSide.types);
      if (effectiveness === 1) {
        return move;
      }
    }

    return moves[0];
  }

  private getTypeEffectiveness(moveType: string, defenderTypes: any[]): number {
    const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
      poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
      rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
      ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0 },
      dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
      fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
    };

    return defenderTypes.reduce((acc: number, type: any) => {
      return acc * (typeEffectiveness[moveType]?.[type.type.name] || 1);
    }, 1);
  }

  calculateEffectiveness(move: any, attacker: any, defender: any) {
    const effectiveness = this.getTypeEffectiveness(move.type.name, defender.types);
    return effectiveness;
  }

  calculateKO(attacker: any, defender: any, move: any): {
    minDamage: number;
    maxDamage: number;
    result: 'KO' | '50-' | '50+';
    calc: any;
    possibleDamage: string;
  } {
    const gen = Generations.get(9);

    const attackerPokemon = new Pokemon(gen, attacker.name, {
      nature: move.damage_class.name === 'special' ? 'Modest' : 'Adamant' ,
      ability: attacker.ability,
      level: 50, // Utilise le niveau défini ou 50 par défaut
      evs: { atk: 252, spa: 252, def: 252, spd: 252, hp: 252 },
      item: this.formatItemName(attacker.item) // Utilise l'item s'il existe
    });
    delete attackerPokemon.abilityOn;
    
    const defenderPokemon = new Pokemon(gen, defender.name, {
      nature: move.damage_class.name === 'special' ? 'Calm' : 'Bold',
      ability: defender.ability,
      level: 50, // Utilise le niveau défini ou 50 par défaut
      item: this.formatItemName(defender.item), // Utilise l'item s'il existe
      evs: { atk: 252, spa: 252, def: 252, spd: 252, hp: 252 }
    });
    delete defenderPokemon.abilityOn;

    console.log("---------------------------");
    console.log(attackerPokemon);
    console.log(defenderPokemon);
    const moveCalc = new Move(gen, move.name);

    const result = calculate(gen, attackerPokemon, defenderPokemon, moveCalc);
    console.log(result);
    console.log("---------------------------------------------------");

    const minDamage = result.range()[0];
    const maxDamage = result.range()[1];

    const splited = result.desc().split(':');
    const calc1 = splited[0];
    const calc2 = splited[1].split('--')[0];
    const calc3 = splited[1].split('--')[1];
    const possibleDamage = `Possible damage amounts: (${result.range().join(', ')})`;

    if (maxDamage >= defenderPokemon.maxHP()) {
      return { minDamage, maxDamage, result: 'KO', calc: {calc1, calc2, calc3}, possibleDamage };
    } else if (maxDamage > defenderPokemon.maxHP()/2) {
      return { minDamage, maxDamage, result: '50+', calc: {calc1, calc2, calc3}, possibleDamage };
    } else if (maxDamage < defenderPokemon.maxHP()/2) {
      return { minDamage, maxDamage, result: '50-', calc: {calc1, calc2, calc3}, possibleDamage };
    } else {
      return { minDamage, maxDamage, result: '50-', calc: {calc1, calc2, calc3}, possibleDamage };
    }
  }

  formatItemName(item: any) {
    return item.names.find((name: any) => name.language.name === 'en')?.name || item.name;
  }
}