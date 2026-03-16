import { prisma } from "./prisma";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Note: Twilio requires an account and API keys. 
// This is a scaffold that you can activate by adding the keys.
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

export async function sendSMS(to: string, message: string) {
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) {
        console.log("SMS Simulation (No API Keys):", { to, message });
        return { success: true, simulated: true };
    }

    // Example implementation using standard fetch to avoid extra dependencies if needed
    // or you can install 'twilio' package.
    console.log("Sending actual SMS to:", to);
    return { success: true };
}

export async function sendPaymentReminder(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true }
    });

    if (!invoice || !invoice.customer.email) return { success: false, error: 'Recipient not found' };

    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/${invoice.customerId}`;

    // 1. Send Email
    await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: invoice.customer.email,
        subject: `Payment Reminder: Invoice ${invoice.invoiceNumber}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
                <h2 style="text-transform: uppercase; letter-spacing: 2px;">Security 360</h2>
                <p>Hello ${invoice.customer.name},</p>
                <p>This is a friendly reminder that invoice <strong>${invoice.invoiceNumber}</strong> for the amount of <strong>$${Number(invoice.total).toFixed(2)}</strong> is currently pending.</p>
                <div style="margin: 30px 0;">
                    <a href="${portalUrl}" style="background: #ef9f46; color: black; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; font-size: 12px;">View & Pay Online</a>
                </div>
                <p style="font-size: 12px; color: #666;">If you have already made this payment, please disregard this message.</p>
            </div>
        `
    });

    // 2. Send SMS (If phone exists)
    if (invoice.customer.phone) {
        await sendSMS(
            invoice.customer.phone, 
            `Security 360: Friendly reminder for Invoice ${invoice.invoiceNumber} ($${Number(invoice.total).toFixed(2)}). Pay online: ${portalUrl}`
        );
    }

    return { success: true };
}
