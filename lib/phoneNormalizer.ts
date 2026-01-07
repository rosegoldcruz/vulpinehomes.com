// lib/phoneNormalizer.ts

/**
 * Normalize phone number to digits only
 * Accepts all common formats:
 * - 4803648205
 * - 480-364-8205
 * - (480) 364-8205
 * - (480)-364-8205
 * - 480 364 8205
 * - +1 480 364 8205
 * 
 * Returns: digits only (e.g., "4803648205")
 * Returns null if input is empty or null
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone || phone.trim() === '') {
    return null;
  }
  
  // Strip all non-numeric characters
  const normalized = phone.replace(/\D/g, '');
  
  // Return null if no digits found
  if (normalized.length === 0) {
    return null;
  }
  
  return normalized;
}

/**
 * Validate email format
 * Returns true if email is valid, false otherwise
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || email.trim() === '') {
    return false;
  }
  
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email.trim());
}
