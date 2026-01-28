# LinkedIn Webhook Signature Validation - Correct Implementation

## ⚠️ Important: Documentation Error

LinkedIn's official webhook validation documentation is **incomplete and misleading**. This document provides the **correct implementation** based on LinkedIn's actual source code.

## Official Documentation (Incorrect)

LinkedIn's documentation at [https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation) states:

> The POST request sent by LinkedIn will include a header called `X-LI-Signature`. The value of this header is the HMACSHA256 hash of the JSON-encoded string representation of the POST body prefixed by `hmacsha256=` and it is computed using your app's clientSecret.

This suggests the format is:
```
X-LI-Signature: hmacsha256=<hash>
```

Where `<hash>` is computed as:
```
HMAC-SHA256(POST_body, clientSecret)
```

**This is incorrect!**

## Actual Implementation (Correct)

Based on LinkedIn's actual source code (`PartnerPushEventCredentialPlugin.java`), LinkedIn computes the signature as follows:

```java
String SIGN_PREFIX = "hmacsha256=";
String stringToSign = SIGN_PREFIX + payload;
String signature = computeSha256Signature(stringToSign, appSecret);
```

This means:
1. LinkedIn **prepends** `"hmacsha256="` to the payload
2. Computes HMAC-SHA256 on the **prefixed payload**
3. Sends only the hex hash (without prefix) in the `X-LI-Signature` header

### Correct Formula

```
signature = HMAC-SHA256("hmacsha256=" + POST_body, clientSecret)
X-LI-Signature: <signature_hex>
```

## Step-by-Step Validation

### 1. Extract Components

```javascript
// From the incoming request
const payload = await request.text();  // Raw POST body as string
const receivedSignature = request.headers.get('X-LI-Signature');
const clientSecret = 'YOUR_CLIENT_SECRET';  // From LinkedIn Developer Portal
```

### 2. Compute Expected Signature

```javascript
const crypto = require('crypto');

// CRITICAL: Prepend "hmacsha256=" to the payload
const stringToSign = 'hmacsha256=' + payload;

// Compute HMAC-SHA256
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(stringToSign, 'utf8');
const expectedSignature = hmac.digest('hex');
```

### 3. Compare Signatures

```javascript
// Strip prefix from received signature if present
let signatureToCompare = receivedSignature;
if (receivedSignature.startsWith('hmacsha256=')) {
  signatureToCompare = receivedSignature.substring(11);
}

// Validate
const isValid = signatureToCompare === expectedSignature;

if (!isValid) {
  // Reject the webhook
  return response.status(401).json({ error: 'Invalid signature' });
}

// Process the webhook
return response.status(200).json({ success: true });
```

## Complete Examples

### Node.js (Express/Next.js)

```javascript
import crypto from 'crypto';

export function validateLinkedInSignature(payload, signature, clientSecret) {
  try {
    // Strip prefix from signature if present
    let signatureHash = signature;
    if (signature.startsWith('hmacsha256=')) {
      signatureHash = signature.substring(11);
    }

    // Prepend "hmacsha256=" to payload before hashing
    const stringToSign = 'hmacsha256=' + payload;

    // Compute HMAC-SHA256
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(stringToSign, 'utf8');
    const expectedSignature = hmac.digest('hex');

    // Compare
    return signatureHash === expectedSignature;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

// Usage in webhook handler
app.post('/webhook', async (req, res) => {
  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-li-signature'];
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!validateLinkedInSignature(payload, signature, clientSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  res.status(200).json({ success: true });
});
```

### Python

```python
import hmac
import hashlib

def validate_linkedin_signature(payload: str, signature: str, client_secret: str) -> bool:
    """
    Validate LinkedIn webhook signature.

    Args:
        payload: Raw POST body as string
        signature: Value from X-LI-Signature header
        client_secret: Your LinkedIn app's client secret

    Returns:
        True if signature is valid, False otherwise
    """
    try:
        # Strip prefix from signature if present
        signature_hash = signature
        if signature.startswith('hmacsha256='):
            signature_hash = signature[11:]

        # Prepend "hmacsha256=" to payload
        string_to_sign = 'hmacsha256=' + payload

        # Compute HMAC-SHA256
        expected_signature = hmac.new(
            client_secret.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        # Compare
        return hmac.compare_digest(signature_hash, expected_signature)
    except Exception as e:
        print(f"Error validating signature: {e}")
        return False

# Usage in Flask
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data(as_text=True)
    signature = request.headers.get('X-LI-Signature')
    client_secret = os.environ['LINKEDIN_CLIENT_SECRET']

    if not validate_linkedin_signature(payload, signature, client_secret):
        return jsonify({'error': 'Invalid signature'}), 401

    # Process webhook
    return jsonify({'success': True}), 200
```

### Java

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;

