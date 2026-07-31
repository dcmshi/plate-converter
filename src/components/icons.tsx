/**
 * Inline SVG icon set. Unicode glyphs (▾ ▸ ▼ ▲ ⎘ ✓ ×) rendered inconsistently
 * across platforms — ⎘ showed as tofu on some — so decorative marks are drawn
 * here instead. All are aria-hidden: the surrounding text or aria-label carries
 * the meaning.
 */

interface IconProps {
  className?: string;
}

const DEFAULT_SIZE = 'h-3.5 w-3.5 flex-shrink-0';

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={className ?? DEFAULT_SIZE}
    >
      {children}
    </svg>
  );
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Disclosure chevron: points right when collapsed, down when expanded. */
export function ChevronIcon({ open, className }: IconProps & { open: boolean }) {
  return (
    <Icon className={className}>
      <path d={open ? 'M4 6.5 8 10.5 12 6.5' : 'M6.5 4 10.5 8 6.5 12'} {...stroke} />
    </Icon>
  );
}

export function CaretDownIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 12 3 5.5h10z" fill="currentColor" />
    </Icon>
  );
}

export function CaretUpIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 4 13 10.5H3z" fill="currentColor" />
    </Icon>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="6" y="6" width="8" height="9" rx="1.5" {...stroke} />
      <path d="M10.5 3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V10a1.5 1.5 0 0 0 1.5 1.5" {...stroke} />
    </Icon>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 8.5 6.5 12 13 4.5" {...stroke} />
    </Icon>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 4 12 12M12 4 4 12" {...stroke} />
    </Icon>
  );
}
