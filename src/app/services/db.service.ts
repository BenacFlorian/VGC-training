import Dexie, { Table } from 'dexie';

// Définition de l'interface pour les données de Pokémon
export interface Pokemon {
  id?: number;   // L'id est optionnel car il sera généré automatiquement
  name: string;  // Le nom du Pokémon
  data: string;  // Les données supplémentaires (texte)
}

export class AppDatabase extends Dexie {
  // Déclaration de la table
  pokemons!: Table<Pokemon, number>; // Type des données et type de la clé primaire

  constructor() {
    super('AppDatabase'); // Nom de la base de données

    // Configuration de la version de la base de données et des tables
    this.version(1).stores({
      pokemons: '++id,name,data', // `++id` indique que l'id est auto-incrémenté
    });

    this.pokemons = this.table('pokemons'); // Initialisation de la table
  }
}

// Exportation de l'instance de la base de données
const db = new AppDatabase();
export default db;