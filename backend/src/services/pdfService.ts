// import html2pdf from 'html2pdf.js';

// Accept any scadenza with the required aggregated name fields
interface ScadenzaForPDF {
  name: string;
  calculated_date: string | null;
  utenti_names: string | null;
  clienti_names: string | null;
  rec: number;
}

export async function generateScadenzePDF(scadenze: any[]): Promise<Buffer> {
  // Stub implementation to prevent crash. 
  // html2pdf.js is a browser-only library and doesn't work in Node.js.
  console.warn('PDF generation is currently disabled because it depends on a browser library.');
  
  // Return a simple PDF-like text buffer for now
  return Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Scadenze Export) /Creator (StudioMar) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
}

/**
 * Escape HTML special characters to prevent issues in the PDF
 */
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}