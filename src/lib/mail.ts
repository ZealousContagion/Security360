import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_123');

interface SendQuoteEmailParams {
    to: string;
    customerName: string;
    quoteId: string;
    amount: string;
    portalUrl: string;
}

export async function sendQuoteEmail({ to, customerName, quoteId, amount, portalUrl }: SendQuoteEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Security 360 <quotes@security360.co.zw>',
            to: [to],
            subject: `Your Fencing Quote - ${quoteId.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #FFB700; text-transform: uppercase; letter-spacing: 2px;">Security 360</h2>
                    <p>Hi <strong>${customerName}</strong>,</p>
                    <p>Thank you for requesting a quote for your fencing project.</p>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Total Amount:</p>
                        <h1 style="margin: 5px 0; font-size: 32px;">£${amount}</h1>
                    </div>
                    <p>You can review the full specifications and approve your quote via our secure portal:</p>
                    <a href="${portalUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Open Customer Portal</a>
                    <p style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                        This quote is valid for 30 days. If you have any questions, please reply to this email.
                    </p>
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
