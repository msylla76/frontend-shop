import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import {
  CompteState,
  compteInitialState,
  // Comptes,
  // ComptesListConfig,
  ComptesListState,
  comptesListInitialState,
} from '../models/compte.state';
import { computed, inject } from '@angular/core';
import { CompteService } from '../services/compte.service'; // ✅ singulier partout
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, concatMap } from 'rxjs';
import { setLoaded, setLoading, withCallState } from '@libs/core/access/call-state.feature';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { Compte, NewCompte } from '../models/compte.model';
import { FormErrorsStore } from '@libs/core/forms/forms-errors.store';

// import { catchError, tap } from 'rxjs/operators';
// import { of } from 'rxjs';
/* -------------------- CompteStore -------------------- */
export const CompteStore = signalStore(
  { providedIn: 'root' },
  withState<CompteState>(compteInitialState),
  withMethods((
    store,
    comptesService = inject(CompteService),
    router = inject(Router),
    formErrorsStore = inject(FormErrorsStore),
    comptesListStore = inject(ComptesListStore),
  ) => ({

    deleteCompte: rxMethod<string>(
      pipe(
        switchMap((id) =>
          comptesService.deleteCompte(id).pipe(
            tapResponse({
              next: () => {
                // ✅ on demande au store liste de se mettre à jour
                comptesListStore.removeFromList(id);
              },
              error: () => patchState(store, compteInitialState),
            }),
          ),
        ),
      ),
    ),

    addCompte: rxMethod<NewCompte>(
      pipe(
        switchMap((payload) =>
          comptesService.addCompte(payload).pipe(
            tapResponse({
              next: ({ compte }) => {
                // ✅ ajoute l’élément dans la liste
                comptesListStore.addToList(compte);
              },
              error: ({ error }) => formErrorsStore.setErrors({ errors: error.errors }),
            }),
          ),
        ),
      ),
    ),

    updateCompte: rxMethod<Compte>(
      pipe(
        switchMap((payload) =>
          comptesService.editCompte(payload).pipe(
            tapResponse({
              next: ({ compte }) => {
                // ✅ remplace/insère dans la liste
                comptesListStore.upsertInList(compte);
              },
              error: ({ error }) => formErrorsStore.setErrors(error.errors),
            }),
          ),
        ),
      ),
    ),

    // ... le reste inchangé (getCompte, initializeCompte)
  })),
  withCallState({ collection: 'getCompte' }),
);
/* -------------------- ComptesListStore -------------------- */
// ... mêmes imports qu'avant
export const ComptesListStore = signalStore(
  { providedIn: 'root' },
  withState<ComptesListState>(comptesListInitialState),

  withMethods((store, comptesService = inject(CompteService)) => ({

    loadComptes: rxMethod<void>(
      pipe(
        tap(() => setLoading('getComptes')),
        concatMap(() =>
          comptesService.query().pipe(
            tapResponse({
              next: ({ comptes }) => {
                console.log('✅ comptes reçus du service', comptes);
                // patchState(store, { comptes });
                // this.patchState({ comptes: res });
                patchState(store, {
                  comptes, // ✅ affectation directe
                  ...setLoaded('getComptes'),
                });
              },
              error: () => {
                console.log('❌ erreur de chargement');
                patchState(store, { comptes: [], ...setLoaded('getComptes') });
              },
            }),
          ),
        ),
      ),
    ),
    // loadComptes: () => {
    //   patchState(store, { loading: true, error: null });

    //   comptesService.query().pipe(
    //     tap((data) => {
    //       console.log("✅ API renvoie: ", data); // Vérification
    //       patchState(store, { comptes: data, loading: false });
    //     }),
    //     catchError((err) => {
    //       patchState(store, { error: err.message, loading: false });
    //       return of([]);
    //     })
    //   ).subscribe();
    // },
    removeFromList: (id: string) => {
      const current = store.comptes();
      patchState(store, { comptes: current.filter(c => c.id !== id) });
    },

    addToList: (compte: Compte) => {
      const current = store.comptes();
      patchState(store, { comptes: [...current, compte] });
    },

    upsertInList: (compte: Compte) => {
      const current = store.comptes();
      const idx = current.findIndex(c => c.id === compte.id);
      if (idx === -1) {
        patchState(store, { comptes: [...current, compte] });
      } else {
        const updated = [...current];
        updated[idx] = { ...updated[idx], ...compte };
        patchState(store, { comptes: updated });
      }
    },
  })),

  withCallState({ collection: 'getComptes' }),
);

// export const ComptesListStore = signalStore(
//   { providedIn: 'root' },
//   withState<ComptesListState>(comptesListInitialState),

//   // withComputed(({ listConfig, comptes }) => ({
//   //   totalPages: computed(() =>
//   //     Array.from(
//   //       // new Array(Math.ceil(comptes().comptesCount / (listConfig()?.filters?.limit ?? 1))),
//   //       new Array(Math.ceil(200 / (listConfig()?.filters?.limit ?? 1))),
//   //       (_, index) => index + 1,
//   //     ),
//   //   ),
//   // })),

//   withMethods((store, comptesService = inject(CompteService)) => ({
//     // ==== ⚙️  MÉTHODES INTERNE DE MUTATION ====
//     loadComptes2() {
//       comptesService.query().subscribe({
//         next:({comptes} )=>{
//           console.log('=========== result store 2 ==================');
//           console.log(comptes);

