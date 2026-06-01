// ImageUpload — reusable file picker with drag-and-drop, preview and upload progress.
//
// Used for both avatars and event banners/flyers.
//
// Props:
//   type        — 'avatar' | 'banner'
//   currentUrl  — existing image URL to show before a new one is picked
//   onUploaded  — callback({ publicId, secureUrl }) called after Cloudinary upload succeeds
//   onError     — optional callback(errorMessage) for parent-level error handling
//   className   — extra wrapper classes
//   disabled    — disables the picker
//
// Usage (avatar):
//   <ImageUpload
//     type="avatar"
//     currentUrl={profile.avatar}
//     onUploaded={({ publicId, secureUrl }) => saveAvatar(publicId, secureUrl)}
//   />
//
// Usage (banner):
//   <ImageUpload
//     type="banner"
//     currentUrl={event.banner_image}
//     onUploaded={({ publicId, secureUrl }) => saveBanner(publicId, secureUrl)}
//   />

import { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

// ── Progress ring (avatar mode) ───────────────────────────────
function ProgressRing({ progress, size = 80 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.2s ease' }}
      />
    </svg>
  );
}

// ── Avatar picker ─────────────────────────────────────────────
function AvatarPicker({
  currentUrl,
  previewUrl,
  uploading,
  progress,
  done,
  onFileSelect,
  disabled,
}) {
  const user = useAuthStore((state) => state.user);
  const displayUrl = previewUrl ?? currentUrl;
  const displayName = user?.name ?? '';
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="relative w-24 h-24 shrink-0 items-center">
      {/* Circle */}
      <div className="w-24 h-24 rounded-full overflow-hidden bg-accent-text border-2 border-accent-border flex items-center justify-center">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-black text-accent">{initial}</span>
        )}
      </div>

      {/* Progress ring overlay */}
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
          <ProgressRing progress={progress} size={96} />
          <span className="absolute text-white text-xs font-bold">
            {progress}%
          </span>
        </div>
      )}

      {/* Done tick */}
      {done && !uploading && (
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-success flex items-center justify-center border-2 border-card">
          <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
        </div>
      )}

      {/* Camera button */}
      {!uploading && (
        <button
          type="button"
          onClick={onFileSelect}
          disabled={disabled}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent border-2 border-card flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50 touch-manipulation"
          title="Change photo"
        >
          <Upload size={13} className="text-white" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

// ── Banner picker ─────────────────────────────────────────────
function BannerPicker({
  currentUrl,
  previewUrl,
  uploading,
  progress,
  done,
  isDragging,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  disabled,
}) {
  const displayUrl = previewUrl ?? currentUrl;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative w-full h-48 rounded-card border-2 border-dashed overflow-hidden transition-all duration-200 ${
        isDragging
          ? 'border-accent bg-accent-text scale-[1.01]'
          : displayUrl
            ? 'border-border'
            : 'border-border hover:border-accent/60 hover:bg-accent-text/30'
      } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onClick={!disabled && !uploading ? onFileSelect : undefined}
    >
      {/* Preview image */}
      {displayUrl && (
        <img
          src={displayUrl}
          alt="Banner preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay when uploading */}
      {uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-3">
          <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white text-sm font-semibold">{progress}%</span>
        </div>
      )}

      {/* Idle overlay when no image */}
      {!displayUrl && !uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-12 h-12 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
            <ImageIcon size={22} className="text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              {isDragging ? 'Drop image here' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-muted mt-0.5">
              JPEG, PNG or WebP · Max 10 MB
            </p>
          </div>
        </div>
      )}

      {/* Hover overlay when image exists */}
      {displayUrl && !uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors duration-200 group">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Upload size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-white text-xs font-semibold">
              Replace image
            </span>
          </div>
        </div>
      )}

      {/* Done tick */}
      {done && !uploading && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-success/90 backdrop-blur-sm rounded-full">
          <CheckCircle2 size={13} className="text-white" strokeWidth={2.5} />
          <span className="text-white text-xs font-semibold">Uploaded</span>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ImageUpload({
  type = 'avatar',
  currentUrl,
  onUploaded,
  onError,
  className = '',
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [done, setDone] = useState(false);

  const { upload, uploading, progress, error, resetError } =
    useCloudinaryUpload();

  // ── Open native file picker ───────────────────────────────
  function openPicker() {
    if (disabled || uploading) return;
    resetError();
    setDone(false);
    inputRef.current?.click();
  }

  // ── Handle file selected (input or drop) ──────────────────
  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setDone(false);

      const result = await upload(file, type);

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);

      if (result) {
        setPreviewUrl(result.secureUrl);
        setDone(true);
        onUploaded?.(result);
      } else {
        // Reset preview on failure
        setPreviewUrl(null);
        onError?.(error);
      }
    },
    [upload, type, onUploaded, onError, error]
  );

  function onInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  // ── Drag and drop (banner only) ───────────────────────────
  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const isAvatar = type === 'avatar';
  const accept = 'image/jpeg,image/png,image/webp,image/gif';

  return (
    <>
      <div className={`flex flex-col gap-2 items-center ${className}`}>
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
          disabled={disabled || uploading}
        />

        {/* Picker */}
        {isAvatar ? (
          <AvatarPicker
            currentUrl={currentUrl}
            previewUrl={previewUrl}
            uploading={uploading}
            progress={progress}
            done={done}
            onFileSelect={openPicker}
            disabled={disabled}
          />
        ) : (
          <BannerPicker
            currentUrl={currentUrl}
            previewUrl={previewUrl}
            uploading={uploading}
            progress={progress}
            done={done}
            isDragging={isDragging}
            onFileSelect={openPicker}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            disabled={disabled}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-error/10 border border-error/20 rounded-btn mt-4">
          <AlertCircle size={14} className="text-error shrink-0" />
          <p className="text-xs text-error">{error}</p>
        </div>
      )}

      {/* Helper text for banner */}
      {!isAvatar && !error && !done && (
        <p className="text-xs text-muted">
          Recommended size: 1920 × 1080 px · JPEG, PNG or WebP · Max 10 MB
        </p>
      )}
    </>
  );
}
