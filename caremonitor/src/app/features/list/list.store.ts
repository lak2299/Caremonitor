import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, exhaustMap, tap, catchError, EMPTY } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Item } from '../../core/models/user.model';

interface ListState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class ListStore extends ComponentStore<ListState> {
  constructor(private apiService: ApiService) {
    super({
      items: [],
      loading: false,
      error: null
    });
  }
  
  // Selectors
  readonly items$ = this.select(state => state.items);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  
  // Updaters
  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
    error: loading ? null : state.error
  }));
  
  readonly setError = this.updater((state, error: string | null) => ({
    ...state,
    error,
    loading: false
  }));
  
  readonly setItems = this.updater((state, items: Item[]) => ({
    ...state,
    items,
    loading: false,
    error: null
  }));
  
  // Effects
  readonly loadItems = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => this.setLoading(true)),
      exhaustMap(() => this.apiService.getItems().pipe(
        tap(items => this.setItems(items)),
        catchError(error => {
          this.setError(error.error?.message || 'Failed to load items');
          return EMPTY;
        })
      ))
    );
  });
}

