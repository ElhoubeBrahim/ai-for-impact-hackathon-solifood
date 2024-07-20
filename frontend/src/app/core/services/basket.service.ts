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

  async getBaskets() {
    const response = await this.http.get<Basket[]>('/baskets');
    return response;
  }
}
