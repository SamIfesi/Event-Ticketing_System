// useCloudinaryUpload
//
// Handles the full signed upload flow:
//   1. Ask PHP for a signature  → POST /api/cloudinary/sign
//   2. Upload file directly to Cloudinary with progress tracking
//   3. Return { publicId, secureUrl } to the caller
//
// Usage:
//   const { upload, uploading, progress, error } = useCloudinaryUpload();
//
//   const result = await upload(file, 'avatar');
//   if (result) {
//     // result.publicId, result.secureUrl
//   }

import { useState, useCallback } from 'react';
import api from '../services/api';

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);   // 0-100
  const [error, setError]         = useState(null);

  // ── Validate file before uploading ────────────────────────
  function validate(file, type) {
    const maxSizeMB  = type === 'avatar' ? 5 : 10;
    const maxBytes   = maxSizeMB * 1024 * 1024;
    const allowed    = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowed.includes(file.type)) {
      return 'Only JPEG, PNG, WebP or GIF images are allowed.';
    }
    if (file.size > maxBytes) {
      return `Image must be smaller than ${maxSizeMB}MB.`;
    }
    return null;
  }

  // ── Main upload function ───────────────────────────────────
  // type: 'avatar' | 'banner'
  // Returns { publicId, secureUrl } on success, null on failure
  const upload = useCallback(async (file, type = 'avatar') => {
    setError(null);
    setProgress(0);

    // Client-side validation
    const validationError = validate(file, type);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setUploading(true);

    try {
      // Step 1 — get signature from PHP
      const signRes = await api.post('/cloudinary/sign', { type });
      const {
        signature,
        api_key,
        timestamp,
        cloud_name,
        upload_preset,
        folder,
      } = signRes.data.data;

      // Step 2 — build the FormData for Cloudinary
      const formData = new FormData();
      formData.append('file',          file);
      formData.append('api_key',       api_key);
      formData.append('timestamp',     timestamp);
      formData.append('signature',     signature);
      formData.append('upload_preset', upload_preset);
      formData.append('folder',        folder);

      // Step 3 — upload directly to Cloudinary with progress
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const body = JSON.parse(xhr.responseText);
            reject(new Error(body?.error?.message ?? 'Cloudinary upload failed.'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload.'));
        });

        xhr.open('POST', cloudinaryUrl);
        xhr.send(formData);
      });

      setProgress(100);

      return {
        publicId:  result.public_id,
        secureUrl: result.secure_url,
      };

    } catch (err) {
      const msg = err?.message ?? 'Upload failed. Please try again.';
      setError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  function resetError() {
    setError(null);
  }

  return {
    upload,
    uploading,
    progress,
    error,
    resetError,
  };
}