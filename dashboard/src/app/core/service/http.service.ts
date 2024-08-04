import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  
  private Base_URL:string = environment.apiURL;

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.Base_URL}/${path}`).pipe(catchError(this.handleError.bind(this)));
  }

  post<T,B>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.Base_URL}/${path}`, body).pipe(catchError(this.handleError.bind(this)));
  }
  
  uploadImages(path: string,files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
    return this.http.post<any>(`${this.Base_URL}/${path}`, formData, {
      headers: new HttpHeaders({enctype: 'multipart/form-data',}),
    }).pipe(catchError(this.handleError.bind(this)));
  }

  put<T,B>(path: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.Base_URL}/${path}`, body).pipe(catchError(this.handleError.bind(this)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.Base_URL}/${path}`).pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.toastr.error(`Oops! ${error.message}`);
    console.log(errorMessage);
    return throwError(() => error);
  }
}