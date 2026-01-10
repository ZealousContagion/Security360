import { z } from 'zod';

export const QuoteSchema = z.object({
    customerId: z.string().uuid({ message: "Invalid Customer ID" }),
    fencingServiceId: z.string().uuid({ message: "Invalid Service ID" }),
    lengthMeters: z.number().positive({ message: "Length must be greater than 0" }),
    heightMeters: z.number().positive({ message: "Height must be greater than 0" }),
    terrain: z.enum(['FLAT', 'SLOPED', 'ROCKY']),
    addOnIds: z.array(z.string().uuid()).optional().default([]),
});

export const CatalogItemSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    description: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative"),
    unit: z.string().min(1, "Unit is required"),
    category: z.string().min(1, "Category is required"),
});

export const PurchaseOrderSchema = z.object({
    supplierId: z.string().uuid("Invalid Supplier ID"),
    items: z.array(z.object({
        catalogItemId: z.string().uuid("Invalid Item ID"),
        quantity: z.number().positive("Quantity must be positive"),
        unitPrice: z.number().nonnegative("Unit price cannot be negative"),
    })).min(1, "At least one item is required"),
});

export const CustomerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().min(6, "Phone number is too short").optional().or(z.literal('')),
    address: z.string().min(5, "Address is too short").optional().or(z.literal('')),
});

export const TeamMemberSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    role: z.string().min(2, "Role is required"),
    status: z.enum(['ACTIVE', 'INACTIVE', 'AWAY']).default('ACTIVE'),
});

export const ExpenseSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.number().positive("Amount must be positive"),
    description: z.string().min(3, "Description is too short"),
    date: z.date().default(() => new Date()),
    jobId: z.string().uuid().optional().or(z.literal('')),
});
