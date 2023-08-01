import { Stack } from './stack';
import jsPDF from 'jspdf';

const formatDate = (date: Date): string =>
  [
    date.getFullYear().toString(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
  ].join('');

const printCanvases = (stack: Stack) => {
  const pdf = new jsPDF({ orientation: 'landscape' }); // a4 = 210 x 297 mm
  const width = stack.layers[0].cnv.width;
  const height = stack.layers[0].cnv.height;

  const pageWidth = 297;
  const pageHeight = 210;
  const R = 1; // zoom factor
  const S = Math.min(pageHeight / height, pageWidth / width) * R;

  // First canvas
  pdf.addImage(
    stack.layers[0].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );

  // Second canvas
  pdf.addPage();
  pdf.addImage(
    stack.layers[1].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );

  // Third canvas
  pdf.addPage();
  pdf.addImage(
    stack.layers[2].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );

  // Final page with all three canvases
  pdf.addPage();
  pdf.addImage(
    stack.layers[0].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );
  pdf.addImage(
    stack.layers[1].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );
  pdf.addImage(
    stack.layers[2].cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );
  pdf.addImage(
    stack.layerOver.cnv,
    'PNG',
    -(width * S - pageWidth) / 2,
    -(height * S - pageHeight) / 2,
    width * S,
    height * S,
  );

  pdf.save(`barycenter-${formatDate(new Date())}.pdf`);
};

export { printCanvases };
