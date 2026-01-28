import crypto from 'crypto';

/**
 * Validates LinkedIn webhook signature
 * Reference: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation
 */
export function validateLinkedInSignature(
  payload: string,
  signature: string,
  clientSecret: string
): boolean {
  try {
    // LinkedIn sends the signature in the X-Li-Signature header
    // The signature is HMAC-SHA256 of the request body using client secret as hex
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const isValid = signature === expectedSignature;

    // Debug logging
    console.log('Signature Validation Debug:', {
      received: signature,
      computed: expectedSignature,
      payloadLength: payload.length,
      payloadPreview: payload.substring(0, 100),
      secretPrefix: clientSecret.substring(0, 4) + '***',
      isValid,
    });

    return isValid;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

/**
 * Handles LinkedIn challenge validation
 */
export function handleChallenge(challengeCode: string): string {
  // LinkedIn sends a challenge code that we need to return
  return challengeCode;
}
