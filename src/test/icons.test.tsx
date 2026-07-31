import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  CopyIcon,
} from '../components/icons';

const icons = [
  ['ChevronIcon (collapsed)', <ChevronIcon open={false} />],
  ['ChevronIcon (expanded)', <ChevronIcon open={true} />],
  ['CaretDownIcon', <CaretDownIcon />],
  ['CaretUpIcon', <CaretUpIcon />],
  ['CopyIcon', <CopyIcon />],
  ['CheckIcon', <CheckIcon />],
  ['CloseIcon', <CloseIcon />],
] as const;

describe('icons', () => {
  it.each(icons)('%s renders an svg hidden from assistive tech', (_name, element) => {
    const { container } = render(element);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg!.querySelectorAll('path, rect').length).toBeGreaterThan(0);
  });

  it('ChevronIcon draws a different path when expanded', () => {
    const { container: collapsed } = render(<ChevronIcon open={false} />);
    const { container: expanded } = render(<ChevronIcon open={true} />);
    const path = (c: HTMLElement) => c.querySelector('path')!.getAttribute('d');
    expect(path(collapsed)).not.toBe(path(expanded));
  });

  it('accepts a className override', () => {
    const { container } = render(<CloseIcon className="h-3 w-3" />);
    expect(container.querySelector('svg')).toHaveClass('h-3', 'w-3');
  });
});
