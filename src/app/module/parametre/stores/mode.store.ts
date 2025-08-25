import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import {
    ModeState, 
    modeInitialState,
    Modes,
    ModesListConfig,
    ModesListState,
    modesListInitialState,
  } from '../models/mode.state';
import { computed, inject } from '@angular/core';
import { ModeService } from '../services/mode.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, concatMap } from 'rxjs';
import { setLoaded, setLoading, withCallState } from '@libs/core/access/call-state.feature';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { Mode, NewMode } from '../models/mode.model';
import { FormErrorsStore } from '@libs/core/forms/forms-errors.store';



export const ModeStore = signalStore(
  { providedIn: 'root' },
  withState<ModeState>(modeInitialState),
  withMethods(
    (
      store,
      modesService = inject(ModeService),
      router = inject(Router),
      formErrorsStore = inject(FormErrorsStore),
    ) => ({
      getMode: rxMethod<string>(
        pipe(
          tap(() => setLoading('getMode')),
          switchMap((id) =>
            modesService.getMode(id).pipe(
              tapResponse({
                next: ({ mode }) => {
                  patchState(store, { data: mode, ...setLoaded('getMode') });
                },
                error: () => {
                  patchState(store, { data: modeInitialState.data, ...setLoaded('getMode') });
                },
              }),
            ),
          ),
        ),
      ),
      deleteMode: rxMethod<string>(
        pipe(
          switchMap((id) =>
            modesService.deleteMode(id).pipe(
              tapResponse({
                next: () => {
                  const modes = modesListStore.modes();
                  const updated = modes.entities.filter((d) => d.id !== id);
                  patchState(modesListStore, {
                    modes: { ...modes, entities: updated, modesCount: modes.modesCount - 1 },
                  });
                },
                error: () => patchState(store, modeInitialState),
              }),
            ),
          ),
        ),
      ),
      addMode: rxMethod<NewMode>(
        pipe(
          switchMap((mode) =>
            modesService.addMode(mode).pipe(
              tapResponse({
                next: ({ mode }) => {
                  patchState(modesListStore, {
                     modes: {
                       ...modesListStore.depenses(),
                       entities: [...modesListStore.modes().entities, mode],
                       modesCount: modesListStore.modes().modesCount + 1
                     }
                  })
                }, 
                error: ({ error }) => formErrorsStore.setErrors({ errors: error.errors }),
              }),
            ),
          ),
        ),
      ),
      editMode: rxMethod<any>(
        pipe(
          switchMap((mode) =>
            modesService.editMode(mode).pipe(
              tapResponse({
                next: ({ mode }) => {
                  const modes = modesListStore.modes();
                  const updated = replaceMode(modes, mode);
                  patchState(modesListStore, { modes: updated });
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),
      initializeMode: () => {
        patchState(store, modeInitialState);
      },
    }),
  ),
  withCallState({ collection: 'getMode' }),
);


export const ModesListStore = signalStore(
  { providedIn: 'root' },
  withState<ModesListState>(modesListInitialState),
  withComputed(({ listConfig, modes }) => ({
    totalPages: computed(() =>
      Array.from(
        new Array(Math.ceil(modes().modesCount / (listConfig()?.filters?.limit ?? 1))),
        (_, index) => index + 1,
      ),
    ),
  })),
  withMethods((store, modesService = inject(ModeService)) => ({
    loadModes: rxMethod<ModesListConfig>(
      pipe(
        tap(() => setLoading('getModes')),
        concatMap((listConfig) =>
          modesService.query(listConfig).pipe(
            tapResponse({
              next: ({ modes, modesCount }) => {
                patchState(store, {
                  modes: { modesCount: modesCount, entities: modes },
                  ...setLoaded('getModes'),
                });
              },
              error: () => {
                patchState(store, { ...modesListInitialState, ...setLoaded('getModes') });
              },
            }),
          ),
        ),
      ),
    ),
    
    setListConfig: (listConfig: ModesListConfig) => {
      patchState(store, { listConfig });
    },
    setListPage: (page: number) => {
      const filters = {
        ...store.listConfig.filters(),
        offset: (store.listConfig().filters.limit ?? 10) * (page - 1),
      };
      const listConfig: ModesListConfig = {
        ...store.listConfig(),
        currentPage: page,
        filters,
      };
      patchState(store, { listConfig });
    },
  })),
  withCallState({ collection: 'getModes' }),
);

function replaceMode(modes: Modes, payload: Mode): Modes {
  const modeIndex = modes.entities.findIndex((a) => a.id === payload.id);
  const entities = [
    ...modes.entities.slice(0, modeIndex),
    Object.assign({}, modes.entities[modeIndex], payload),
    ...modes.entities.slice(modeIndex + 1),
  ];
  return { ...modes, entities };
}


export const ModesAllStore = signalStore(
    { providedIn: 'root' },
    
    // On garde uniquement les modes et le callState
    withState<{ modes: Modes }>(modesListInitialState),
    
    withMethods((store, modesService = inject(ModesService)) => ({
      loadModes: rxMethod<void>(
        pipe(
          tap(() => setLoading('getModes')),
          concatMap(() =>
            modesService.query().pipe( // plus de listConfig
              tapResponse({
                next: ({ modes }) => {
                  patchState(store, {
                    modes: { entities: modes },
                    ...setLoaded('getModes'),
                  });
                },
                error: () => {
                  patchState(store, { ...modesListInitialState, ...setLoaded('getModes') });
                },
              }),
            ),
          ),
        ),
      ),
    })),
    
    withCallState({ collection: 'getModes' }),
  );

