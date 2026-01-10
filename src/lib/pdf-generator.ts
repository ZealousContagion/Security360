import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuoteEstimation } from './quoting-engine';

export async function generateQuotePDF(
    quoteId: string,
    customer: any,
    service: any,
    estimation: QuoteEstimation,
    signatureData?: string | null
) {
    const doc = new jsPDF();
    const gold = [239, 159, 70];
    const black = [0, 0, 0];

    // -- Header --
    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SECURITY 360", 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("FENCING MANAGEMENT SYSTEMS", 20, 32);

    // -- Quote Info --
    doc.setTextColor(black[0], black[1], black[2]);
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

    autoTable(doc, {
        startY: 85,
        head: [['SERVICE DESCRIPTION', 'SUBTOTAL', 'VAT', 'TOTAL']],
        body: tableBody,
        headStyles: { fillColor: black as any, textColor: gold as any, fontSize: 9, fontStyle: 'bold' },
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

    autoTable(doc, {
        startY: finalY + 5,
        head: [['MATERIAL', 'QUANTITY', 'EST. COST']],
        body: bomBody,
        headStyles: { fillColor: [240, 240, 240], textColor: black as any, fontSize: 8 },
        styles: { fontSize: 8 },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' }
        }
    });

    // -- Summary Box & Signature --
    const summaryY = (doc as any).lastAutoTable.finalY + 20;
    
    if (signatureData) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER SIGNATURE:", 20, summaryY + 5);
        doc.addImage(signatureData, 'PNG', 20, summaryY + 10, 50, 20);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`Digitally signed on ${new Date().toLocaleString()}`, 20, summaryY + 35);
    }

    doc.setFillColor(255, 183, 0); // Background for summary
    // Using opacity via rect options if needed, but jspdf is simple.
    doc.rect(130, summaryY, 60, 30, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(black[0], black[1], black[2]);
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

export async function generateJobSheetPDF(
    jobId: string,
    customer: any,
    service: any,
    specs: { length: number, height: number, terrain: string },
    materials: any[],
    assignedTo?: string | null,
    scheduledDate?: Date | null
) {
    const doc = new jsPDF();
    const gold = [239, 159, 70];
    const black = [0, 0, 0];

    // -- Header --
    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("JOB SHEET", 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`ID: ${jobId.slice(0, 8).toUpperCase()} | ${new Date().toLocaleDateString()}`, 20, 32);

    // -- Client & Assignment Info --
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT INFORMATION", 20, 55);
    doc.setFontSize(12);
    doc.text(customer?.name || "N/A", 20, 62);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(customer?.address || "N/A", 20, 68);
    doc.text(customer?.phone || "N/A", 20, 73);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ASSIGNMENT", 120, 55);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Technician: ${assignedTo || 'Unassigned'}`, 120, 62);
    doc.text(`Scheduled: ${scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'Pending'}`, 120, 68);

    // -- Specs Table --
    const specData = [
        ['Service', service?.name || 'Standard'],
        ['Length', `${specs.length}m`],
        ['Height', `${specs.height}m`],
        ['Terrain', specs.terrain]
    ];

    autoTable(doc, {
        startY: 85,
        head: [['SPECIFICATION', 'DETAILS']],
        body: specData,
        headStyles: { fillColor: black as any, textColor: gold as any, fontSize: 9 },
        styles: { fontSize: 8 }
    });

    // -- Bill of Materials --
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LOADING LIST (BILL OF MATERIALS)", 20, finalY);

    const bomBody = materials.map((m, idx) => {
        const qty = Math.ceil(Number(m.quantityPerMeter) * Number(specs.length) * Number(m.wastageFactor));
        return [
            idx + 1,
            m.catalogItem.name,
            `${qty} ${m.catalogItem.unit}`
        ];
    });

    autoTable(doc, {
        startY: finalY + 5,
        head: [['#', 'MATERIAL ITEM', 'QUANTITY']],
        body: bomBody,
        headStyles: { fillColor: [240, 240, 240], textColor: black as any, fontSize: 8 },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 10 },
            2: { halign: 'right' }
        }
    });

    // -- Sign-off Section --
    const signY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SITE OBSERVATIONS:", 20, signY);
    doc.rect(20, signY + 5, 170, 30); // Notes box

    doc.text("COMPLETION VERIFICATION:", 20, signY + 45);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("[ ] Site cleaned and debris removed", 20, signY + 52);
    doc.text("[ ] Client inspection completed", 20, signY + 58);

    doc.line(20, signY + 80, 100, signY + 80);
    doc.text("Technician Signature", 20, signY + 85);
    
    doc.line(120, signY + 80, 170, signY + 80);
    doc.text("Date", 120, signY + 85);

    // -- Footer --
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Security 360 Operational Intelligence System | Document Version 2.1", 105, 285, { align: 'center' });

    return doc;
}
