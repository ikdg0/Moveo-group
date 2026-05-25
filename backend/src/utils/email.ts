import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../env';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  if (!env.sendgridApiKey) return null;
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: { user: 'apikey', pass: env.sendgridApiKey },
  });
  return transporter;
}

export async function sendBookingConfirmation(args: {
  to: string;
  firstName: string;
  origin: string;
  destination: string;
  scheduledAt: Date;
  vehicleType: string;
  price: number;
}): Promise<void> {
  const t = getTransporter();
  const subject = 'Confirmation de votre réservation Moveo';
  const html = `
    <div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#FFF;padding:24px;">
      <h2 style="color:#C8A96A;margin:0 0 12px;">Réservation confirmée</h2>
      <p>Bonjour ${args.firstName},</p>
      <p>Votre course est bien enregistrée.</p>
      <table style="border-collapse:collapse;margin-top:12px;">
        <tr><td style="padding:6px 12px;color:#888;">Départ</td><td>${args.origin}</td></tr>
        <tr><td style="padding:6px 12px;color:#888;">Destination</td><td>${args.destination}</td></tr>
        <tr><td style="padding:6px 12px;color:#888;">Date</td><td>${args.scheduledAt.toLocaleString('fr-BE')}</td></tr>
        <tr><td style="padding:6px 12px;color:#888;">Véhicule</td><td>${args.vehicleType}</td></tr>
        <tr><td style="padding:6px 12px;color:#888;">Prix estimé</td><td style="color:#C8A96A;font-weight:bold;">${args.price.toFixed(2)} €</td></tr>
      </table>
      <p style="margin-top:18px;color:#888;">Moveo Group — +32 2 897 18 40 — info@moveogroup.be</p>
    </div>
  `;
  if (!t) {
    console.log('[email] (dev no-op)', { to: args.to, subject });
    return;
  }
  await t.sendMail({ from: env.emailFrom, to: args.to, subject, html });
}
