import { Component, OnInit, signal, ViewChild, inject, effect, computed } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormFieldComponent } from '@libs/ui/fields/form-field.component';
import { ComptesListStore, CompteStore } from '../../stores/compte.store';
import { Compte } from '../../models/compte.model';

import { CompteService } from '../../services/compte.service'; // ✅ singulier partout

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-compte',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        RatingModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        FormFieldComponent
    ],
    templateUrl: './compte.component.html',
    providers: [MessageService, CompteStore, ConfirmationService]
})
export class CompteComponent implements OnInit {

    private readonly comptesListStore = inject(ComptesListStore);
    private readonly compteStore = inject(CompteStore);
   
    datacomptes = this.comptesListStore.comptes;
    //  = this.comptesListStore.listConfig;
    // isloading  = this.comptesListStore.getComptesLoading;
    
    compteDialog: boolean = false;
    comptes = signal<Compte[]>([]);
    compte!: Compte;
    compteForm!: FormGroup;
    submitted: boolean = false;
    list_options!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    columns = [
        { field: 'id', header: 'id', sortable: true, style: 'min-width: 10rem' },
        { field: 'cpt_num', header: 'cpt_num', sortable: true, style: 'min-width: 10rem' },
        { field: 'cpt_nom', header: 'cpt_nom', sortable: true, style: 'min-width: 10rem' },
        { field: 'cpt_etat', header: 'cpt_etat', sortable: true, style: 'min-width: 10rem' },
      
      ];

    constructor(
        // private compteService: CompteService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.loadData();
        // Déclenche l'appel API via le store
        this.comptesListStore.loadComptes();
        // console.log('🟢 comptes du store: ', this.comptesListStore.comptes());

        // // Observe les changements
        // effect(() => {
        //     console.log('🟢 comptes du store: ', this.comptesListStore.comptes());
        // });
        // console.log('this.data_comptes');
        // console.log(this.data_comptes());
        // this.comptesListStore.setListConfig({
        //     filters: { limit: 10, offset: 0 },
        //     currentPage: 1
        // });
        // console.log('result');
        // const dd = this.comptesService.query().subscribe({
        //     next:(result)=>{
        //       console.log('result service 2');
        //       console.log(result);
        //     },
        //     error:(error)=>{
        //         console.log('error');
        //         console.log(error);
        //     },
        // });
        // On configure la liste (filtres, pagination, etc.)
        

        // On déclenche l'appel API pour remplir le store
        // this.comptesListStore.loadComptes(this.comptesListStore.listConfig());
        // this.comptesListStore.loadComptes();
        // Debug : observer l’évolution du signal
        // effect(() => {
        //     console.log('🟢 comptes list changed: ', this.comptesListStore.comptes().entities);
        // });
        this.compteForm = this.fb.group({
            id: ['', ],
            cpt_num: ['', Validators.required],
            cpt_nom: ['', Validators.required],
            cpt_etat: ['', Validators.required],
        });

    }

    loadData() {
        // this.list_options = [
        //     { label: 'INSTOCK', value: 'instock' },
        //     { label: 'LOWSTOCK', value: 'lowstock' },
        // ];

        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'cpt_num', header: 'cpt_num' },
            { field: 'cpt_nom', header: 'cpt_nom' },
            { field: 'cpt_etat', header: 'cpt_etat' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.compte = {};
        this.submitted = false;
        this.compteDialog = true;
    }

    editCompte(compte: Compte) {
        this.compte = { ...compte };
        this.compteDialog = true;
        this.compteForm.patchValue(this.compte);
    }

    hideDialog() {
        this.compteDialog = false;
        this.submitted = false;
    }

    deleteCompte(compte: any) {
        this.confirmationService.confirm({
          message: 'essai ' ,
          header: 'Confirmation',
          icon: 'pi pi-trash',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          rejectButtonStyleClass: 'p-button-secondary p-button-sm',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: () => {
            if (this.compte.id) {
                this.compteStore.deleteCompte(this.compte.id);
                this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'essai',
                life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Erreur',
                    detail: 'Erreur de suppression',
                    life: 2000
                });
            }
          },
          reject: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Annulé',
              detail: 'Suppression annulée',
              life: 2000
            });
          }
        });
      }

    saveCompte() {
        this.submitted = true;
        if (this.compteForm.invalid) {
          return;
        }
        const formValue = this.compteForm.value;
        if (this.compte.id) {
            this.compteStore.updateCompte(formValue);
        } else {
            this.compteStore.addCompte(formValue);
        }
      
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Compte enregistré',
          life: 3000
        });
      
        this.compteDialog = false;
        this.compteForm.reset();
    }
}

