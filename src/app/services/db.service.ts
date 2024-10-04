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

export class AppDatabase extends Dexie {
  // Déclaration des tables
  pokemons!: Table<Pokemon, number>; // Type des données et type de la clé primaire
  teamPokemons!: Table<Pokemon, number>; // Type des données et type de la clé primaire
  items!: Table<Item, number>; // Nouvelle table pour les items

  constructor() {
    super('AppDatabase'); // Nom de la base de données

    // Configuration de la version de la base de données et des tables
    this.version(1).stores({
      pokemons: '++id,name,data', // `++id` indique que l'id est auto-incrémenté
      teamPokemons: '++id,name,data', // `++id` indique que l'id est auto-incrémenté
      items: '++id,name,data' // Nouvelle table `items` avec auto-incrémentation
    });

    this.pokemons = this.table('pokemons'); // Initialisation de la table
    this.teamPokemons = this.table('teamPokemons'); // Initialisation de la table
    this.items = this.table('items'); // Initialisation de la nouvelle table
  }
}

// Exportation de l'instance de la base de données
const db = new AppDatabase();
export default db;