/** Helper. Rejects empty or incomplete addresses before a form continues. */
export function isValidEmailAddress(emailAddress: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim());
}
