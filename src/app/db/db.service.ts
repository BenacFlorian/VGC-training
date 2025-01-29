import Dexie, { Table } from 'dexie';

// Définition de l'interface pour les données de Pokémon
export interface Pokemon {
  id?: number;   // L'id est optionnel car il sera généré automatiquement
  name: string;  // Le nom du Pokémon
  data: string;  // Les données supplémentaires (texte)
}

// Définition de l'interface pour les données d'items
export interface Item {
  id?: number;   // L'id est optionnel car il sera généré automatiquement
  name: string;  // Le nom de l'item
  data: string;  // Les données supplémentaires (texte)
}

export interface Ruleset {
  id?: string;
  label: string;
  isActive: boolean;
  gen: number;
  startDate: Date;
  endDate: Date;
  previousEndDate?: Date;
}

export class AppDatabase extends Dexie {
  // Déclaration des tables
  pokemons!: Table<Pokemon, number>; // Type des données et type de la clé primaire
  teamPokemons!: Table<Pokemon, number>; // Type des données et type de la clé primaire
  items!: Table<Item, number>; // Nouvelle table pour les items
  rulesets!: Table<Ruleset, string>; // Nouvelle table pour les rulesets
  constructor() {
    super('AppDatabase'); // Nom de la base de données

    // Configuration de la version de la base de données et des tables
    this.version(1).stores({
      pokemons: '++id,name,data', // `++id` indique que l'id est auto-incrémenté
      teamPokemons: '++id,index,name,data', // `++id` indique que l'id est auto-incrémenté
      items: '++id,name,data', // Nouvelle table `items` avec auto-incrémentation
      rulesets: '++id,label,gen,isActive,startDate,endDate,previousEndDate' // Nouvelle table `rulesets` avec auto-incrémentation
    });

    this.pokemons = this.table('pokemons'); // Initialisation de la table
    this.teamPokemons = this.table('teamPokemons'); // Initialisation de la table
    this.items = this.table('items'); // Initialisation de la nouvelle table
    this.rulesets = this.table('rulesets'); // Initialisation de la nouvelle table
  }
}

// Exportation de l'instance de la base de données
const db = new AppDatabase();
export default db;