/** Studio contact details, shared by the contact section, footer and floating CTA. */
export const EMAIL = "lockrythm@gmail.com";

/** WhatsApp number in local (display) and international (wa.me) formats. */
export const WHATSAPP_DISPLAY = "+92 312 6203644";
const WHATSAPP_INTL = "923126203644";

/** wa.me link that opens a chat with an optional pre-filled message. */
export function whatsappHref(message = "Hi LockRhythm! I have a project in mind and would like to discuss it.") {
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`;
}
