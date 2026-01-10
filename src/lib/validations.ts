import { z } from 'zod';

export const QuoteSchema = z.object({
    customerId: z.string().uuid({ message: "Invalid Customer ID" }),
    fencingServiceId: z.string().uuid({ message: "Invalid Service ID" }),
    lengthMeters: z.number().positive({ message: "Length must be greater than 0" }),
    heightMeters: z.number().positive({ message: "Height must be greater than 0" }),
    terrain: z.enum(['FLAT', 'SLOPED', 'ROCKY'], { 
        errorMap: () => ({ message: "Terrain must be FLAT, SLOPED, or ROCKY" }) 
    }),
    addOnIds: z.array(z.string().uuid()).optional().default([]),
});

export const CatalogItemSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    description: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative"),
    unit: z.string().min(1, "Unit is required"),
    category: z.string().min(1, "Category is required"),
});
