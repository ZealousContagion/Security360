import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { QuoteEstimation } from './quoting-engine';

export async function generateQuotePDF(
    quoteId: string,
    customer: any,
    service: any,
    estimation: QuoteEstimation
) {
    const doc: any = new jsPDF();
    const gold = [255, 183, 0];
    const black = [0, 0, 0];

    // -- Header --
    doc.setFillColor(...black);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(...gold);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SECURITY 360", 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("FENCING MANAGEMENT SYSTEMS", 20, 32);

    // -- Quote Info --
    doc.setTextColor(...black);
    doc.setFontSize(10);
    doc.text("QUOTE TO:", 20, 55);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(customer?.name || "Valued Customer", 20, 62);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(customer?.address || "No Address Provided", 20, 68);
    doc.text(customer?.phone || "No Phone Provided", 20, 73);

    doc.setFontSize(10);
    doc.text("QUOTE ID:", 140, 55);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(quoteId.slice(0, 8).toUpperCase(), 140, 62);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 140, 68);

    // -- Table --
    const tableBody = [
        [service?.name, `${estimation.subtotal.toFixed(2)}`, `15%`, `${estimation.total.toFixed(2)}`]
    ];

    (doc as any).autoTable({
        startY: 85,
        head: [['SERVICE DESCRIPTION', 'SUBTOTAL', 'VAT', 'TOTAL']],
        body: tableBody,
        headStyles: { fillColor: black, textColor: gold, fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        }
    });

    // -- Bill of Materials --
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ESTIMATED BILL OF MATERIALS", 20, finalY);

    const bomBody = estimation.materials.map(m => [
        m.name,
        `${m.quantity} ${m.unit}`,
        `£${m.estimatedCost.toFixed(2)}`
    ]);

    (doc as any).autoTable({
        startY: finalY + 5,
        head: [['MATERIAL', 'QUANTITY', 'EST. COST']],
        body: bomBody,
        headStyles: { fillColor: [240, 240, 240], textColor: black, fontSize: 8 },
        styles: { fontSize: 8 },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' }
        }
    });

    // -- Summary Box --
    const summaryY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFillColor(255, 183, 0, 0.1);
    doc.rect(130, summaryY, 60, 30, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...black);
    doc.text("GRAND TOTAL", 135, summaryY + 12);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`£${estimation.total.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 135, summaryY + 22);

    // -- Footer --
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("This quote is valid for 30 days. All estimates are subject to an on-site final survey.", 105, 285, { align: 'center' });
    doc.text("Security 360 Pay - Digital Quoting Module v1.0", 105, 290, { align: 'center' });

    return doc;
}
