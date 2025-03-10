import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListStore } from './list.store';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { Item } from '../../core/models/user.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ListStore],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  items$: Observable<Item[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  constructor(
    private listStore: ListStore,
    private apiService: ApiService,
    public authService: AuthService
  ) {
    // Initialize observables inside the constructor after listStore is injected
    this.items$ = this.listStore.items$;
    this.loading$ = this.listStore.loading$;
    this.error$ = this.listStore.error$;
  }
  
  ngOnInit(): void {
    this.loadItems();
  }
  
  loadItems(): void {
    this.listStore.loadItems();
  }
  
  logout(): void {
    this.authService.logout();
  }
}
