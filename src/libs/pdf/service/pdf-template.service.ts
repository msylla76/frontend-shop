// src/app/services/pdf-template.service.ts
import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// ✅ Correction : accès direct à vfs + typage contourné
(pdfMake as any).vfs = pdfFonts.vfs;

@Injectable({ providedIn: 'root' })
export class PdfTemplateService {

  // Styles communs
  private styles = {
    header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 10, 0, 10] },
    tableHeader: { bold: true, fillColor: '#eeeeee', fontSize: 12 },
    normal: { fontSize: 10 }
  };

  // Header commun
  private header = {
    text: 'Mon Entreprise - Rapport',
    style: 'header'
  };

  // Footer commun (numérotation des pages)
  private footer = (currentPage: number, pageCount: number) => {
    return {
      text: `Page ${currentPage} / ${pageCount}`,
      alignment: 'center',
      fontSize: 8,
      margin: [0, 10, 0, 0]
    };
  };

  /**
   * Construit le document PDF avec contenu dynamique
   */
  public buildPdf(content: any) {
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: this.header,
      footer: this.footer,
      content: content,
      styles: this.styles
    };

    pdfMake.createPdf(docDefinition).open();
  }
}