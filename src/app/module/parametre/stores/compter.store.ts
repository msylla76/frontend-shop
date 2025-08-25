import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import {
    CompterState, 
    compterInitialState,
    Compters,
    ComptersListConfig,
    ComptersListState,
    comptersListInitialState,
  } from '../models/compter.state';
import { computed, inject } from '@angular/core';
import { CompterService } from '../services/compter.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, concatMap } from 'rxjs';
import { setLoaded, setLoading, withCallState } from '@libs/core/access/call-state.feature';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { Compter, NewCompter } from '../models/compter.model';
import { FormErrorsStore } from '@libs/core/forms/forms-errors.store';



export const CompterStore = signalStore(
  { providedIn: 'root' },
  withState<CompterState>(compterInitialState),
  withMethods(
    (
      store,
      comptersService = inject(CompterService),
      router = inject(Router),
      formErrorsStore = inject(FormErrorsStore),
    ) => ({
      getCompter: rxMethod<string>(
        pipe(
          tap(() => setLoading('getCompter')),
          switchMap((id) =>
            comptersService.getCompter(id).pipe(
              tapResponse({
                next: ({ compter }) => {
                  patchState(store, { data: compter, ...setLoaded('getCompter') });
                },
                error: () => {
                  patchState(store, { data: compterInitialState.data, ...setLoaded('getCompter') });
                },
              }),
            ),
          ),
        ),
      ),
      deleteCompter: rxMethod<string>(
        pipe(
          switchMap((id) =>
            comptersService.deleteCompter(id).pipe(
              tapResponse({
                next: () => {
                  const compters = comptersListStore.compters();
                  const updated = compters.entities.filter((d) => d.id !== id);
                  patchState(comptersListStore, {
                    compters: { ...compters, entities: updated, comptersCount: compters.comptersCount - 1 },
                  });
                },
                error: () => patchState(store, compterInitialState),
              }),
            ),
          ),
        ),
      ),
      addCompter: rxMethod<NewCompter>(
        pipe(
          switchMap((compter) =>
            comptersService.addCompter(compter).pipe(
              tapResponse({
                next: ({ compter }) => {
                  patchState(comptersListStore, {
                     compters: {
                       ...comptersListStore.depenses(),
                       entities: [...comptersListStore.compters().entities, compter],
                       comptersCount: comptersListStore.compters().comptersCount + 1
                     }
                  })
                }, 
                error: ({ error }) => formErrorsStore.setErrors({ errors: error.errors }),
              }),
            ),
          ),
        ),
      ),
      editCompter: rxMethod<any>(
        pipe(
          switchMap((compter) =>
            comptersService.editCompter(compter).pipe(
              tapResponse({
                next: ({ compter }) => {
                  const compters = comptersListStore.compters();
                  const updated = replaceCompter(compters, compter);
                  patchState(comptersListStore, { compters: updated });
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),
      initializeCompter: () => {
        patchState(store, compterInitialState);
      },
    }),
  ),
  withCallState({ collection: 'getCompter' }),
);


export const ComptersListStore = signalStore(
  { providedIn: 'root' },
  withState<ComptersListState>(comptersListInitialState),
  withComputed(({ listConfig, compters }) => ({
    totalPages: computed(() =>
      Array.from(
        new Array(Math.ceil(compters().comptersCount / (listConfig()?.filters?.limit ?? 1))),
        (_, index) => index + 1,
      ),
    ),
  })),
  withMethods((store, comptersService = inject(CompterService)) => ({
    loadCompters: rxMethod<ComptersListConfig>(
      pipe(
        tap(() => setLoading('getCompters')),
        concatMap((listConfig) =>
          comptersService.query(listConfig).pipe(
            tapResponse({
              next: ({ compters, comptersCount }) => {
                patchState(store, {
                  compters: { comptersCount: comptersCount, entities: compters },
                  ...setLoaded('getCompters'),
                });
              },
              error: () => {
                patchState(store, { ...comptersListInitialState, ...setLoaded('getCompters') });
              },
            }),
          ),
        ),
      ),
    ),
    
    setListConfig: (listConfig: ComptersListConfig) => {
      patchState(store, { listConfig });
    },
    setListPage: (page: number) => {
      const filters = {
        ...store.listConfig.filters(),
        offset: (store.listConfig().filters.limit ?? 10) * (page - 1),
      };
      const listConfig: ComptersListConfig = {
        ...store.listConfig(),
        currentPage: page,
        filters,
      };
      patchState(store, { listConfig });
    },
  })),
  withCallState({ collection: 'getCompters' }),
);

function replaceCompter(compters: Compters, payload: Compter): Compters {
  const compterIndex = compters.entities.findIndex((a) => a.id === payload.id);
  const entities = [
    ...compters.entities.slice(0, compterIndex),
    Object.assign({}, compters.entities[compterIndex], payload),
    ...compters.entities.slice(compterIndex + 1),
  ];
  return { ...compters, entities };
}


export const ComptersAllStore = signalStore(
    { providedIn: 'root' },
    
    // On garde uniquement les compters et le callState
    withState<{ compters: Compters }>(comptersListInitialState),
    
    withMethods((store, comptersService = inject(ComptersService)) => ({
      loadCompters: rxMethod<void>(
        pipe(
          tap(() => setLoading('getCompters')),
          concatMap(() =>
            comptersService.query().pipe( // plus de listConfig
              tapResponse({
                next: ({ compters }) => {
                  patchState(store, {
                    compters: { entities: compters },
                    ...setLoaded('getCompters'),
                  });
                },
                error: () => {
                  patchState(store, { ...comptersListInitialState, ...setLoaded('getCompters') });
                },
              }),
            ),
          ),
        ),
      ),
    })),
    
    withCallState({ collection: 'getCompters' }),
  );

