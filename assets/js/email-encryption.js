/**
 * Email encryption for comment form
 * Uses native Web Crypto API for RSA encryption of email addresses
 */

document.addEventListener('DOMContentLoaded', function() {
  setupEncryption();
});

async function setupEncryption() {
  const form = document.getElementById('comment-form');
  if (!form) {
    console.error('Comment form not found');
    return;
  }

  console.log('Email encryption initialized');

  /* RSA public key in PEM format */
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1HkoughjOBPXuA7k5F8V
1u3W8A2J5S66Drcp39e9gfCeAfIkaiNzxTc+AOR/4nN4n7cwO1Q5Ma2q3GcOXkdY
BkR7Rn0MYia+FUrDch84CHFjehURYyk0ho+YqLH8M3yEBLVZ38XngrgA8ZaOi7nT
pLpvncDNOlMnmB8EkdtCybY+FqRf1+tpsIqQPzJqYNOC3HXDI//MSBu4mCEQIFad
QKMCDzNFv3DmKBROB5b5Na8hvq+CSztFexBvHwVbnLV4QOhDrLYRj7eKMDecEajY
La+AqwmY8Zkwd6UbKD+8rqHVa9EPJZpd3u8KvjemnyoJoYo3E0CzscMP5vOK2B3N
n9a1ejMFWxSmGw12Qsit5Nf6HHBAJ3CctSOMi6+gnf0jqF01altfFnmmb/BIeZa+
TDhw7lp/P4MKH91BVESgozd6GBFoTf+YjqdFbchYrBZvUk6fiaGKyKcTINKdXJpF
IqcfJV+pky/0HBYHaK1kdrucU5yhFmcRXLkOHs3gtcybMi0eAKZtICQ86Dc50aVH
SalJ+DdWHnqs7xb/9fWZLaHWdUhr+8F/HHdH2Ifv7ThGh6mgrxDoOJYh045kwyxm
q88SPCndKcYpZd4/WOhgWtRG+d2IjixcvrgZlzCIUd8zcUj7zWJN6cmY5T9NVdCC
vkWLihGtrHqVRreErdFKlj0CAwEAAQ==
-----END PUBLIC KEY-----`;

  try {
    /* Convert PEM to a format usable by Web Crypto API */
    const publicKey = await importPublicKey(publicKeyPem);
    
    /* Replace the form's submit event with our own handler */
    form.addEventListener('submit', async function(event) {
      /* Prevent the default form submission */
      event.preventDefault();
      console.log('Form submission intercepted');
      
      /* Get the email field */
      const emailField = form.querySelector('input[name="fields[email]"]');
      if (!emailField) {
        console.error('Email field not found');
        form.submit();
        return;
      }

      if (!emailField.value) {
        console.log('Email field is empty, submitting form without encryption');
        form.submit();
        return;
      }

      try {
        console.log('Attempting to encrypt email: ' + emailField.value.substring(0, 3) + '...');
        
        /* Encrypt the email using Web Crypto API */
        const encryptedBase64 = await encryptEmail(emailField.value, publicKey);
        
        /* Replace the email value with the encrypted version */
        emailField.value = encryptedBase64;
        console.log('Email encrypted successfully');
        
        /* Now submit the form with the encrypted email */
        setTimeout(() => {
          console.log('Submitting form with encrypted email');
          form.submit();
        }, 100);
      } catch (error) {
        console.error('Error during encryption:', error);
        /* If encryption fails, still submit the form */
        form.submit();
      }
    });
  } catch (error) {
    console.error('Error setting up encryption:', error);
  }
}

/**
 * Convert PEM format public key to a CryptoKey object
 */
async function importPublicKey(pem) {
  /* Remove header, footer, and newlines to get the base64 encoded key */
  const pemContents = pem.replace(/(-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----)/g, '')
                         .replace(/\s/g, '');
  
  /* Convert base64 to ArrayBuffer */
  const binaryDer = base64ToArrayBuffer(pemContents);
  
  /* Import the key */
  return window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }
    },
    false, /* not extractable */
    ['encrypt'] /* can only be used for encryption */
  );
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypt email using RSA-OAEP
 */
async function encryptEmail(email, publicKey) {
  /* Convert email string to ArrayBuffer */
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  
  /* Encrypt the data */
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    data
  );
  
  /* Convert encrypted ArrayBuffer to base64 string */
  return arrayBufferToBase64(encryptedData);
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
