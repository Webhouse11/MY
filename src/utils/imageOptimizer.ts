/**
 * Client-Side Image Optimizer
 * Scales and compresses high-resolution user-uploaded photos/graphics before
 * saving to Cloud Firestore and LocalStorage to guarantee permanent persistence
 * and lightning-fast page loading speeds.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.80,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(readerEvent.target?.result as string);
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // For transparent images / PNGs where background matters
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const outputFormat = file.type === 'image/png' && format === 'image/png' ? 'image/png' : (format || 'image/jpeg');
          const compressedDataUrl = canvas.toDataURL(outputFormat, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', 0.80));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to decode image'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk'));
    };

    reader.readAsDataURL(file);
  });
}
