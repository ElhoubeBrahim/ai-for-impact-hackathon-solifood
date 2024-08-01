import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Basket } from '../models/basket';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private http: HttpClient) {}

  async createBasket(basket: any): Promise<Basket> {
    const observable$ = this.http.post('/baskets', basket);
    return await (lastValueFrom(observable$) as Promise<Basket>);
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

  getBasket(id: string) {
    const response = this.http.get<Basket>(`/baskets/${id}`);
    return response;
  }

  searchBaskets(query: string) {
    const response = this.http.get<Basket[]>(`/baskets/search?q=${query}`);
    return response;
  }

  getBaskets(lastResult: Basket | null = null) {
    const response = this.http.get<Basket[]>(
      '/baskets' + (lastResult ? `?lastDocId=${lastResult.id}` : ''),
    );
    return response;
  }

  getNearbyBaskets(lat: number, lon: number, range: number) {
    const params = new URLSearchParams();
    params.append('latitude', lat.toString());
    params.append('longitude', lon.toString());
    params.append('range', range.toString());

    const response = this.http.get<Basket[]>(
      '/baskets/nearby' + '?' + params.toString(),
    );
    return response;
  }

  async getBasketsByUser(userId: string) {
    const response = this.http.get<Basket[]>(`/baskets/user/${userId}`);
    return await lastValueFrom(response);
  }

  async reportAbuse(id: string, reason: string[], details: string) {
    const observable$ = this.http.post(`/baskets/report/${id}`, {
      reason,
      details,
    });
    return await (lastValueFrom(observable$) as Promise<Basket>);
  }
}
