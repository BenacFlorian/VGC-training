import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Méthode pour stocker une valeur
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Erreur lors du stockage dans localStorage', error);
    }
  }

  // Méthode pour récupérer une valeur
  getItem(key: string): any {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        localStorage.setItem(key, JSON.stringify({}));
        return {};
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Erreur lors de la récupération depuis localStorage', error);
      return null;
    }
  }

  // Méthode pour supprimer une valeur
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression depuis localStorage', error);
    }
  }

  // Méthode pour vider tout le localStorage
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage', error);
    }
  }
}
