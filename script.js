// --- 🛡️ GHOST UTILITIES (TOP-LEVEL) ---
const showToast = (message, type = 'success') => {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
};

window.checkMasterKey = () => {
    const inputEl = document.getElementById('master-key-input');
    const modeEl = document.getElementById('access-mode');
    const gate = document.getElementById('master-gate');
    const main = document.getElementById('main-content');
    const error = document.getElementById('gate-error');

    if (!inputEl || !gate || !main) return;

    // Normalize: Trim spaces and convert to UpperCase
    const key = inputEl.value.trim().toUpperCase();
    const mode = modeEl ? modeEl.value : 'client';

    // Credentials
    const ADMIN_KEY = "JIBINPALA";
    const CLIENT_KEY = "SPECTRE777";

    // Support both keys for maximum reliability during deployment
    const isCorrect = (key === ADMIN_KEY || key === CLIENT_KEY);

    if (isCorrect) {
        // Unlock Sequence
        gate.style.pointerEvents = 'none';
        gate.style.opacity = '0';
        showToast(`IDENTITY VERIFIED: ${mode.toUpperCase()} ACCESS GRANTED`);

        setTimeout(() => {
            gate.style.display = 'none';
            main.style.filter = 'none';
            main.style.pointerEvents = 'all';
            window.scrollTo(0, 0);
        }, 500);
    } else {
        if (error) error.textContent = `AUTH_FAILURE: INVALID ${mode.toUpperCase()} KEY`;
        if (error) error.style.display = 'block';
        inputEl.value = '';
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 400);
        showToast('ACCESS DENIED', 'error');
    }
};

