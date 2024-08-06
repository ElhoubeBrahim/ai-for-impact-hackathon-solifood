import { Injectable } from '@angular/core';
import { Basket } from '../models/basket';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasketService {


  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    const response = this.http.get<Basket>(`/baskets/${id}`);
    return response;
  }

  searchBaskets(query: string) {
    const response = this.http.get<Basket[]>(`/baskets/search?q=${query}`);
    return response;
  }

  getBaskets(
    params: {
      lastResult?: Basket | null;
      latitude?: number;
      longitude?: number;
      range?: string;
      sortBy?: string;
      tags?: string[];
    } = {},
  ) {
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
}
