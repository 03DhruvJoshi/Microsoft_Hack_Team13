export function buildTheme(highContrast) {
  return highContrast
    ? {
        bg: '#000000', surface: '#0A0A0A', surfaceAlt: '#1A1A1A',
        ink: '#FFFFFF', inkSoft: '#D4D4D4', inkFaint: '#888888',
        accent: '#FFD60A', accentSoft: '#FFE85533',
        rule: '#FFFFFF', success: '#4ADE80', warning: '#FBBF24', error: '#FF6B6B',
      }
    : {
        bg: '#F4F1EA', surface: '#FFFEFA', surfaceAlt: '#EDE8DD',
        ink: '#1C1C1C', inkSoft: '#3A3A3A', inkFaint: '#7A756B',
        accent: '#E8553D', accentSoft: '#E8553D22',
        rule: '#1C1C1C', success: '#5B7A3D', warning: '#C4843A', error: '#B0382A',
      };
}
