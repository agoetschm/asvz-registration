import constants from "constants";
import { generateKeyPairSync, privateDecrypt, publicEncrypt } from "crypto";

export function encryptStringWithRsaPublicKey(toEncrypt: string, publicKey: string) {
    const buffer = Buffer.from(toEncrypt);
    const encrypted = publicEncrypt({key: publicKey, padding: constants.RSA_PKCS1_PADDING}, buffer);
    return encrypted.toString("base64");
}

export function decryptStringWithRsaPrivateKey(toDecrypt: string, privateKey: string, passphrase: string) {
    const buffer = Buffer.from(toDecrypt, "base64");
    const decrypted = privateDecrypt({key: privateKey, padding: constants.RSA_PKCS1_PADDING, passphrase}, buffer);
    return decrypted.toString("utf8");
}

export function generateRsaKeyPair(passphrase: string): [string, string] {
  const {publicKey, privateKey} = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    privateKeyEncoding: {
      cipher: "aes-256-cbc",
      format: "pem",
      passphrase,
      type: "pkcs8",
    },
    publicKeyEncoding: {
      format: "pem",
      type: "spki",
    },
  });

  return [publicKey, privateKey];
  // if (err) {
  //   console.log("error generating key pair");
  // }
  //
  // console.log("public key " + publicKey);
  // console.log("private key " + privateKey);
  //
  // const encrypted = encryptStringWithRsaPublicKey("bla", publicKey);
  // console.log("encrypted " + encrypted);
  //
  // const decrypted = decryptStringWithRsaPrivateKey(encrypted, privateKey);
  // console.log("decrypted " + decrypted);
}