window.toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showToast(`Error attempting to enable full-screen mode: ${err.message}`, 'error');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const gateInput = document.getElementById('master-key-input');
    if (gateInput) {
        gateInput.focus();
        gateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkMasterKey();
            }
        });
    }

    // --- 🔒 STANDALONE INTERFACE PROTECTION ---
    // Removed contextmenu restriction to ensure native Copy/Paste always works.

    // Prevent dragging images only
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // Handle accidental Backspace/Escape exits
    window.onkeydown = (e) => {
        if (e.key === 'Escape') {
            const resultArea = document.getElementById('result-area');
            if (resultArea) resultArea.style.display = 'none';
        }
    };

    // --- 🌍 PWA SERVICE WORKER REGISTRATION ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log('SPECTRE: Protocol Active (Offline Mode Enabled)');
        });
    }

    // --- 🛠️ GLOBALS AND UI ---
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tool-section');
    const resultArea = document.getElementById('result-area');
    const btnDownload = document.getElementById('btn-download');
    const btnClear = document.getElementById('btn-clear');

    // --- 🖱️ UNIVERSAL DRAG & DROP ---
    document.querySelectorAll('.upload-area').forEach(area => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
            area.addEventListener(name, (e) => { e.preventDefault(); e.stopPropagation(); });
        });
        area.addEventListener('dragenter', () => area.classList.add('drag-over'));
        area.addEventListener('dragleave', () => area.classList.add('drag-over'));
        area.addEventListener('drop', (e) => {
            area.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            const input = area.querySelector('input[type="file"]');
            if (input && file) {
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                input.dispatchEvent(new Event('change'));
            }
        });
    });

    // Core Canvases
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const origCanvas = document.getElementById('orig-canvas');
    const octx = origCanvas.getContext('2d');

    // Constants
    const DELIMITER = '###S-STEG-END###';
    const ZW_0 = '\u200C';
    const ZW_1 = '\u200D';
    const ZW_END = '\u2060';

    let currentEncodedDataUrl = null;

    // --- 🔒 ENCRYPTION & HASHING ---
    const encrypt = (data, p) => p ? CryptoJS.AES.encrypt(data, p).toString() : data;
    const decrypt = (data, p) => {
        if (!p) return data;
        try {
            const b = CryptoJS.AES.decrypt(data, p);
            return b.toString(CryptoJS.enc.Utf8);
        } catch (e) { return null; }
    };
    const sha256 = (data) => CryptoJS.SHA256(data).toString().substring(0, 32).toUpperCase();

    // --- 📑 TAB MANAGEMENT ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
            resultArea.style.display = 'none';
        });
    });


    // --- 🎭 DENIABLE STEGANOGRAPHY ---
    const btnDenEncode = document.getElementById('btn-deniable-encode');
    const denUploadArea = document.getElementById('deniable-upload-area');
    const denFileInput = document.getElementById('deniable-file-input');
    const denPreview = document.getElementById('deniable-preview');

    if (denUploadArea && denFileInput) {
        denUploadArea.onclick = () => denFileInput.click();
        denFileInput.onchange = (e) => handleFilePreview(e.target.files[0], denPreview, denUploadArea);
    }

    if (btnDenEncode) {
        btnDenEncode.addEventListener('click', async () => {
            const file = denFileInput.files[0];
            const passDecoy = document.getElementById('pass-decoy').value;
            const msgDecoy = document.getElementById('msg-decoy').value;
            const passReal = document.getElementById('pass-real').value;
            const msgReal = document.getElementById('msg-real').value;

            if (!file || !passDecoy || !passReal || !msgDecoy || !msgReal) {
                return showToast('Decoy and Real payloads/passwords required!', 'error');
            }

            const payloadDecoy = encrypt(msgDecoy, passDecoy) + DELIMITER;
            const payloadReal = encrypt(msgReal, passReal) + DELIMITER;
            const bitsDecoy = strToBinary(payloadDecoy);
            const bitsReal = strToBinary(payloadReal);

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const d = idata.data;

                const maxCapacity = (d.length / 4) * 3;
                if (bitsDecoy.length + bitsReal.length > maxCapacity) {
                    return showToast('Image capacity exceeded!', 'error');
                }

                for (let i = 0; i < bitsDecoy.length; i++) {
                    let p = Math.floor(i / 3) * 4 + (i % 3);
                    d[p] = (d[p] & 0xFE) | parseInt(bitsDecoy[i]);
                }

                const middle = Math.floor(maxCapacity / 2);
                for (let i = 0; i < bitsReal.length; i++) {
                    let p = Math.floor((middle + i) / 3) * 4 + ((middle + i) % 3);
                    d[p] = (d[p] & 0xFE) | parseInt(bitsReal[i]);
                }

                ctx.putImageData(idata, 0, 0);
                currentEncodedDataUrl = canvas.toDataURL('image/png');
                resultArea.style.display = 'block';
                document.getElementById('integrity-hash').innerText = `SPECTRE_GOLD::SHA_256::${sha256(currentEncodedDataUrl)}`;
                showToast('Deniable Protocol Active. Double payload injected.');
            };
        });
    }

    // --- 🖼️ IMAGE EXTRACTION ---
    const btnImgDecode = document.getElementById('btn-decode');
    if (btnImgDecode) {
        btnImgDecode.addEventListener('click', () => {
            const file = document.getElementById('decode-file-input').files[0];
            const pass = document.getElementById('decode-passphrase').value;
            if (!file || !pass) return showToast('Image & Passphrase required!', 'error');

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const maxCap = (d.length / 4) * 3;

                let result1 = extractBits(d, 0, maxCap, pass);
                if (result1) {
                    document.getElementById('decoded-result-box').style.display = 'block';
                    document.getElementById('extracted-text').innerText = result1;
                    document.getElementById('decoded-result-box').scrollIntoView({ behavior: 'smooth' });
                    return showToast('Secret revealed via Protocol A');
                }

                let result2 = extractBits(d, Math.floor(maxCap / 2), maxCap, pass);
                if (result2) {
                    document.getElementById('decoded-result-box').style.display = 'block';
                    document.getElementById('extracted-text').innerText = result2;
                    document.getElementById('decoded-result-box').scrollIntoView({ behavior: 'smooth' });
                    return showToast('Deniable Layer confirmed and revealed');
                }

                // Try Sticker/Alpha Layer
                let result3 = extractBits(d, 0, d.length / 4, pass, true);
                if (result3) {
                    document.getElementById('decoded-result-box').style.display = 'block';
                    document.getElementById('extracted-text').innerText = result3;
                    document.getElementById('decoded-result-box').scrollIntoView({ behavior: 'smooth' });
                    return showToast('Sticker Alpha-layer secret revealed');
                }

                showToast('Decryption failed. Check passphrase or file.', 'error');
            };
        });
    }

    function extractBits(d, start, end, pass, isAlpha = false) {
        let bin = "";
        let s = "";
        for (let i = start; i < end; i++) {
            let p = isAlpha ? (i * 4 + 3) : (Math.floor(i / 3) * 4 + (i % 3));
            if (p >= d.length) break;
            bin += (d[p] & 1).toString();
            if (bin.length === 8) {
                s += String.fromCharCode(parseInt(bin, 2));
                bin = "";
                if (s.endsWith(DELIMITER)) {
                    s = s.replace(DELIMITER, '');
                    return decrypt(s, pass);
                }
            }
        }
        return null;
    }

    // --- 🎧 AUDIO MODE (WAV LSB) ---
    const btnAudioEncode = document.getElementById('btn-audio-encode');
    const btnAudioDecode = document.getElementById('btn-audio-decode');

    if (btnAudioEncode) {
        btnAudioEncode.addEventListener('click', async () => {
            const file = document.getElementById('audio-carrier-input').files[0];
            const secret = document.getElementById('audio-payload').value;
            const pass = document.getElementById('audio-pass-enc').value;
            if (!file || !secret) return showToast('WAV and Secret required', 'error');

            const fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.onload = () => {
                const data = new Uint8Array(fr.result);
                const headerSize = 44;
                const payload = encrypt(secret, pass) + DELIMITER;
                const bits = strToBinary(payload);
                if (bits.length > (data.length - headerSize)) return showToast('Audio track too short', 'error');
                for (let i = 0; i < bits.length; i++) {
                    data[headerSize + i] = (data[headerSize + i] & 0xFE) | parseInt(bits[i]);
                }
                const blob = new Blob([data], { type: 'audio/wav' });
                currentEncodedDataUrl = URL.createObjectURL(blob);
                resultArea.style.display = 'block';
                showToast('Audio carrier ready');
            };
        });
    }

    if (btnAudioDecode) {
        btnAudioDecode.addEventListener('click', () => {
            const file = document.getElementById('audio-stego-input').files[0];
            const pass = document.getElementById('audio-pass-dec').value;
            if (!file) return;
            const fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.onload = () => {
                const data = new Uint8Array(fr.result);
                const headerSize = 44;
                let bin = ""; let s = "";
                for (let i = headerSize; i < data.length; i++) {
                    bin += (data[i] & 1).toString();
                    if (bin.length === 8) {
                        s += String.fromCharCode(parseInt(bin, 2));
                        bin = "";
                        if (s.endsWith(DELIMITER)) break;
                    }
                }
                const decrypted = decrypt(s.replace(DELIMITER, ''), pass);
                if (!decrypted) return showToast('Extraction failed', 'error');
                document.getElementById('audio-result-box').style.display = 'block';
                document.getElementById('audio-extracted-output').innerText = decrypted;
                showToast('Audio secret revealed');
            };
        });
    }

    // --- ⌨️ TEXT MODE (Invisible Unicode) ---
    const btnTextHide = document.getElementById('btn-text-hide');
    const btnTextReveal = document.getElementById('btn-text-reveal');

    if (btnTextHide) {
        btnTextHide.addEventListener('click', () => {
            const cover = document.getElementById('text-cover').value || "Carrier message attached.";
            const secret = document.getElementById('text-secret').value;
            const pass = document.getElementById('text-hide-pass').value;
            if (!secret) return showToast('Enter secret data', 'error');

            const encrypted = encrypt(secret, pass);
            const bin = strToBinary(encrypted);
            let hidden = "";
            for (let b of bin) hidden += (b === '0' ? ZW_0 : ZW_1);

            const output = document.getElementById('stego-text-output');
            output.innerText = cover + ZW_END + hidden + ZW_END;
            document.getElementById('stego-text-result').style.display = 'block';
            showToast('Invisible payload injected.');
        });
    }

    if (btnTextReveal) {
        btnTextReveal.addEventListener('click', () => {
            const input = document.getElementById('text-input-reveal').value;
            const pass = document.getElementById('text-reveal-pass').value;
            const pts = input.split(ZW_END);
            if (pts.length < 3) return showToast('No invisible signature detected', 'error');

            const hiddenData = pts[1];
            let bin = "";
            for (let c of hiddenData) {
                if (c === ZW_0) bin += '0';
                else if (c === ZW_1) bin += '1';
            }

            const encrypted = binaryToStr(bin);
            const decrypted = decrypt(encrypted, pass);
            if (!decrypted) return showToast('Decryption failed', 'error');

            document.getElementById('text-reveal-result').style.display = 'block';
            document.getElementById('text-extracted-output').innerText = decrypted;
            showToast('Payload revealed.');
        });
    }

    // --- 🔍 SCANNER (PRO FORENSICS) ---
    const sCanvas = document.getElementById('scanner-canvas');
    const sInput = document.getElementById('scanner-file-input');
    const sArea = document.getElementById('scanner-upload-area');
    const sReport = document.getElementById('scanner-report');

    if (sArea && sInput) {
        sArea.onclick = () => sInput.click();
        sInput.addEventListener('change', (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const img = new Image();
            img.src = URL.createObjectURL(f);
            img.onload = () => {
                sCanvas.width = img.width;
                sCanvas.height = img.height;
                const sCtx = sCanvas.getContext('2d');
                sCtx.drawImage(img, 0, 0);
                sReport.innerText = `Image Loaded: ${img.width}x${img.height}. Select a plane to scan for noise.`;
                showToast('Image loaded for Forensic Scan');
            };
        });
    }

    const runScan = (plane) => {
        if (!sCanvas.width) return showToast('Upload an image first!', 'error');
        const sCtx = sCanvas.getContext('2d');
        const idata = sCtx.getImageData(0, 0, sCanvas.width, sCanvas.height);
        const d = idata.data;
        for (let i = 0; i < d.length; i += 4) {
            const b = d[i + plane] & 1;
            const c = b ? 255 : 0;
            d[i] = d[i + 1] = d[i + 2] = c;
            d[i + 3] = 255;
        }
        sCtx.putImageData(idata, 0, 0);

        // --- 📊 NOISE DISTRIBUTION SCAN (PRO) ---
        let setBits = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i + plane] & 1) setBits++;
        const ratio = (setBits / (d.length / 4)) * 100;
        const suspicion = Math.abs(50 - ratio) < 5 ? "⚠️ HIGH SUSPICION" : "✅ NORMAL";

        sReport.innerHTML = `
            <strong>SCAN REPORT: PLANE ${['RED', 'GREEN', 'BLUE'][plane]}</strong><br>
            Noise Ratio: ${ratio.toFixed(2)}% (Target: ~50% for LSB)<br>
            Status: ${suspicion}<br>
            <p style="margin-top:5px; font-size:0.7rem;">Injecting data usually shifts the bit ratio toward 50% (Equilibrium Noise).</p>
        `;
        showToast(`Plane Analysis: ${suspicion}`);
    };

    if (document.getElementById('btn-scan-r')) {
        document.getElementById('btn-scan-r').onclick = () => runScan(0);
        document.getElementById('btn-scan-g').onclick = () => runScan(1);
        document.getElementById('btn-scan-b').onclick = () => runScan(2);
        document.getElementById('btn-scan-a').onclick = () => {
            if (!sInput.files[0]) return;
            const img = new Image();
            img.src = URL.createObjectURL(sInput.files[0]);
            img.onload = () => {
                const sCtx = sCanvas.getContext('2d');
                sCtx.drawImage(img, 0, 0);
                sReport.innerText = "Scale reset to original image.";
            };
        };
    }


    // --- ✨ WHATSAPP STICKER LAB (NEW) ---
    const sFileInput = document.getElementById('sticker-file-input');
    const sUploadArea = document.getElementById('sticker-upload-area');
    const bGenSticker = document.getElementById('btn-gen-sticker');
    const bStickerEncode = document.getElementById('btn-sticker-encode');

    if (sUploadArea) sUploadArea.onclick = () => sFileInput.click();
    if (sFileInput) sFileInput.onchange = (e) => handleFilePreview(e.target.files[0], document.getElementById('sticker-preview'), sUploadArea);

    if (bGenSticker) {
        bGenSticker.onclick = () => {
            const theme = document.getElementById('sticker-theme').value;
            const sPreview = document.getElementById('sticker-preview');
            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 512;
            const sctx = sCanvas.getContext('2d');

            if (theme === 'ghost') {
                sctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
                sctx.beginPath(); sctx.arc(256, 256, 200, 0, Math.PI * 2); sctx.fill();
                sctx.fillStyle = '#d4af37'; sctx.font = 'bold 300px serif'; sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
                sctx.fillText('S', 256, 256);
            } else if (theme === 'neon') {
                sctx.strokeStyle = '#0ff'; sctx.lineWidth = 15; sctx.shadowBlur = 20; sctx.shadowColor = '#0ff';
                sctx.strokeRect(100, 100, 312, 312);
                sctx.fillStyle = '#fff'; sctx.font = '80px monospace'; sctx.textAlign = 'center';
                sctx.fillText('SPECTRE', 256, 270);
            }
            sPreview.src = sCanvas.toDataURL('image/png');
            sPreview.style.display = 'block';
            showToast('Ghost Sticker Generated (512x512)');
        };
    }

    if (bStickerEncode) {
        bStickerEncode.onclick = () => {
            const secret = document.getElementById('sticker-secret').value;
            const pass = document.getElementById('sticker-pass').value;
            const preview = document.getElementById('sticker-preview');
            if (!secret || !preview.src) return showToast('Secret and Base Image required', 'error');

            const img = new Image();
            img.src = preview.src;
            img.onload = () => {
                canvas.width = 512; canvas.height = 512;
                ctx.clearRect(0, 0, 512, 512);
                ctx.drawImage(img, 0, 0, 512, 512);
                const idata = ctx.getImageData(0, 0, 512, 512);
                const d = idata.data;
                const bits = strToBinary(encrypt(secret, pass) + DELIMITER);

                for (let i = 0; i < bits.length; i++) {
                    let p = i * 4 + 3; // Alpha channel
                    d[p] = (d[p] & 0xFE) | parseInt(bits[i]);
                }
                ctx.putImageData(idata, 0, 0);
                currentEncodedDataUrl = canvas.toDataURL('image/png');
                resultArea.style.display = 'block';
                document.getElementById('integrity-hash').innerText = `STICKER_PROTOCOL::SHA_256::${sha256(currentEncodedDataUrl)}`;
                showToast('Secure Sticker Created! Send as DOCUMENT.');
            };
        };
    }

    // --- UTILITIES ---
    function strToBinary(s) { return s.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(''); }
    function binaryToStr(bin) {
        let s = "";
        for (let i = 0; i < bin.length; i += 8) s += String.fromCharCode(parseInt(bin.substr(i, 8), 2));
        return s;
    }

    function handleFilePreview(f, p, a) {
        if (!f) return;
        const r = new FileReader();
        r.onload = (e) => {
            p.src = e.target.result;
            p.style.display = 'block';
            const icon = a.querySelector('ion-icon');
            const text = a.querySelector('p');
            if (icon) icon.style.display = 'none';
            if (text) text.style.display = 'none';
        };
        r.readAsDataURL(f);
    }

    if (btnDownload) {
        btnDownload.onclick = () => {
            if (!currentEncodedDataUrl) return;
            // --- 🛡️ OPSEC: STEALTH FILENAME ---
            const types = ['IMG', 'DSC', 'PHOTO', 'DCIM'];
            const prefix = types[Math.floor(Math.random() * types.length)];
            const rand = Math.floor(1000 + Math.random() * 9000);
            const filename = `${prefix}_${rand}.png`;

            const a = document.createElement('a');
            a.href = currentEncodedDataUrl;
            a.download = filename;
            a.click();
            showToast(`Carrier Saved as ${filename}`);
        };
    }

    if (btnClear) btnClear.onclick = () => location.reload();

    // Wire up basic image click for embeds
    const eArea = document.getElementById('embed-upload-area');
    const eInput = document.getElementById('embed-file-input');
    if (eArea && eInput) {
        eArea.onclick = () => eInput.click();
        eInput.onchange = (e) => handleFilePreview(e.target.files[0], document.getElementById('embed-preview'), eArea);
    }

    const dArea = document.getElementById('decode-upload-area');
    const dInput = document.getElementById('decode-file-input');
    if (dArea && dInput) {
        dArea.onclick = () => dInput.click();
        dInput.onchange = (e) => handleFilePreview(e.target.files[0], document.getElementById('decode-preview'), dArea);
    }

    const aEmbedArea = document.getElementById('audio-embed-area');
    if (aEmbedArea) aEmbedArea.onclick = () => document.getElementById('audio-carrier-input').click();

    const aExtractArea = document.getElementById('audio-extract-area');
    if (aExtractArea) aExtractArea.onclick = () => document.getElementById('audio-stego-input').click();

    const encodeBtnTrigger = document.getElementById('btn-encode');
    if (encodeBtnTrigger) {
        encodeBtnTrigger.onclick = () => {
            const file = document.getElementById('embed-file-input').files[0];
            const msg = document.getElementById('secret-message').value;
            const pass = document.getElementById('embed-passphrase').value;
            if (!file || !msg) return showToast('Carrier and Message required', 'error');
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                canvas.width = img.width; canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const bits = strToBinary(encrypt(msg, pass) + DELIMITER);
                for (let i = 0; i < bits.length; i++) {
                    let p = Math.floor(i / 3) * 4 + (i % 3);
                    idata.data[p] = (idata.data[p] & 0xFE) | parseInt(bits[i]);
                }
                ctx.putImageData(idata, 0, 0);
                currentEncodedDataUrl = canvas.toDataURL('image/png');
                resultArea.style.display = 'block';
                document.getElementById('integrity-hash').innerText = `SPECTRE_GOLD::SHA_256::${sha256(currentEncodedDataUrl)}`;
                showToast('Payload injected. Checksum calculated.');
            };
        };
    }

    // --- 📊 LIVE CAPACITY CALCULATION ---
    const updateCapacity = (input, bar, fileInput, mode) => {
        const file = fileInput.files[0];
        if (!file) return;

        // Accurate bit estimation: (Message * AES overhead + Delimiter) * 8 bits
        const msgLen = (input.value.length * 1.35 + 17) * 8;

        if (mode === 'audio') {
            const totalCapacity = (file.size - 44);
            const percent = Math.min((msgLen / totalCapacity) * 100, 100);
            bar.style.width = percent + '%';
            bar.style.background = percent > 90 ? '#ef4444' : 'var(--primary)';
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            let totalCapacity = 0;
            if (mode === 'sticker') {
                totalCapacity = 512 * 512;
            } else if (mode === 'deniable') {
                totalCapacity = (img.width * img.height * 3) / 2;
            } else {
                totalCapacity = img.width * img.height * 3;
            }
            const percent = Math.min((msgLen / totalCapacity) * 100, 100);
            bar.style.width = percent + '%';
            bar.style.background = percent > 90 ? '#ef4444' : 'var(--primary)';
        };
    };

    const imgMsgInput = document.getElementById('secret-message');
    const imgFileIn = document.getElementById('embed-file-input');
    const imgCapBar = document.getElementById('image-capacity-bar');
    const imgCapBox = document.getElementById('image-capacity-box');

    if (imgMsgInput) imgMsgInput.oninput = () => updateCapacity(imgMsgInput, imgCapBar, imgFileIn, 'image');
    if (imgFileIn) {
        imgFileIn.onchange = (e) => {
            handleFilePreview(e.target.files[0], document.getElementById('embed-preview'), document.getElementById('embed-upload-area'));
            imgCapBox.style.display = 'block';
            updateCapacity(imgMsgInput, imgCapBar, imgFileIn, 'image');
        };
    }

    const sMsgInput = document.getElementById('sticker-secret');
    const sFileIn = document.getElementById('sticker-file-input');
    const sCapBar = document.getElementById('sticker-capacity-bar');
    if (sMsgInput) sMsgInput.oninput = () => updateCapacity(sMsgInput, sCapBar, sFileIn, 'sticker');

    const aMsgInput = document.getElementById('audio-payload');
    const aFileIn = document.getElementById('audio-carrier-input');
    const aCapBar = document.getElementById('audio-capacity-bar');
    const aCapBox = document.getElementById('audio-capacity-box');
    if (aMsgInput) aMsgInput.oninput = () => updateCapacity(aMsgInput, aCapBar, aFileIn, 'audio');
    if (aFileIn) {
        aFileIn.onchange = () => {
            if (aCapBox) aCapBox.style.display = 'block';
            updateCapacity(aMsgInput, aCapBar, aFileIn, 'audio');
        };
    }

    const denDecoyInput = document.getElementById('msg-decoy');
    const denRealInput = document.getElementById('msg-real');
    const denFileIn = document.getElementById('deniable-file-input');
    const denDecoyBar = document.getElementById('den-decoy-capacity-bar');
    const denRealBar = document.getElementById('den-real-capacity-bar');

    if (denDecoyInput) denDecoyInput.oninput = () => updateCapacity(denDecoyInput, denDecoyBar, denFileIn, 'deniable');
    if (denRealInput) denRealInput.oninput = () => updateCapacity(denRealInput, denRealBar, denFileIn, 'deniable');
    if (denFileIn) {
        denFileIn.onchange = (e) => {
            handleFilePreview(e.target.files[0], document.getElementById('deniable-preview'), document.getElementById('deniable-upload-area'));
            updateCapacity(denDecoyInput, denDecoyBar, denFileIn, 'deniable');
            updateCapacity(denRealInput, denRealBar, denFileIn, 'deniable');
        };
    }

    // --- 📋 TEXT CLIPBOARD ---
    const btnCopyText = document.getElementById('btn-copy-text');
    if (btnCopyText) {
        btnCopyText.onclick = () => {
            const text = document.getElementById('stego-text-output').innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast('Stealth Text Copied to Clipboard');
                btnCopyText.innerHTML = '<ion-icon name="checkmark-done-outline"></ion-icon> Copied!';
                setTimeout(() => { btnCopyText.innerHTML = '<ion-icon name="copy-outline"></ion-icon> Copy Stealth Text'; }, 2000);
            });
        };
    }
});

