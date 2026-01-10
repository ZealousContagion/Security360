import Stripe from 'stripe';

export function getStripe() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey && process.env.NODE_ENV === 'production') {
        console.warn('STRIPE_SECRET_KEY is missing');
    }

    return new Stripe(apiKey || '', {
        apiVersion: '2025-01-27.acacia' as any,
    });
}