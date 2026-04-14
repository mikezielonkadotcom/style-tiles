const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') {
    return null;
  }

  const normalized = hex.trim().replace('#', '');
  const chunk = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(chunk)) {
    return null;
  }

  const value = parseInt(chunk, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function relativeLuminance(rgb) {
  if (!rgb) {
    return 0;
  }

  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const c = clamp(channel, 0, 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

export function contrastRatio(foregroundHex, backgroundHex) {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);

  if (!fg || !bg) {
    return 1;
  }

  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio, largeText = false) {
  const rounded = Number(ratio) || 1;

  if (rounded >= 7) {
    return 'AAA';
  }

  if (rounded >= 4.5) {
    return 'AA';
  }

  if (largeText && rounded >= 3) {
    return 'AA (Large)';
  }

  return 'Fail';
}
