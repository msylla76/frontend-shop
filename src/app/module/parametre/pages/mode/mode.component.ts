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
import { ModesAllStore, ModeStore } from '../../stores/mode.store';
import { Mode } from '../../models/mode.model';


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
    selector: 'app-mode',
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
    templateUrl: './mode.component.html',
    providers: [MessageService, ModeStore, ConfirmationService]
})
export class ModeComponent implements OnInit {

    private readonly modesListStore = inject(ModesAllStore);
    private readonly modeStore = inject(ModeStore);
    private readonly router = inject(Router);

    //  = this.modesListStore.totalPages;
    data_modes = this.modesListStore.modes.entities;
    //  = this.modesListStore.listConfig;
    //  = this.modesListStore.getModesLoading;

    modeDialog: boolean = false;
    modes = signal<Mode[]>([]);
    mode!: Mode;
    modeForm!: FormGroup;
    submitted: boolean = false;
    list_options!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    columns = [
        { field: 'mod_id', header: 'mod_id', sortable: true, style: 'min-width: 10rem' },
      { field: 'mod_nom', header: 'mod_nom', sortable: true, style: 'min-width: 10rem' },
      { field: 'mod_etat', header: 'mod_etat', sortable: true, style: 'min-width: 10rem' },
      
      ];

    constructor(
        // private modeService: ModeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.loadData();
        this.modeForm = this.fb.group({
            mod_id: ['', Validators.required],
      mod_nom: ['', Validators.required],
      mod_etat: ['', Validators.required],
      
          });
    }

    loadData() {
        this.list_options = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
        ];

        this.cols = [
            { field: 'mod_id', header: 'mod_id' },
      { field: 'mod_nom', header: 'mod_nom' },
      { field: 'mod_etat', header: 'mod_etat' },
      
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.mode = {};
        this.submitted = false;
        this.modeDialog = true;
    }

    editMode(mode: Mode) {
        this.mode = { ...mode };
        this.modeDialog = true;
        this.modeForm.patchValue(this.mode);
    }

    hideDialog() {
        this.modeDialog = false;
        this.submitted = false;
    }

    deleteMode(mode: any) {
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
            if (this.mode.id) {
                this.modeStore.deleteMode(this.mode.id);
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

    saveMode() {
        this.submitted = true;
        if (this.modeForm.invalid) {
          return;
        }
        const formValue = this.modeForm.value;
        if (this.mode.id) {
            this.modeStore.updateMode(formValue);
        } else {
            this.modeStore.addMode(formValue);
        }
      
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Mode enregistré',
          life: 3000
        });
      
        this.modeDialog = false;
        this.modeForm.reset();
    }
}

