import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function createCertificateToken(name, secret) {
  const issuedAt = Date.now().toString();
  const payload = `${issuedAt}.${name}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${issuedAt}.${signature}`;
}

export function verifyCertificateToken(name, token, secret) {
  if (typeof token !== "string") return false;
  const [issuedAt, suppliedSignature, extra] = token.split(".");
  if (!issuedAt || !suppliedSignature || extra !== undefined || !/^\d+$/.test(issuedAt)) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isSafeInteger(issuedAtMs) || Date.now() - issuedAtMs < 0 || Date.now() - issuedAtMs > TOKEN_LIFETIME_MS) return false;

  const payload = `${issuedAt}.${name}`;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const supplied = Buffer.from(suppliedSignature, "base64url");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
