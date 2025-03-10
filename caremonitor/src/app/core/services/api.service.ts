import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  items: Item[] = [
    { id: 1, name: 'Item 1', description: 'Description for item 1' },
    { id: 2, name: 'Item 2', description: 'Description for item 2' },
    { id: 3, name: 'Item 3', description: 'Description for item 3' },
    { id: 4, name: 'Item 4', description: 'Description for item 4' },
    { id: 5, name: 'Item 5', description: 'Description for item 5' }
  ];

  getItems(): Observable<Item[]> {
    return new Observable<Item[]>((observer)=>{
      observer.next(this.items) 
    })
    
    // this.http.get<Item[]>('/api/items');
  }
}