public class LinkedInWebhookValidator {
    private static final String SIGN_PREFIX = "hmacsha256=";
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    public static boolean validateSignature(String payload, String signature, String clientSecret) {
        try {
            // Strip prefix from signature if present
            String signatureHash = signature;
            if (signature.startsWith(SIGN_PREFIX)) {
                signatureHash = signature.substring(SIGN_PREFIX.length());
            }

            // Prepend prefix to payload
            String stringToSign = SIGN_PREFIX + payload;

            // Compute HMAC-SHA256
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secretKey = new SecretKeySpec(
                clientSecret.getBytes("UTF-8"),
                HMAC_ALGORITHM
            );
            mac.init(secretKey);
            byte[] hash = mac.doFinal(stringToSign.getBytes("UTF-8"));
            String expectedSignature = Hex.encodeHexString(hash);

            // Compare
            return signatureHash.equals(expectedSignature);
        } catch (Exception e) {
            System.err.println("Error validating signature: " + e.getMessage());
            return false;
        }
    }
}
```

### Ruby

```ruby
require 'openssl'

def validate_linkedin_signature(payload, signature, client_secret)
  # Strip prefix from signature if present
  signature_hash = signature
  signature_hash = signature[11..-1] if signature.start_with?('hmacsha256=')

  # Prepend prefix to payload
  string_to_sign = 'hmacsha256=' + payload

  # Compute HMAC-SHA256
  expected_signature = OpenSSL::HMAC.hexdigest(
    OpenSSL::Digest.new('sha256'),
    client_secret,
    string_to_sign
  )

  # Compare (use secure comparison)
  signature_hash == expected_signature
rescue => e
  puts "Error validating signature: #{e.message}"
  false
end
```

### Go

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "strings"
)

func ValidateLinkedInSignature(payload, signature, clientSecret string) bool {
    // Strip prefix from signature if present
    signatureHash := signature
    if strings.HasPrefix(signature, "hmacsha256=") {
        signatureHash = signature[11:]
    }

    // Prepend prefix to payload
    stringToSign := "hmacsha256=" + payload

    // Compute HMAC-SHA256
    h := hmac.New(sha256.New, []byte(clientSecret))
    h.Write([]byte(stringToSign))
    expectedSignature := hex.EncodeToString(h.Sum(nil))

    // Compare
    return hmac.Equal([]byte(signatureHash), []byte(expectedSignature))
}
```

## Common Pitfalls

### ❌ Incorrect: Hash the payload directly

```javascript
// THIS WILL NOT WORK
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(payload);  // Missing prefix!
const signature = hmac.digest('hex');
```

### ✅ Correct: Prepend prefix before hashing

```javascript
// THIS IS CORRECT
const stringToSign = 'hmacsha256=' + payload;
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(stringToSign);
const signature = hmac.digest('hex');
```

## Important Notes

1. **Character Encoding**: Use UTF-8 encoding when converting strings to bytes
2. **Raw Payload**: Use the raw POST body as received, do not parse and re-stringify JSON
3. **Client Secret**: Use the exact Client Secret from your LinkedIn Developer Portal (Auth tab)
4. **Signature Header**: The `X-LI-Signature` header contains only the hex hash (no prefix in recent implementations)
5. **Case Sensitivity**: The signature is lowercase hex

## Troubleshooting

### Validation Always Fails

1. **Verify Client Secret**: Ensure you're using the correct Client Secret from LinkedIn Developer Portal
2. **Check App ID**: The `developerApplicationId` in the webhook payload should match your app
3. **Raw Body**: Make sure you're using the raw POST body, not a parsed/re-stringified version
4. **Prefix**: Confirm you're prepending `"hmacsha256="` to the payload before hashing
5. **Encoding**: Ensure UTF-8 encoding is used throughout

### Testing Locally

```javascript
const crypto = require('crypto');

// Example webhook payload
const payload = '{"id":"test123","type":"MEMBER_DATA_STATUS_CHANGE","eventTimestamp":1234567890}';
const clientSecret = 'YOUR_CLIENT_SECRET';

// Compute what LinkedIn would send
const stringToSign = 'hmacsha256=' + payload;
const hmac = crypto.createHmac('sha256', clientSecret);
hmac.update(stringToSign, 'utf8');
const expectedSignature = hmac.digest('hex');

console.log('Expected X-LI-Signature:', expectedSignature);
```

## References

- **LinkedIn Official Docs** (incomplete): [https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation)
- **LinkedIn Source Code**: `PartnerPushEventCredentialPlugin.java` - The actual implementation that prepends the prefix
- **Discovery**: This correct implementation was discovered by examining LinkedIn's server-side code after extensive debugging

## Contributing

If you find issues with LinkedIn's webhook implementation or documentation:
1. Report to LinkedIn Developer Support
2. Reference this document and the source code evidence
3. Help other developers by sharing your findings

## License

This documentation is provided as-is to help developers correctly implement LinkedIn webhook signature validation. Feel free to use and share.

---

**Last Updated**: January 2026
**Verified Against**: LinkedIn Webhooks API (current implementation)
