// src/app/components/pdf-demo/pdf-demo.component.ts
import { Component } from '@angular/core';
import { PdfTemplateService } from './pdf-template.service';

@Component({
  selector: 'app-pdf-demo',
  template: `<button (click)="generatePdf()">Générer PDF</button>`
})
export class PdfDemoComponent {
  constructor(private pdfService: PdfTemplateService) {}

  generatePdf() {
    // Données dynamiques (peuvent venir d'une API)
    const data = [
      ['Nom', 'Prénom', 'Âge'],
      ['Dupont', 'Jean', '30'],
      ['Durand', 'Marie', '25']
    ];

    // Convertir en format pdfMake
    const table = {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*'],
        body: data
      },
      layout: 'lightHorizontalLines',
      style: 'normal'
    };

    // Appeler le service pour générer
    this.pdfService.buildPdf([
      { text: 'Liste des utilisateurs', style: 'header' },
      table
    ]);
  }
}





// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// export function generatePdf() {
//   const docDefinition: any = {
//     content: [
//       {
//         table: {
//           headerRows: 2, // On indique qu'il y a 2 lignes d'en-tête
//           widths: ['*', '*', '*', '*'],
//           body: [
//             // Première ligne d'en-tête (fusion horizontale et verticale)
//             [
//               { text: 'Catégorie', rowSpan: 2, bold: true, fillColor: '#eeeeee', alignment: 'center' },
//               { text: 'Produit', colSpan: 2, bold: true, fillColor: '#eeeeee', alignment: 'center' }, {},
//               { text: 'Total', rowSpan: 2, bold: true, fillColor: '#eeeeee', alignment: 'center' }
//             ],
//             // Deuxième ligne d'en-tête
//             [
//               {}, // Cellule vide car fusionnée avec "Catégorie"
//               { text: 'Nom', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//               { text: 'Prix', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//               {}  // Cellule vide car fusionnée avec "Total"
//             ],
//             // Données
//             ['Fruits', 'Pomme', '2 €', '20 €'],
//             ['Fruits', 'Banane', '1 €', '10 €'],
//             ['Légumes', 'Carotte', '0.5 €', '5 €'],
//           ]
//         }
//       }
//     ]
//   };

//   pdfMake.createPdf(docDefinition).open();
// }





// import { Component } from '@angular/core';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// @Component({
//   selector: 'app-pdf-table',
//   template: `<button (click)="generatePDF()">Générer PDF</button>`,
// })
// export class PdfTableComponent {
//   generatePDF() {
//     const data = [
//       { produit: 'Produit A', qte: 2, prix: 1500 },
//       { produit: 'Produit B', qte: 1, prix: 2000 },
//       { produit: 'Produit C', qte: 3, prix: 1200 }
//     ];

//     const total = data.reduce((sum, row) => sum + row.prix * row.qte, 0);

//     const tableBody = [
//       [
//         { text: 'Produit', bold: true },
//         { text: 'Quantité', bold: true, alignment: 'right' },
//         { text: 'Prix', bold: true, alignment: 'right' }
//       ],
//       ...data.map((row, i) => [
//         row.produit,
//         { text: row.qte.toString(), alignment: 'right' },
//         { text: (row.prix * row.qte).toLocaleString(), alignment: 'right' }
//       ]),
//       [
//         { text: 'Total', bold: true, colSpan: 2, alignment: 'right' }, {},
//         { text: total.toLocaleString(), bold: true, alignment: 'right' }
//       ]
//     ];

//     const docDefinition: any = {
//       content: [
//         { text: 'Facture', style: 'header' },
//         {
//           table: {
//             widths: ['*', 'auto', 'auto'],
//             body: tableBody
//           },
//           layout: {
//             fillColor: function (rowIndex: number, _node: any, _columnIndex: number) {
//               return rowIndex === 0
//                 ? '#CCCCCC' // En-tête gris
//                 : rowIndex % 2 === 0
//                 ? '#F9F9F9' // Ligne paire
//                 : null;
//             },
//             hLineWidth: function (i: number, node: any) {
//               return 0.8; // épaisseur horizontale
//             },
//             vLineWidth: function (i: number, node: any) {
//               return 0.8; // épaisseur verticale
//             },
//             hLineColor: function (i: number, node: any) {
//               return '#666'; // couleur lignes horizontales
//             },
//             vLineColor: function (i: number, node: any) {
//               return '#666'; // couleur lignes verticales
//             }
//           }
//         }
//       ],
//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           margin: [0, 0, 0, 10]
//         }
//       }
//     };

//     pdfMake.createPdf(docDefinition).open();
//   }
// }