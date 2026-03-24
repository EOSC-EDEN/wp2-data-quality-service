import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getRepositories(): Observable<any[]> {
    return this.http.get<any[]>('/assets/repositories.json');
  }


  runCheck(): Observable<any[]> {
    const randomDelay = Math.floor(Math.random() * 1000) + 2000;
    return this.http.get<any[]>('/assets/result.json').pipe(delay(randomDelay));
  }
}