/**
 * Client-Side Web Crypto API Utilities for HeartOut Zero-Knowledge Draft Encryption
 * Uses native window.crypto.subtle (AES-GCM-256) for zero-knowledge draft security.
 */

// Convert String to ArrayBuffer
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert ArrayBuffer to String
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// Convert ArrayBuffer to Hex String
function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
function hex2buf(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

/**
 * Derive a cryptographic AES-GCM key from a user passphrase/passcode using PBKDF2
 */
export async function deriveKey(passphrase, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex ? hex2buf(saltHex) : window.crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return { key, saltHex: buf2hex(salt) };
}

/**
 * Encrypt plaintext string using AES-GCM-256
 */
export async function encryptDraft(plainText, key) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(plainText)
  );

  return {
    ciphertextHex: buf2hex(encryptedContent),
    ivHex: buf2hex(iv)
  };
}

/**
 * Decrypt AES-GCM-256 ciphertext
 */
export async function decryptDraft(ciphertextHex, ivHex, key) {
  const dec = new TextDecoder();
  const ciphertextBuf = hex2buf(ciphertextHex);
  const iv = hex2buf(ivHex);

  const decryptedContent = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    ciphertextBuf
  );

  return dec.decode(decryptedContent);
}
