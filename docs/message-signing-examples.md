Propuesta: HMAC signing for RabbitMQ events

Identity (Java) - sign before publish (HMAC-SHA256)
```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class HmacSigner {
    private final byte[] secret;

    public HmacSigner(String secret) {
        this.secret = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    public String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            byte[] sig = mac.doFinal(payload.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(sig);
        } catch (Exception e) {
            throw new RuntimeException("Failed to sign payload", e);
        }
    }
}

// Usage inside IdentityEventPublisher.publishUserPromoted:
// String payloadJson = objectMapper.writeValueAsString(event);
// String signature = new HmacSigner(System.getenv("EVENT_SIGNING_SECRET")).sign(payloadJson);
// rabbitTemplate.convertAndSend(identityExchange, userPromotedRoutingKey, payloadJson, message -> {
//     message.getMessageProperties().setHeader("X-Event-Signature", signature);
//     return message;
// });
```

Catalog (TypeScript) - verify on consume (HMAC-SHA256)
```ts
import crypto from 'crypto';

export const verifySignature = (payload: string, signatureHeader: string | undefined, secret: string): boolean => {
  if (!signatureHeader) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('base64');
  // Use timing-safe compare to avoid timing attacks
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signatureHeader, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Usage inside IdentityPromotionConsumer.handleMessage:
// const payload = message.content.toString();
// const signature = message.properties?.headers?.['X-Event-Signature'] as string | undefined;
// const secret = process.env.EVENT_SIGNING_SECRET ?? '';
// if (!verifySignature(payload, signature, secret)) {
//   console.warn('Invalid event signature - rejecting message');
//   this.channel.nack(message, false, false);
//   return;
// }
```

Notes:
- Store `EVENT_SIGNING_SECRET` in your environment securely (not in code).
- HMAC provides integrity and origin assurance if the secret is kept secret.
- For production, consider rotating secrets and adding `eventId` + timestamp validation to avoid replay attacks.
