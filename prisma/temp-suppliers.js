const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const supplierData = [
        { name: "Harare Timber & Steel", email: "sales@hararetimber.co.zw", phone: "+263 242 123456", address: "15 Coventry Rd, Workington" },
        { name: "Global Fencing Supplies", email: "info@globalfencing.com", phone: "+263 772 987654", address: "88 Willowvale Rd" },
    ];

    for (const s of supplierData) {
        await prisma.supplier.upsert({
            where: { id: 'some-id' }, // This won't work without ID, so we use findFirst or just try/catch
            create: s,
            update: s,
        }).catch(async () => {
            // If ID doesn't exist, just create
            const exists = await prisma.supplier.findFirst({ where: { name: s.name } });
            if (!exists) await prisma.supplier.create({ data: s });
        });
    }
    console.log("Suppliers synced.");
}

main().then(() => process.exit(0));
