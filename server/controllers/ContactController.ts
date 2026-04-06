import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const sendContactEmail = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Thumblify Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,          // email sent to yourself
            replyTo: email,                       // reply goes to the sender
            subject: `📬 New message from ${name} — Thumblify`,
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0f0e17;padding:32px;border-radius:16px;color:#e8e8f0;border:1px solid #2a2845">
                    <h2 style="margin:0 0 24px;font-size:22px;color:#ff6fd8">
                        New Contact Message
                    </h2>
                    <table style="width:100%;border-collapse:collapse">
                        <tr>
                            <td style="padding:10px 0;color:#aaa;width:100px">Name</td>
                            <td style="padding:10px 0;font-weight:600">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0;color:#aaa">Email</td>
                            <td style="padding:10px 0">
                                <a href="mailto:${email}" style="color:#00e5ff;text-decoration:none">${email}</a>
                            </td>
                        </tr>
                    </table>
                    <hr style="border:none;border-top:1px solid #2a2845;margin:20px 0"/>
                    <p style="color:#aaa;margin-bottom:8px;font-size:14px">Message</p>
                    <p style="white-space:pre-line;background:#1a1830;padding:16px;border-radius:10px;margin:0">${message}</p>
                    <p style="margin-top:28px;font-size:12px;color:#555">Sent via Thumblify contact form</p>
                </div>
            `,
        });

        return res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error: any) {
        console.error('Contact email error:', error);
        return res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }
};
