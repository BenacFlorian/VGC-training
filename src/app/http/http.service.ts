import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  /**
   * Effectue une requête GET à l'URL spécifiée.
   * @param url L'URL à appeler
   * @returns Un Observable contenant la réponse de type T
   */
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  /**
   * Effectue une requête POST à l'URL spécifiée avec les donnécore.mjs:7397 ERROR NullInjectorError: R3InjectorError(Standalone[SpeedVersusPage])[SpeedVersusService -> SpeedVersusService -> HttpService -> HttpClient -> HttpClient]: 
  NullInjectorError: No provider for HttpClient!es fournies.
   * @param url L'URL à appeler
   * @param data Les données à envoyer dans le corps de la requête
   * @returns Un Observable contenant la réponse de type T
   */
  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data);
  }

  /**
   * Effectue une requête PUT à l'URL spécifiée avec les données fournies.
   * @param url L'URL à appeler
   * @param data Les données à envoyer dans le corps de la requête
   * @returns Un Observable contenant la réponse de type T
   */
  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data);
  }

  /**
   * Effectue une requête DELETE à l'URL spécifiée.
   * @param url L'URL à appeler
   * @returns Un Observable contenant la réponse de type T
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
