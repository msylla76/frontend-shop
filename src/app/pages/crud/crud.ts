import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { FormFieldComponent } from '@libs/ui/fields/form-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        
        ReactiveFormsModule,
        FormFieldComponent
    ],
    templateUrl: './crud.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Crud implements OnInit {
    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;
    productForm!: FormGroup;

    // selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    columns = [
        // { field: 'code', header: 'Code', sortable: false, style: 'width: 16rem' },
        { field: 'name', header: 'Name', sortable: true, style: 'min-width: 16rem' },
        { field: 'image', header: 'Image', sortable: false },
        { field: 'price', header: 'Price', sortable: true, style: 'min-width: 8rem' },
        { field: 'category', header: 'Category', sortable: true, style: 'min-width: 10rem' },
        { field: 'rating', header: 'Reviews', sortable: true, style: 'min-width: 12rem' },
        { field: 'inventoryStatus', header: 'Status', sortable: true, style: 'min-width: 12rem' },
      ];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.loadData();
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            category: ['', Validators.required],
            inventoryStatus: ['', Validators.required]
          });
    }

    loadData() {
        this.productService.getProducts().then((data) => {
            this.products.set(data);
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
        this.productForm.patchValue(this.product);
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    // deleteProduct(product: Product) {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure you want to delete ' + product.name + '?',
    //         header: 'Confirm',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.products.set(this.products().filter((val) => val.id !== product.id));
    //             this.product = {};
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Deleted',
    //                 life: 3000
    //             });
    //         }
    //     });
    // }
    deleteProduct(product: any) {
        this.confirmationService.confirm({
          message: `Voulez-vous vraiment supprimer <b>${product.name}</b> ?`,
          header: 'Confirmation',
          icon: 'pi pi-trash', // autre icône : pi pi-exclamation-triangle
          acceptLabel: 'Oui',  // change "Yes" en "Oui"
          rejectLabel: 'Non',  // change "No" en "Non"
          acceptButtonStyleClass: 'p-button-danger p-button-sm', // bouton rouge
          rejectButtonStyleClass: 'p-button-secondary p-button-sm', // bouton gris
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: () => {
                 this.products.set(this.products().filter((val) => val.id !== product.id));
            // this.products = this.products.filter(p => p.id !== product.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `Produit "${product.name}" supprimé`,
              life: 3000
            });
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

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }
    saveProduct() {
        this.submitted = true;
        if (this.productForm.invalid) {
          return;
        }
      
        const formValue = this.productForm.value;
        let _products = this.products();
      
        if (this.product.id) {
          const index = this.findIndexById(this.product.id);
          this.product = { ...this.product, ...formValue };
          _products[index] = this.product;
        } else {
          this.product = {
            ...formValue,
            id: this.createId(),
            image: 'product-placeholder.svg'
          };
          _products.push(this.product);
        }
      
        this.products.set([..._products]);
      
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product saved',
          life: 3000
        });
      
        this.productDialog = false;
        this.productForm.reset();
    }
}
