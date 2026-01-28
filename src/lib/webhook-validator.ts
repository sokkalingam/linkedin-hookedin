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
    // Strip the prefix from signature header if it exists
    let signatureHash = signature;
    if (signature.startsWith('hmacsha256=')) {
      signatureHash = signature.substring(11); // Remove 'hmacsha256=' prefix
    }

    // IMPORTANT: LinkedIn's implementation prepends "hmacsha256=" to the payload
    // before computing the HMAC, even though this is NOT documented.
    // See: PartnerPushEventCredentialPlugin.java line: stringToSign = SIGN_PREFIX + payload
    const SIGN_PREFIX = 'hmacsha256=';
    const stringToSign = SIGN_PREFIX + payload;

    // Compute HMAC-SHA256 hash on the prefixed payload
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(stringToSign, 'utf8');
    const expectedSignature = hmac.digest('hex');

    const isValid = signatureHash === expectedSignature;

    // Debug logging
    console.log('Signature Validation Debug:', {
      receivedRaw: signature,
      receivedHash: signatureHash,
      computed: expectedSignature,
      hadPrefix: signature.startsWith('hmacsha256='),
      payloadLength: payload.length,
      stringToSignLength: stringToSign.length,
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
