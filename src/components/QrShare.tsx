import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ChevronIcon } from './icons';

const QR_DEBOUNCE_MS = 300;

interface QrShareProps {
  /** Current query string (no leading "?"); the QR encodes the full deep-link URL. */
  query: string;
}

export default function QrShare({ query }: QrShareProps) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`;

  // Regenerate while open so the QR tracks weight/bar/inventory changes, debounced
  // so typing in the weight field doesn't encode a QR per keystroke
  useEffect(() => {
    if (!open) return;
    let stale = false;
    const timer = window.setTimeout(() => {
      QRCode.toDataURL(shareUrl, { margin: 2, width: 192 })
        .then((url) => { if (!stale) setDataUrl(url); })
        .catch(() => { if (!stale) setDataUrl(null); });
    }, QR_DEBOUNCE_MS);
    return () => { stale = true; window.clearTimeout(timer); };
  }, [open, shareUrl]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="focus-ring min-h-11 px-2 rounded text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
      >
        <ChevronIcon open={open} />
        <span>Share QR</span>
      </button>

      {open && dataUrl && (
        <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl">
          <img
            src={dataUrl}
            alt="QR code linking to this barbell configuration"
            width={192}
            height={192}
          />
        </div>
      )}
    </div>
  );
}
