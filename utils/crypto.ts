// Utilities for Client-Side Encryption using Web Crypto API

// Derive a key from a password using PBKDF2
export const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt data
export const encryptData = async (data: any, password: string): Promise<string> => {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(data));

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    // Combine salt + iv + ciphertext into a single buffer
    const buffer = new Uint8Array(salt.byteLength + iv.byteLength + encryptedContent.byteLength);
    buffer.set(salt, 0);
    buffer.set(iv, salt.byteLength);
    buffer.set(new Uint8Array(encryptedContent), salt.byteLength + iv.byteLength);

    // Convert to Base64 for storage
    return btoa(String.fromCharCode(...buffer));
  } catch (e) {
    console.error("Encryption failed", e);
    throw new Error("Failed to encrypt data");
  }
};

// Decrypt data
export const decryptData = async (ciphertext: string, password: string): Promise<any> => {
  try {
    const binaryString = atob(ciphertext);
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    // Extract salt, iv, and data
    const salt = buffer.slice(0, 16);
    const iv = buffer.slice(16, 28);
    const data = buffer.slice(28);

    const key = await deriveKey(password, salt);

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedContent));
  } catch (e) {
    console.error("Decryption failed", e);
    throw new Error("Invalid password or corrupted data");
  }
};