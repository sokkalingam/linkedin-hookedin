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
    // LinkedIn docs say signature format is: hmacsha256=<hex-hash>
    // Strip the prefix if it exists
    let signatureHash = signature;
    if (signature.startsWith('hmacsha256=')) {
      signatureHash = signature.substring(11); // Remove 'hmacsha256=' prefix
    }

    // Compute HMAC-SHA256 hash
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const isValid = signatureHash === expectedSignature;

    // Debug logging
    console.log('Signature Validation Debug:', {
      receivedRaw: signature,
      receivedHash: signatureHash,
      computed: expectedSignature,
      hadPrefix: signature.startsWith('hmacsha256='),
      payloadLength: payload.length,
      payloadFull: payload,
      secretPrefix: clientSecret.substring(0, 10) + '***',
      secretLength: clientSecret.length,
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