//           // patchState(store, {
//           //   // comptes: {  entities: comptes },
//           //   comptes:  comptes ,
//           //   ...setLoaded('getComptes'),
//           // });
//         },
//         error:(error)=>{
//             console.log('error');
//             console.log(error);
//         },
//         // error: (err) => console.error('Erreur chargement comptes:', err)
//       });
//     },
//     removeFromList: (id: string) => {
//       const current = store.comptes();
//       const entities = current.filter(c => c.id !== id);
//       patchState(store, {
//         comptes: {
//           ...current,
//           // comptesCount: Math.max(0, (current.comptesCount ?? entities.length) - 1),
//         },
//       });
//     },

//     addToList: (compte: Compte) => {
//       const current = store.comptes();
//       patchState(store, {
//         comptes: 
//           [...current, compte],
        
//       });
//     },

//     upsertInList: (compte: Compte) => {
//       const current = store.comptes();
//       const idx = current.findIndex(c => c.id === compte.id);
//       let entities: Compte[];
//       if (idx === -1) {
//         entities = [...current, compte];
//       } else {
//         entities = [
//           ...current.slice(0, idx),
//           { ...current[idx], ...compte },
//           ...current.slice(idx + 1),
//         ];
//       }
//       // patchState(store, {
//       //   comptes: [...current, entities]
        
//       // });
//     },
//     // ==== FIN MÉTHODES MUTATION ====
   
//     loadComptes: rxMethod<void>(
//       pipe(
//         tap(() => setLoading('getComptes')),
//         concatMap(() =>
//           // comptesService.query(listConfig).pipe(
//           comptesService.query().pipe(
//             tapResponse({
//               // next: ({ comptes, comptesCount }) => {
//                 next: ({ comptes }) => {
//                 console.log('store save');
//                 console.log(comptes);

//                 patchState(store, {
//                   comptes:  comptes ,
//                   ...setLoaded('getComptes'),
//                 });
//               },
//               error: () => {
//                 console.log('error store');
//                 patchState(store, { ...comptesListInitialState, ...setLoaded('getComptes') });
//               },
//             }),
//           ),
//         ),
//       ),
//     ),
//     // loadComptes: rxMethod<ComptesListConfig>(
//     //   pipe(
//     //     tap(() => setLoading('getComptes')),
//     //     concatMap((listConfig) =>
//     //       // comptesService.query(listConfig).pipe(
//     //       comptesService.query({}).pipe(
//     //         tapResponse({
//     //           // next: ({ comptes, comptesCount }) => {
//     //             next: ({ comptes }) => {
//     //             patchState(store, {
//     //               comptes: {  entities: comptes },
//     //               ...setLoaded('getComptes'),
//     //             });
//     //           },
//     //           error: () => {
//     //             console.log('error store');
//     //             patchState(store, { ...comptesListInitialState, ...setLoaded('getComptes') });
//     //           },
//     //         }),
//     //       ),
//     //     ),
//     //   ),
//     // ),
//     // allComptes: rxMethod<void>(
//     //   pipe(
//     //     tap(() => setLoading('getComptes')),
//     //     concatMap(() =>
//     //       comptesService.allCompte().pipe(
//     //         tapResponse({
//     //           next: ({ comptes }) => {
//     //             patchState(store, {
//     //               comptes: { entities: comptes },
//     //               ...setLoaded('getComptes'),
//     //             });
//     //           },
//     //           error: () => {
//     //             patchState(store, { ...comptesListInitialState, ...setLoaded('getComptes') });
//     //           },
//     //         }),
//     //       ),
//     //     ),
//     //   ),
//     // ),

//     // setListConfig: (listConfig: ComptesListConfig) => {
//     //   patchState(store, { listConfig });
//     // },

//     // setListPage: (page: number) => {
//     //   const filters = {
//     //     ...store.listConfig().filters,
//     //     // offset: (store.listConfig().filters.limit ?? 10) * (page - 1),
//     //   };
//     //   patchState(store, {
//     //     listConfig: { ...store.listConfig(), currentPage: page, filters },
//     //   });
//     // },
//   })),

//   withCallState({ collection: 'getComptes' }),
// );

// function replaceCompte(comptes: Comptes, payload: Compte): Comptes {
//   const compteIndex = comptes.entities.findIndex((a) => a.id === payload.id);
//   const entities = [
//     ...comptes.entities.slice(0, compteIndex),
//     Object.assign({}, comptes.entities[compteIndex], payload),
//     ...comptes.entities.slice(compteIndex + 1),
//   ];
//   return { ...comptes, entities };
// }

/* -------------------- ComptesAllStore -------------------- */

// ✅ on définit un état propre pour AllStore
// interface ComptesAllState {
//   comptes: Comptes;
// }

// const comptesAllInitialState: ComptesAllState = {
//   comptes: { entities: [], comptesCount: 0 },
// };

// export const ComptesAllStore = signalStore(
//   { providedIn: 'root' },

//   withState<ComptesAllState>(comptesAllInitialState),

//   withMethods((store, comptesService = inject(CompteService)) => ({
//     loadComptes: rxMethod<void>(
//       pipe(
//         tap(() => setLoading('getComptes')),
//         concatMap(() =>
//           comptesService.query().pipe(
//             tapResponse({
//               next: ({ comptes }) => {
//                 patchState(store, {
//                   comptes: { entities: comptes, comptesCount: comptes.length },
//                   ...setLoaded('getComptes'),
//                 });
//               },
//               error: () => {
//                 patchState(store, { ...comptesAllInitialState, ...setLoaded('getComptes') });
//               },
//             }),
//           ),
//         ),
//       ),
//     ),
//   })),

//   withCallState({ collection: 'getComptes' }),
// );