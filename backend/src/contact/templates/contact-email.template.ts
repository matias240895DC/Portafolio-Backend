export interface ContactMailData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const buildContactTextEmail = (contact: ContactMailData): string =>
  [
    'Nuevo mensaje desde el formulario de contacto',
    '',
    `Nombre: ${contact.name}`,
    `Email: ${contact.email}`,
    `Compania: ${contact.company || 'N/A'}`,
    '',
    'Mensaje:',
    `${contact.message}`,
  ].join('\n');

export const buildContactHtmlEmail = (contact: ContactMailData): string => {
  const name = escapeHtml(contact.name || '');
  const email = escapeHtml(contact.email || '');
  const company = escapeHtml(contact.company || 'N/A');
  const message = escapeHtml(contact.message || '').replace(/\n/g, '<br>');

  return `
    <div style="background:#f4f6fb;padding:24px;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;">
            <h2 style="margin:0;font-size:20px;">Nuevo mensaje de contacto</h2>
            <p style="margin:6px 0 0 0;font-size:13px;opacity:0.95;">Recibiste una nueva consulta desde tu portafolio</p>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#6b7280;width:130px;">Nombre</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;"><strong>${name}</strong></td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#6b7280;">Compania</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;">${company}</td>
              </tr>
            </table>

            <div style="margin-top:18px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Mensaje</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#111827;">${message}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#6b7280;">
              Tip: al responder este correo, se enviara al email del cliente gracias al campo Reply-To.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};
