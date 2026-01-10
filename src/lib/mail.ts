import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey || 're_placeholder_123');

interface SendQuoteEmailParams {
    to: string;
    customerName: string;
    quoteId: string;
    amount: string;
    portalUrl: string;
}

export async function sendQuoteEmail({ to, customerName, quoteId, amount, portalUrl }: SendQuoteEmailParams) {
    if (!apiKey || apiKey.startsWith('re_placeholder')) {
        console.warn("Resend API Key is missing or invalid. Email not sent.");
        return { success: false, error: "Email service not configured (API Key missing)." };
    }

    try {
        // Dev Mode: Override recipient to TEST_EMAIL if set
        const recipient = process.env.TEST_EMAIL || to;
        
        if (process.env.TEST_EMAIL) {
            console.log(`[Dev Mode] Redirecting email for ${to} to ${process.env.TEST_EMAIL}`);
        }

        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Security 360 <onboarding@resend.dev>',
            to: [recipient],
            subject: `Quote #${quoteId.slice(0, 8).toUpperCase()} from Security 360`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                    <div style="margin-bottom: 30px; border-bottom: 2px solid #ef9f46; padding-bottom: 20px;">
                        <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 24px; font-weight: 900;">Security 360</h2>
                        <p style="margin: 5px 0 0; color: #ef9f46; font-size: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Fencing Management Systems</p>
                    </div>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 24px;">Hi <strong>${customerName}</strong>,</p>
                    <p style="color: #374151; font-size: 16px; line-height: 24px;">Here is the quote you requested for your fencing project. You can review the full breakdown, specifications, and approve it directly online.</p>
                    
                    <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ef9f46;">
                        <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Estimated Total</p>
                        <h1 style="margin: 8px 0 0; font-size: 36px; color: #111827; font-weight: 900;">£${amount}</h1>
                    </div>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${portalUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; transition: background 0.3s;">
                            Review & Approve Quote
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 20px; text-align: center;">
                        Alternatively, copy and paste this link into your browser:<br>
                        <a href="${portalUrl}" style="color: #ef9f46; text-decoration: none;">${portalUrl}</a>
                    </p>

                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="color: #9ca3af; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Security 360. All rights reserved.</p>
                        <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0;">Harare, Zimbabwe</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error("Email sending failed:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Email sending exception:", err);
        return { success: false, error: err };
    }
}