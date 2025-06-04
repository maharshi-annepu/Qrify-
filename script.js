document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const sizeSelect = document.getElementById('sizeSelect');
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const qrImage = document.getElementById('qrImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');

    let currentQRUrl = '';

    // Generate QR Code
    generateBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text or URL');
            textInput.focus();
            return;
        }

        const size = sizeSelect.value;
        generateQRCode(text, size);
    });

    // Allow Enter key to generate QR code
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    function generateQRCode(text, size) {
        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;

        // Using QR Server API (free and reliable)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
        
        // Create new image to test if it loads
        const testImage = new Image();
        
        testImage.onload = function() {
            currentQRUrl = qrUrl;
            qrImage.src = qrUrl;
            qrImage.alt = `QR Code for: ${text}`;
            
            // Show result section with animation
            resultSection.classList.add('show');
            
            // Reset button
            generateBtn.textContent = 'Generate QR Code';
            generateBtn.disabled = false;
            
            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        
        testImage.onerror = function() {
            alert('Failed to generate QR code. Please try again.');
            generateBtn.textContent = 'Generate QR Code';
            generateBtn.disabled = false;
        };
        
        testImage.src = qrUrl;
    }

    // Download QR Code
    downloadBtn.addEventListener('click', function() {
        if (!currentQRUrl) return;
        
        const link = document.createElement('a');
        link.href = currentQRUrl;
        link.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Visual feedback
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Downloaded!';
        setTimeout(() => {
            downloadBtn.textContent = originalText;
        }, 2000);
    });

    // Copy QR Code URL
    copyBtn.addEventListener('click', async function() {
        if (!currentQRUrl) return;
        
        try {
            await navigator.clipboard.writeText(currentQRUrl);
            
            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#17a2b8';
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentQRUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    });

    // Auto-focus on input when page loads
    textInput.focus();
    
    // Add some example suggestions
    const examples = [
        'https://github.com',
        'https://google.com',
        'Hello World!',
        'https://stackoverflow.com'
    ];
    
    let exampleIndex = 0;
    textInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = examples[exampleIndex % examples.length];
            exampleIndex++;
        }
    });
});