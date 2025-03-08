/**
 * Email encryption for comment form
 * Uses forge for RSA encryption of email addresses
 */

// Load forge from CDN
document.addEventListener('DOMContentLoaded', function() {
  // Create script element for forge
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js';
  script.integrity = 'sha256-MZBH/+oaYu4R0Ib7qmQZtCZ8wr/OjXZldKyBvFNq/Uo=';
  script.crossOrigin = 'anonymous';
  script.onload = setupEncryption;
  document.head.appendChild(script);
});

// Setup encryption once forge is loaded
function setupEncryption() {
  const form = document.getElementById('comment-form');
  if (!form) return;

  // Your RSA public key - replace this with your actual 4096-bit public key
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

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the email field
    const emailField = form.querySelector('input[name="fields[email]"]');
    if (!emailField || !emailField.value) {
      form.submit();
      return;
    }

    try {
      // Parse the public key
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      
      // Encrypt the email
      // For RSA-OAEP which is more secure than PKCS#1 v1.5
      const encrypted = publicKey.encrypt(emailField.value, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha1.create()
        }
      });
      
      // Convert to base64 for transmission
      const encryptedBase64 = forge.util.encode64(encrypted);
      
      // Replace the email value with the encrypted version
      emailField.value = encryptedBase64;
      console.log('Email encrypted successfully');
    } catch (error) {
      console.error('Error during encryption:', error);
    }
    
    // Submit the form with the encrypted email
    form.submit();
  });
}
