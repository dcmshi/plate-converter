import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QRCode from 'qrcode';
import QrShare from '../components/QrShare';

vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock') },
}));

const toDataURL = vi.mocked(QRCode.toDataURL);

beforeEach(() => {
  toDataURL.mockClear();
});

describe('QrShare', () => {
  it('renders the collapsed Share QR button without generating a code', () => {
    render(<QrShare query="kg=100" />);
    expect(screen.getByText('Share QR')).toBeInTheDocument();
    expect(toDataURL).not.toHaveBeenCalled();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('gives the disclosure button a 44px minimum hit area', () => {
    render(<QrShare query="kg=100" />);
    expect(screen.getByRole('button', { name: /Share QR/ })).toHaveClass('min-h-11');
  });

  it('shows a QR image of the deep-link URL when expanded', async () => {
    render(<QrShare query="kg=150&bar=womens" />);
    fireEvent.click(screen.getByText('Share QR'));

    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,mock');
    expect(toDataURL).toHaveBeenCalledWith(
      expect.stringContaining('?kg=150&bar=womens'),
      expect.any(Object),
    );
  });

  it('encodes a bare URL when the query is empty', async () => {
    render(<QrShare query="" />);
    fireEvent.click(screen.getByText('Share QR'));
    await screen.findByRole('img');
    expect(toDataURL).toHaveBeenCalledWith(expect.not.stringContaining('?'), expect.any(Object));
  });

  it('hides the QR image when collapsed again', async () => {
    render(<QrShare query="kg=100" />);
    fireEvent.click(screen.getByText('Share QR'));
    await screen.findByRole('img');

    fireEvent.click(screen.getByText('Share QR'));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('regenerates the QR when the query changes while open', async () => {
    const { rerender } = render(<QrShare query="kg=100" />);
    fireEvent.click(screen.getByText('Share QR'));
    await screen.findByRole('img');

    rerender(<QrShare query="kg=120" />);
    await screen.findByRole('img');
    expect(toDataURL).toHaveBeenLastCalledWith(
      expect.stringContaining('?kg=120'),
      expect.any(Object),
    );
  });
});