// --- 🛡️ PASSWORD STRENGTH ENGINE ---
window.checkEntropy = (input, lineId) => {
    const p = typeof input === 'string' ? input : input.value;
    const line = document.getElementById(lineId);
    if (!line) return;
    let strength = 0;
    if (p.length > 0) {
        if (p.length > 8) strength++;
        if (/[A-Z]/.test(p)) strength++;
        if (/[0-9]/.test(p)) strength++;
        if (/[^A-Za-z0-9]/.test(p)) strength++;
        if (strength === 0) strength = 1; // Minimum visible if not empty
    }

    const colors = ['#ef4444', '#f97316', '#eab308', '#d4af37'];
    line.style.width = (strength * 25) + '%';
    line.style.background = colors[strength - 1] || 'transparent';
    line.style.boxShadow = strength > 0 ? `0 0 10px ${colors[strength - 1]}` : 'none';
};

window.generateSecureKey = (inputId, lineId) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let key = "";
    for (let i = 0; i < 24; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    const input = document.getElementById(inputId);
    if (input) {
        input.value = key;
        window.checkEntropy(input, lineId);
        showToast('Secure Key Generated & Entropy Analyzed');
    }
    return key;
};

window.genDecoy = (id) => {
    const decoys = ["Just leaving the office now.", "Don't forget the milk and eggs.", "Meeting changed to 4 PM tomorrow.", "The weather is nice here, wish you were with us!", "Can you send me that spreadsheet by tonight?"];
    document.getElementById(id).value = decoys[Math.floor(Math.random() * decoys.length)];
};

window.togglePass = (id, btn) => {
    const el = document.getElementById(id);
    const icon = btn.querySelector('ion-icon');
    if (el.type === 'password') {
        el.type = 'text';
        icon.name = 'eye-off-outline';
        showToast('Passphrase Visible');
    } else {
        el.type = 'password';
        icon.name = 'eye-outline';
        showToast('Passphrase Hidden');
    }
};

window.pasteTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Check if Clipboard API is available (usually requires HTTPS)
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        showToast('Use Long-Press to Paste (HTTPS required for button)', 'error');
        el.focus(); // Focus to help user paste manually
        return;
    }

    navigator.clipboard.readText().then(text => {
        el.value = text;
        showToast('Text Pasted Successfully');
        // Trigger any input events if needed
        el.dispatchEvent(new Event('input'));
    }).catch(err => {
        console.error("Paste Error:", err);
        showToast('Permission Denied. Use Long-Press instead.', 'error');
    });
};
