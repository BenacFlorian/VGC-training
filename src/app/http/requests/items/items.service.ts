import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, toArray, switchMap } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import db, { Item } from 'src/app/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'https://pokeapi.co/api/v2/item?limit=1000'; // URL de l'API pour récupérer les items

  constructor(private http: HttpClient) {}

  fetchAndStoreItems(): Observable<Item[]> {
    return from(db.items.toArray()).pipe(
      switchMap(existingItems => {
        if (existingItems.length > 0) {
          console.log('Items already exist in the database.');
          return of(existingItems);
        } else {
          return this.http.get<any>(this.apiUrl).pipe(
            map(response => response.results),
            catchError(error => {
              console.error('Erreur lors de la récupération des items:', error);
              return of([]);
            }),
            mergeMap((items: any[]) => from(items)),
            mergeMap((item: { url: string, name: string }) => 
              this.http.get<any>(item.url).pipe(
                map(itemData => ({
                  name: itemData.name,
                  data: JSON.stringify(itemData)
                })),
                catchError(error => {
                  console.error(`Erreur lors de la récupération de l'item ${item.name}:`, error);
                  return of(null);
                })
              )
            ),
            toArray(),
            mergeMap(itemDataArray => {
              const addPromises = itemDataArray
                .filter(item => item !== null)
                .map(item => db.items.add(item as Item));

              return from(Promise.all(addPromises)).pipe(
                map(() => {
                  console.log('Tous les items ont été stockés en base de données.');
                  return itemDataArray.filter(item => item !== null) as Item[];
                })
              );
            }),
            catchError(err => {
              console.error('Erreur lors de l\'ajout des items à la base de données:', err);
              return of([]);
            })
          );
        }
      })
    );
  }
}
