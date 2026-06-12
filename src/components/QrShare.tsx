import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrShareProps {
  /** Current query string (no leading "?"); the QR encodes the full deep-link URL. */
  query: string;
}

export default function QrShare({ query }: QrShareProps) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`;

  // Regenerate while open so the QR tracks weight/bar/inventory changes
  useEffect(() => {
    if (!open) return;
    let stale = false;
    QRCode.toDataURL(shareUrl, { margin: 2, width: 192 })
      .then((url) => { if (!stale) setDataUrl(url); })
      .catch(() => { if (!stale) setDataUrl(null); });
    return () => { stale = true; };
  }, [open, shareUrl]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
      >
        <span>{open ? '▾' : '▸'}</span>
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
