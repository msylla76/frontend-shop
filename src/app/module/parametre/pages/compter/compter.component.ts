import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { ComptersAllStore, CompterStore } from '../../stores/compter.store';
import { Compter } from '../../models/compter.model';


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
    selector: 'app-compter',
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
    templateUrl: './compter.component.html',
    providers: [MessageService, CompterStore, ConfirmationService]
})
export class CompterComponent implements OnInit {

    private readonly comptersListStore = inject(ComptersAllStore);
    private readonly compterStore = inject(CompterStore);
    private readonly router = inject(Router);

    //  = this.comptersListStore.totalPages;
    data_compters = this.comptersListStore.compters.entities;
    //  = this.comptersListStore.listConfig;
    //  = this.comptersListStore.getComptersLoading;

    compterDialog: boolean = false;
    compters = signal<Compter[]>([]);
    compter!: Compter;
    compterForm!: FormGroup;
    submitted: boolean = false;
    list_options!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    columns = [
        { field: 'cpr_id', header: 'cpr_id', sortable: true, style: 'min-width: 10rem' },
      { field: 'cpt_id', header: 'cpt_id', sortable: true, style: 'min-width: 10rem' },
      { field: 'cpr_num', header: 'cpr_num', sortable: true, style: 'min-width: 10rem' },
      { field: 'cpr_nom', header: 'cpr_nom', sortable: true, style: 'min-width: 10rem' },
      { field: 'cpr_etat', header: 'cpr_etat', sortable: true, style: 'min-width: 10rem' },
      
      ];

    constructor(
        // private compterService: CompterService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.loadData();
        this.compterForm = this.fb.group({
            cpr_id: ['', Validators.required],
      cpt_id: ['', Validators.required],
      cpr_num: ['', Validators.required],
      cpr_nom: ['', Validators.required],
      cpr_etat: ['', Validators.required],
      
          });
    }

    loadData() {
        this.list_options = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
        ];

        this.cols = [
            { field: 'cpr_id', header: 'cpr_id' },
      { field: 'cpt_id', header: 'cpt_id' },
      { field: 'cpr_num', header: 'cpr_num' },
      { field: 'cpr_nom', header: 'cpr_nom' },
      { field: 'cpr_etat', header: 'cpr_etat' },
      
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.compter = {};
        this.submitted = false;
        this.compterDialog = true;
    }

    editCompter(compter: Compter) {
        this.compter = { ...compter };
        this.compterDialog = true;
        this.compterForm.patchValue(this.compter);
    }

    hideDialog() {
        this.compterDialog = false;
        this.submitted = false;
    }

    deleteCompter(compter: any) {
        this.confirmationService.confirm({
          message: ,
          header: 'Confirmation',
          icon: 'pi pi-trash',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          rejectButtonStyleClass: 'p-button-secondary p-button-sm',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: () => {
            if (this.compter.id) {
                this.compterStore.deleteCompter(this.compter.id);
                this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: ,
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

    saveCompter() {
        this.submitted = true;
        if (this.compterForm.invalid) {
          return;
        }
        const formValue = this.compterForm.value;
        if (this.compter.id) {
            this.compterStore.updateCompter(formValue);
        } else {
            this.compterStore.addCompter(formValue);
        }
      
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Compter enregistré',
          life: 3000
        });
      
        this.compterDialog = false;
        this.compterForm.reset();
    }
}

