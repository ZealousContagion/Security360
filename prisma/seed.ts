import { PrismaClient, Prisma } from '@/generated/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Users
    const passwordHash = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@security360.co.zw' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@security360.co.zw',
            password: passwordHash,
            role: 'ADMIN',
        },
    })

    const finance = await prisma.user.upsert({
        where: { email: 'finance@security360.co.zw' },
        update: {},
        create: {
            name: 'Finance User',
            email: 'finance@security360.co.zw',
            password: passwordHash,
            role: 'FINANCE',
        },
    })

    const sales = await prisma.user.upsert({
        where: { email: 'sales@security360.co.zw' },
        update: {},
        create: {
            name: 'Sales User',
            email: 'sales@security360.co.zw',
            password: passwordHash,
            role: 'SALES',
        },
    })

    // 2. Fencing Services
    const servicesData = [
        { name: 'Diamond Mesh', pricePerMeter: 15.00, installationFee: 100.00, supportsElectric: false, supportsRazor: true },
        { name: 'Game Fence', pricePerMeter: 25.00, installationFee: 150.00, supportsElectric: true, supportsRazor: false },
        { name: 'Electric Fence', pricePerMeter: 12.00, installationFee: 200.00, supportsElectric: true, supportsRazor: false },
        { name: 'Razor Wire', pricePerMeter: 8.00, installationFee: 80.00, supportsElectric: true, supportsRazor: true },
    ]

    for (const s of servicesData) {
        await prisma.fencingService.create({
            data: s
        })
    }

    // 3. Add-ons
    const addonsData = [
        { name: 'Razor topping', pricingType: 'PER_METER', price: 5.00 },
        { name: 'Gate', pricingType: 'FLAT', price: 500.00 },
        { name: 'Concrete footing', pricingType: 'PER_METER', price: 10.00 },
    ]

    for (const a of addonsData) {
        await prisma.fencingAddon.create({
            data: a
        })
    }

    // 4. Customers
    const customerRef = await prisma.customer.create({
        data: {
            name: 'Residential Customer',
            phone: '+263123456789',
            address: '123 Harare Drive',
        }
    })

    const commercialRef = await prisma.customer.create({
        data: {
            name: 'Commercial Client',
            phone: '+263987654321',
            address: '456 Bulawayo Rd',
        }
    })

    // 5. Catalog Items
    const catalogData = [
        { name: "Larch Timber Post", category: "Materials", price: 15.50, unit: "each", description: "Standard 2.4m post" },
        { name: "Chain Link Wire", category: "Materials", price: 12.00, unit: "m", description: "Galvanized 50mm mesh" },
        { name: "Site Survey", category: "Service", price: 75.00, unit: "hour", description: "On-site assessment" },
        { name: "Cement (50kg)", category: "Materials", price: 14.00, unit: "bag", description: "Standard Portland Cement" },
    ]
    const createdCatalog: any = {}
    for (const c of catalogData) {
        const item = await prisma.catalogItem.create({ data: c })
        createdCatalog[c.name] = item
    }

    // 5b. Link Services to Materials (BOM)
    const diamondMesh = await prisma.fencingService.findFirst({ where: { name: 'Diamond Mesh' } })
    if (diamondMesh) {
        await prisma.billOfMaterials.createMany({
            data: [
                { fencingServiceId: diamondMesh.id, catalogItemId: createdCatalog["Larch Timber Post"].id, quantityPerMeter: 0.33, wastageFactor: 1.05 }, // 1 post every 3m
                { fencingServiceId: diamondMesh.id, catalogItemId: createdCatalog["Chain Link Wire"].id, quantityPerMeter: 1.0, wastageFactor: 1.10 },
                { fencingServiceId: diamondMesh.id, catalogItemId: createdCatalog["Cement (50kg)"].id, quantityPerMeter: 0.1, wastageFactor: 1.0 },
            ]
        })
    }

    // 6. Expenses
    const expenseData = [
        { amount: 1250.00, category: "Materials", description: "Timber Posts x50 (Larch)", date: new Date() },
        { amount: 85.40, category: "Fuel", description: "Van Refuel - Shell Station", date: new Date() },
        { amount: 450.00, category: "Tools", description: "Hilti Drill Repair", date: new Date() },
    ]
    for (const e of expenseData) {
        await prisma.expense.create({ data: e })
    }

    // 7. Team Members
    const teamData = [
        { name: "John Doe", role: "Administrator", email: "john@security360.co.zw", status: "ACTIVE" },
        { name: "Jane Smith", role: "Project Manager", email: "jane@security360.co.zw", status: "ACTIVE" },
        { name: "Robert Fox", role: "Field Technician", email: "robert@security360.co.zw", status: "AWAY" },
    ]
    for (const t of teamData) {
        await prisma.teamMember.create({ data: t })
    }

    // 8. Notifications
    const notificationData = [
        { type: 'ALERT', title: 'New Quote Request', message: 'Customer "Mark Spencer" requested a quote for a 20m perimeter fence.' },
        { type: 'SUCCESS', title: 'Payment Received', message: 'Invoice INV-4410 has been paid in full by Sarah Wilson.' },
        { type: 'WARNING', title: 'Late Payment Reminder', message: 'Invoice INV-4398 is 3 days overdue.' },
        { type: 'INFO', title: 'System Update', message: 'Security 360 will undergo maintenance on Sunday at 2 AM GMT.' },
    ]
    for (const n of notificationData) {
        await prisma.notification.create({ data: n })
    }

    // 10. Suppliers
    const supplierData = [
        { name: "Harare Timber & Steel", email: "sales@hararetimber.co.zw", phone: "+263 242 123456", address: "15 Coventry Rd, Workington" },
        { name: "Global Fencing Supplies", email: "info@globalfencing.com", phone: "+263 772 987654", address: "88 Willowvale Rd" },
    ]
    for (const s of supplierData) {
        await prisma.supplier.create({ data: s })
    }

    // 9. Sample Quote (Draft)
    const service = await prisma.fencingService.findFirst()
    if (service) {
        await prisma.fenceQuote.create({
            data: {
                customerId: customerRef.id,
                fencingServiceId: service.id,
                lengthMeters: 50,
                heightMeters: 1.8,
                terrain: 'FLAT',
                addOnIds: [],
                subtotal: 750 + 100, // example
                vat: (850) * 0.15,
                total: 850 * 1.15,
                status: 'DRAFT'
            }
        })
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
