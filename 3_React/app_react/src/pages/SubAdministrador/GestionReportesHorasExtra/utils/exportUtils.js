import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, TextRun, ImageRun, AlignmentType, WidthType } from 'docx';
import ExcelJS from 'exceljs';

// Función para generar documento Word
export const generarDocumentoWord = async (reporteData, usuario, logoUrl = '/img/NuevoLogo.png') => {
  try {
    // Cargar el logo como base64
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Encabezados de la tabla
    const headers = [
      'Fecha', 'Tipo', 'Denominación',
      'Horas Extra (reporte)', 'Valor Horas Extra',
      'Bono Salarial (horas)', 'Valor Bono Salarial',
      'Recargo', 'Valor Hora Extra'
    ];

    // Filas de datos
    const dataRows = reporteData.detalles.map(detalle => [
      detalle.fecha,
      detalle.tipo,
      detalle.denominacion,
      String(detalle.cantidadDividida),
      `$ ${Number(detalle.valorTotalDivididas).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      String(detalle.cantidadBono),
      `$ ${Number(detalle.valorTotalBono).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      ((detalle.recargo - 1) * 100).toFixed(0) + ' %',
      `$ ${Number(detalle.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
    ]);

    // Fila de suma total
    const totalRow = [
      { text: 'Totales', bold: true }, '', '',
      reporteData.totalHorasDivididas.toString(),
      `$ ${reporteData.totalPagarDivididas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      reporteData.totalHorasBono.toString(),
      `$ ${reporteData.totalPagarBono.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      '', ''
    ];

    // Fila de total a pagar
    const totalPagarRow = [
      { text: 'TOTAL A PAGAR', bold: true }, '', '', '', '', '', 
      { text: `$ ${reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`, bold: true, color: '388e3c' }, '', ''
    ];

    // Construir la tabla de docx
    const table = new DocxTable({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new DocxTableRow({
          children: headers.map(h => new DocxTableCell({
            children: [new Paragraph({ text: h, bold: true })],
            verticalAlign: 'center',
          }))
        }),
        ...dataRows.map(row => new DocxTableRow({
          children: row.map(cell => new DocxTableCell({
            children: [typeof cell === 'object'
              ? new Paragraph({ text: cell.text, bold: cell.bold, color: cell.color })
              : new Paragraph(cell)],
          }))
        })),
        new DocxTableRow({
          children: totalRow.map(cell =>
            new DocxTableCell({
              children: [
                typeof cell === 'object'
                  ? new Paragraph({ text: cell.text, bold: cell.bold })
                  : new Paragraph(cell)
              ],
            })
          )
        }),
        new DocxTableRow({
          children: totalPagarRow.map(cell =>
            new DocxTableCell({
              children: [
                typeof cell === 'object'
                  ? new Paragraph({ text: cell.text, bold: cell.bold, color: cell.color })
                  : new Paragraph(cell)
              ],
            })
          )
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  transformation: { width: 120, height: 60 },
                })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Reportes de hora extra de ${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}`,
                  bold: true,
                  size: 32,
                })
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun(`Email: ${usuario.email}`)
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total de horas extra (reporte): ${reporteData.totalHorasDivididas}  |  Valor: $ ${reporteData.totalPagarDivididas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                  bold: true,
                })
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total bono salarial (horas): ${reporteData.totalHorasBono}  |  Valor: $ ${reporteData.totalPagarBono.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                  bold: true,
                })
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `TOTAL A PAGAR: $ ${reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                  bold: true,
                })
              ],
              spacing: { after: 200 },
            }),
            table
          ]
        }
      ]
    });
    
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error('Error al generar documento Word:', error);
    throw error;
  }
};

// Función para generar documento Excel
export const generarDocumentoExcel = async (reporteData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Encabezados
    const headers = [
      'Fecha', 'Tipo', 'Denominación',
      'Horas Extra (reporte)', 'Valor Horas Extra',
      'Bono Salarial (horas)', 'Valor Bono Salarial',
      'Recargo', 'Valor Hora Extra'
    ];
    worksheet.addRow(headers);

    // Datos
    reporteData.detalles.forEach(detalle => {
      worksheet.addRow([
        detalle.fecha,
        detalle.tipo,
        detalle.denominacion,
        detalle.cantidadDividida,
        Number(detalle.valorTotalDivididas),
        detalle.cantidadBono,
        Number(detalle.valorTotalBono),
        ((detalle.recargo - 1) * 100) + '%',
        Number(detalle.valorHoraExtra)
      ]);
    });

    // Totales
    worksheet.addRow([
      'Totales', '', '',
      reporteData.totalHorasDivididas,
      reporteData.totalPagarDivididas,
      reporteData.totalHorasBono,
      reporteData.totalPagarBono,
      '', ''
    ]);
    worksheet.addRow([
      'TOTAL A PAGAR', '', '', '', '', '', reporteData.totalPagar, '', ''
    ]);

    // Estilos generales: bordes para todas las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell(cell => {
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Encabezado: fondo azul claro y negrita
    headers.forEach((_, idx) => {
      const cell = worksheet.getRow(1).getCell(idx + 1);
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE3F2FD' }
      };
    });

    // Fila de TOTAL A PAGAR: fondo verde y texto blanco
    const totalPagarRow = worksheet.lastRow.number;
    worksheet.getRow(totalPagarRow).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF388E3C' }
      };
    });

    // Ajusta el ancho de las columnas automáticamente
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2;
    });

    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error al generar documento Excel:', error);
    throw error;
  }
};

// Función para descargar documento Word
export const descargarWord = async (reporteData, usuario) => {
  try {
    const blobWord = await generarDocumentoWord(reporteData, usuario);
    const nombreArchivo = `Reportes de hora extra de ${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}.docx`;
    saveAs(blobWord, nombreArchivo);
  } catch (error) {
    console.error('Error al descargar Word:', error);
    throw error;
  }
};

// Función para descargar documento Excel
export const descargarExcel = async (reporteData, usuario) => {
  try {
    const buffer = await generarDocumentoExcel(reporteData);
    const nombreArchivo = `Reporte_horas_extra_${usuario.persona?.nombres || ''}_${usuario.persona?.apellidos || ''}.xlsx`;
    
    saveAs(
      new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      }), 
      nombreArchivo
    );
  } catch (error) {
    console.error('Error al descargar Excel:', error);
    throw error;
  }
};
