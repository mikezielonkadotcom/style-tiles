const toSlug = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'token';

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const toHexChannel = (channel) => {
  const normalized = Math.max(0, Math.min(255, Math.round(Number(channel) || 0)));
  return normalized.toString(16).padStart(2, '0');
};

const figmaColorToHex = (color) => {
  if (!isObject(color)) {
    return null;
  }

  if (typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') {
    return null;
  }

  const r = color.r <= 1 ? color.r * 255 : color.r;
  const g = color.g <= 1 ? color.g * 255 : color.g;
  const b = color.b <= 1 ? color.b * 255 : color.b;
  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
};

const parseDimensionPx = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  const input = String(value || '').trim().toLowerCase();
  if (!input) {
    return null;
  }

  if (input.endsWith('px')) {
    const number = Number.parseFloat(input.replace('px', ''));
    return Number.isFinite(number) ? number : null;
  }

  const raw = Number.parseFloat(input);
  return Number.isFinite(raw) ? raw : null;
};

const pickDtcgColors = (colorObj = {}) => {
  return Object.entries(colorObj)
    .map(([key, token]) => {
      const value = token && token.$value;
      if (typeof value !== 'string') {
        return null;
      }

      return {
        name: token.$description || key,
        hex: value,
        role: toSlug(key),
      };
    })
    .filter(Boolean)
    .slice(0, 8);
};

const readTypography = (typography = {}, key) => {
  const group = typography[key] || {};
  const family = group.fontFamily?.$value;
  const weight = Number(group.fontWeight?.$value);
  return {
    family: typeof family === 'string' ? family : undefined,
    weight: Number.isFinite(weight) ? weight : undefined,
  };
};

const parseDtcg = (json) => {
  const updates = {};

  if (isObject(json.color)) {
    const colors = pickDtcgColors(json.color);
    if (colors.length) {
      updates.colors = colors;
      const primary = colors.find((color) => color.role.includes('primary'));
      const secondary = colors.find((color) => color.role.includes('secondary'));
      const text = colors.find((color) => color.role.includes('text'));

      if (primary) {
        updates.primaryButtonColor = primary.hex;
      }
      if (secondary) {
        updates.secondaryButtonColor = secondary.hex;
      }
      if (text) {
        updates.buttonTextColor = text.hex;
      }
    }
  }

  if (isObject(json.typography)) {
    const heading = readTypography(json.typography, 'heading');
    const body = readTypography(json.typography, 'body');

    if (heading.family) {
      updates.headingFont = heading.family;
    }
    if (heading.weight) {
      updates.headingWeight = heading.weight;
    }
    if (body.family) {
      updates.bodyFont = body.family;
    }
    if (body.weight) {
      updates.bodyWeight = body.weight;
    }
  }

  if (isObject(json.spacing)) {
    const spacingScale = Object.values(json.spacing)
      .map((token) => parseDimensionPx(token?.$value))
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);

    if (spacingScale.length) {
      updates.spacingScale = spacingScale;
    }
  }

  if (isObject(json.borderRadius) && json.borderRadius.default) {
    const radius = parseDimensionPx(json.borderRadius.default.$value);
    if (Number.isFinite(radius)) {
      updates.buttonRadius = radius;
    }
  }

  return updates;
};

const findModeValue = (valuesByMode = {}) => {
  const firstKey = Object.keys(valuesByMode)[0];
  return firstKey ? valuesByMode[firstKey] : undefined;
};

const parseFigmaVariables = (json) => {
  const updates = {};
  const colors = [];
  const spacingScale = [];

  const variables = Array.isArray(json.variables)
    ? json.variables
    : Array.isArray(json?.meta?.variables)
      ? json.meta.variables
      : [];

  variables.forEach((variable) => {
    const name = String(variable?.name || '').trim();
    const type = String(variable?.resolvedType || variable?.type || '').toUpperCase();
    const value = findModeValue(variable?.valuesByMode || variable?.valuesByCollection || {});
    const normalizedName = name.toLowerCase();

    if (type === 'COLOR') {
      const hex = typeof value === 'string' ? value : figmaColorToHex(value);
      if (hex) {
        colors.push({
          name,
          hex,
          role: toSlug(name),
        });

        if (normalizedName.includes('primary')) {
          updates.primaryButtonColor = hex;
        }
        if (normalizedName.includes('secondary')) {
          updates.secondaryButtonColor = hex;
        }
      }
      return;
    }

    if (type === 'FLOAT') {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && normalizedName.includes('spacing')) {
        spacingScale.push(Math.round(numeric));
      }

      if (Number.isFinite(numeric) && normalizedName.includes('radius')) {
        updates.buttonRadius = Math.round(numeric);
      }
      return;
    }

    if (type === 'STRING') {
      if (normalizedName.includes('heading') && normalizedName.includes('font')) {
        updates.headingFont = String(value);
      }
      if (normalizedName.includes('body') && normalizedName.includes('font')) {
        updates.bodyFont = String(value);
      }
    }
  });

  if (colors.length) {
    updates.colors = colors.slice(0, 8);
  }

  if (spacingScale.length) {
    updates.spacingScale = spacingScale.sort((a, b) => a - b);
  }

  return updates;
};

export function parseTokensJson(input) {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;

  if (!isObject(parsed)) {
    throw new Error('Token JSON must be an object.');
  }

  const isDtcg = isObject(parsed.color) || isObject(parsed.typography) || isObject(parsed.spacing);
  const isFigma = Array.isArray(parsed.variables) || Array.isArray(parsed?.meta?.variables);

  if (isDtcg) {
    return parseDtcg(parsed);
  }

  if (isFigma) {
    return parseFigmaVariables(parsed);
  }

  throw new Error('Unsupported token format. Expected DTCG or Figma Variables export.');
}

const spacingTokenNames = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

export function exportTokensJson(attributes) {
  const colorTokens = (attributes.colors || []).reduce((acc, color) => {
    const key = toSlug(color.role || color.name);
    acc[key] = {
      $value: color.hex,
      $type: 'color',
      $description: color.name,
    };
    return acc;
  }, {});

  const spacing = (attributes.spacingScale || []).reduce((acc, value, index) => {
    const token = spacingTokenNames[index] || `space-${index + 1}`;
    acc[token] = {
      $value: `${value}px`,
      $type: 'dimension',
    };
    return acc;
  }, {});

  return {
    color: colorTokens,
    typography: {
      heading: {
        fontFamily: { $value: attributes.headingFont, $type: 'fontFamily' },
        fontWeight: { $value: attributes.headingWeight, $type: 'fontWeight' },
      },
      body: {
        fontFamily: { $value: attributes.bodyFont, $type: 'fontFamily' },
        fontWeight: { $value: attributes.bodyWeight, $type: 'fontWeight' },
      },
    },
    spacing,
    borderRadius: {
      default: { $value: `${attributes.buttonRadius}px`, $type: 'dimension' },
    },
    component: {
      button: {
        primary: {
          background: { $value: attributes.primaryButtonColor, $type: 'color' },
        },
        secondary: {
          border: { $value: attributes.secondaryButtonColor, $type: 'color' },
        },
      },
    },
  };
}
