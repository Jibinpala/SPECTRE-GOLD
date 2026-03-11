# 📔 Stego Suite Pro v4.0 - User Field Manual

Welcome to the ultimate covert communication suite. This tool is designed for maximum privacy, utilizing browser-side processing (no data is ever sent to a server).

## 🛠️ The Feature Suite

### 1. Image Mode (High Capacity)
Standard LSB (Least Significant Bit) steganography in PNG files.
*   **Best For:** Documents, large messages, zip files.
*   **PRO TIP:** Always share encoded images as "Documents" (not gallery photos) in apps like WhatsApp or Discord to avoid compression.

### 2. Audio Mode (The Ghost Wave)
Hides data directly in the amplitude bits of a 16-bit WAV file.
*   **Best For:** Extremely stealthy sharing via music files.
*   **Requirement:** Uses `.wav` files only (MP3 compression destroys hidden data).

### 3. Text Mode (The Invisible Touch)
Injects zero-width Unicode characters between normal sentence letters.
*   **Best For:** PDFs, Word Documents, Emails, and Telegram.
*   **Note:** The text looks 100% normal but contains an invisible binary layer.

### 4. Forensic Scanner (Bit-Plane Analysis)
A dedicated tool to detect steganography in other images.
*   **How to read it:** Scan the Red, Green, or Blue planes. If the resulting image looks like "Static Noise," there is almost certainly a hidden payload. Normal images show subtle contours of the original shape.

### 5. Horcrux Mode (Split Security)
Splits a secret into two separate images. 
*   **Security:** If an adversary finds only one image, they have 0% of your secret. They need BOTH files to reassemble the data.

---

## 🛡️ Best Security Practices

1.  **Use High-Detail Images:** "Busy" photos (like forests, cities, or gravel) have more natural noise, making steganography much harder to detect than flat colors.
2.  **Always use AES-256:** Even if your steganography is found, a strong password ensures the payload remains a scrambled cipher.
3.  **Metadata Scrubbing:** This tool automatically removes EXIF data (GPS coordinates, camera info) upon export.
4.  **Format Awareness:** 
    *   **NEVER** use JPEG for steganography.
    *   **ALWAYS** use PNG or WAV.

---

## 🚀 How to Deploy Online

To host this for your use anywhere:
1.  Create a free account on [Netlify](https://www.netlify.com/) or [GitHub](https://github.com/).
2.  Upload the `index.html`, `style.css`, and `script.js` files to a new site.
3.  You now have a private, secure encryption terminal accessible and 100% locally-powered on your mobile or laptop.

---

**&copy; 2026 Stego Suite Pro | Built for Ultimate Privacy**
