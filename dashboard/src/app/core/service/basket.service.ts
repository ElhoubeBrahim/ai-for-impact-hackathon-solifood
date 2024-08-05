import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Basket } from '../model/basket';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private http = inject(HttpClient);

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

  
}
