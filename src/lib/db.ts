import fs from 'fs/promises';
import path from 'path';

import { FENCING_TYPES, FENCE_ADDONS } from './mock-fencing-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'fencing.json');

// Ensure data directory exists
async function ensureDb() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(DB_PATH);
        } catch {
            // Initial empty data
            await fs.writeFile(DB_PATH, JSON.stringify({
                quotes: [],
                invoices: [],
                fencingTypes: FENCING_TYPES,
                addons: FENCE_ADDONS
            }, null, 2));
        }
    } catch (error) {
        console.error('Failed to initialize DB:', error);
    }
}

export async function getFencingTypes() {
    const db = await readDb();
    return db.fencingTypes;
}

export async function getAddons() {
    const db = await readDb();
    return db.addons;
}

export async function readDb() {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export async function writeDb(data: any) {
    await ensureDb();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function addQuote(quote: any) {
    const db = await readDb();
    const newQuote = {
        ...quote,
        id: `Q-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: db.quotes.length === 0 ? 'Sent' : 'Draft' // Just for variety in demo
    };
    db.quotes.unshift(newQuote);
    await writeDb(db);
    return newQuote;
}

export async function getQuotes() {
    const db = await readDb();
    return db.quotes;
}

export async function addInvoice(invoice: any) {
    const db = await readDb();
    const newInvoice = {
        ...invoice,
        id: `INV-${Date.now()}`,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };
    db.invoices.unshift(newInvoice);
    await writeDb(db);
    return newInvoice;
}
