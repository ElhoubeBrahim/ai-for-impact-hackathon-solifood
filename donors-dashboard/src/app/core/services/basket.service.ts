import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Basket } from '../model/basket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private http: HttpClient) {}

  createBasket(basket: any): Observable<Basket> {
    return this.http.post<Basket>('/baskets', basket);
  }

  uploadImages(files: File[]): Observable<any> {
    const formData: FormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return this.http.post<any>('/baskets/images', formData, {
      headers: new HttpHeaders({
        enctype: 'multipart/form-data',
      }),
    });
  }

  getBasket(id: string): Observable<Basket> {
    return this.http.get<Basket>(`/baskets/${id}`);
  }

  searchBaskets(query: string): Observable<Basket[]> {
    return this.http.get<Basket[]>(`/baskets/search?q=${query}`);
  }

  getBaskets(
    params: {
      lastResult?: Basket | null;
      latitude?: number;
      longitude?: number;
      range?: string;
      sortBy?: string;
      tags?: string[];
    } = {}
  ): Observable<Basket[]> {
    const {
      lastResult,
      latitude,
      longitude,
      range,
      sortBy = 'newest',
      tags,
    } = params;

    let queryParams = new URLSearchParams();

    if (lastResult) {
      queryParams.append('lastDocId', lastResult.id);
    }

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      range !== undefined &&
      !isNaN(parseFloat(range))
    ) {
      queryParams.append('latitude', latitude.toString());
      queryParams.append('longitude', longitude.toString());
      queryParams.append('range', range.toString());
    }

    if (sortBy) {
      queryParams.append('sortBy', sortBy);
    }

    if (tags && tags.length > 0) {
      queryParams.append('tags', tags.join(','));
    }

    const url = `/baskets?${queryParams.toString()}`;

    return this.http.get<Basket[]>(url);
  }

  getBasketsByUser(
    userId: string,
    lastResult: Basket | null = null
  ): Observable<Basket[]> {
    let params = new URLSearchParams();
    if (lastResult) {
      params.append('lastDocId', lastResult.id);
    }

    return this.http.get<Basket[]>(`/baskets/user/${userId}?${params.toString()}`);
  }

  updateBasket(id: string, basket: Partial<Basket>): Observable<Basket> {
    return this.http.put<Basket>(`/baskets/${id}`, basket);
  }

  deleteBasket(id: string): Observable<void> {
    return this.http.delete<void>(`/baskets/${id}`);
  }
}
