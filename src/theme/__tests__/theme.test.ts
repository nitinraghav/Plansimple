import { theme } from '../theme';

describe('Theme', () => {
  it('has required color properties', () => {
    expect(theme.colors).toHaveProperty('primary');
    expect(theme.colors).toHaveProperty('background');
    expect(theme.colors).toHaveProperty('surface');
    expect(theme.colors).toHaveProperty('text');
    expect(theme.colors).toHaveProperty('error');
  });

  it('has valid color values', () => {
    // Check if colors are valid hex codes
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    Object.values(theme.colors).forEach(color => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  it('has required spacing values', () => {
    expect(theme.spacing).toHaveProperty('xs');
    expect(theme.spacing).toHaveProperty('sm');
    expect(theme.spacing).toHaveProperty('md');
    expect(theme.spacing).toHaveProperty('lg');
    expect(theme.spacing).toHaveProperty('xl');
  });

  it('has valid spacing values', () => {
    // Check if spacing values are numbers
    Object.values(theme.spacing).forEach(spacing => {
      expect(typeof spacing).toBe('number');
      expect(spacing).toBeGreaterThanOrEqual(0);
    });

    // Check if spacing values are in ascending order
    const spacingValues = Object.values(theme.spacing);
    for (let i = 1; i < spacingValues.length; i++) {
      expect(spacingValues[i]).toBeGreaterThan(spacingValues[i - 1]);
    }
  });

  it('has required typography properties', () => {
    expect(theme.typography).toHaveProperty('fontFamily');
    expect(theme.typography).toHaveProperty('fontSizes');
    expect(theme.typography).toHaveProperty('fontWeights');
  });

  it('has valid typography values', () => {
    // Check font family
    expect(typeof theme.typography.fontFamily).toBe('string');
    expect(theme.typography.fontFamily).not.toBe('');

    // Check font sizes
    expect(theme.typography.fontSizes).toHaveProperty('small');
    expect(theme.typography.fontSizes).toHaveProperty('medium');
    expect(theme.typography.fontSizes).toHaveProperty('large');
    expect(theme.typography.fontSizes).toHaveProperty('xlarge');

    Object.values(theme.typography.fontSizes).forEach(size => {
      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThan(0);
    });

    // Check font weights
    expect(theme.typography.fontWeights).toHaveProperty('regular');
    expect(theme.typography.fontWeights).toHaveProperty('medium');
    expect(theme.typography.fontWeights).toHaveProperty('bold');

    Object.values(theme.typography.fontWeights).forEach(weight => {
      expect(typeof weight).toBe('string');
      expect(['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']).toContain(weight);
    });
  });

  it('has required border radius values', () => {
    expect(theme.borderRadius).toHaveProperty('small');
    expect(theme.borderRadius).toHaveProperty('medium');
    expect(theme.borderRadius).toHaveProperty('large');
  });

  it('has valid border radius values', () => {
    Object.values(theme.borderRadius).forEach(radius => {
      expect(typeof radius).toBe('number');
      expect(radius).toBeGreaterThanOrEqual(0);
    });
  });

  it('has required elevation values', () => {
    expect(theme.elevation).toHaveProperty('small');
    expect(theme.elevation).toHaveProperty('medium');
    expect(theme.elevation).toHaveProperty('large');
  });

  it('has valid elevation values', () => {
    Object.values(theme.elevation).forEach(elevation => {
      expect(typeof elevation).toBe('number');
      expect(elevation).toBeGreaterThanOrEqual(0);
    });
  });
}); 