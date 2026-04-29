// tweaks-app.jsx — Tweaks UI for the personal site

const FONT_LINKS = {
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap',
  'Lora': 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
  'DM Serif Display': 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap',
  'Cormorant Garamond': 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
};

function ensureFont(family) {
  const id = 'twk-font-' + family.replace(/\s+/g, '-');
  if (document.getElementById(id)) return;
  const href = FONT_LINKS[family];
  if (!href) return;
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet'; link.href = href;
  document.head.appendChild(link);
}

// Lighten a hex color by mixing with white (for the blue-bg tint).
function tint(hex, amt = 0.86) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  const toHex = (c) => c.toString(16).padStart(2,'0');
  return '#' + toHex(mix(r)) + toHex(mix(g)) + toHex(mix(b));
}
function lighten(hex, amt = 0.25) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  const toHex = (c) => c.toString(16).padStart(2,'0');
  return '#' + toHex(mix(r)) + toHex(mix(g)) + toHex(mix(b));
}

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply tweaks to the live document.
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--blue', t.accentColor);
    root.style.setProperty('--blue2', lighten(t.accentColor, 0.18));
    root.style.setProperty('--blue3', lighten(t.accentColor, 0.45));
    root.style.setProperty('--blue-bg', tint(t.accentColor, 0.88));
    root.style.setProperty('--teal', t.accent2Color);
  }, [t.accentColor, t.accent2Color]);

  React.useEffect(() => {
    const frame = document.getElementById('photoFrame');
    if (frame) frame.dataset.style = t.photoStyle;
  }, [t.photoStyle]);

  React.useEffect(() => {
    ensureFont(t.headingFont);
    // Override Playfair-using rules globally.
    let style = document.getElementById('twk-font-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'twk-font-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      h1, h2, h3, h4, .logo, .tl-role, .tk-items, .contact-head, .stat-num,
      .pub h4, .area h3, .email-a, .about-prose p:first-child::first-letter,
      h1 .ln, h2 em {
        font-family: '${t.headingFont}', serif !important;
      }
    `;
  }, [t.headingFont]);

  React.useEffect(() => {
    const grid = document.querySelector('.hero-grid-bg');
    if (grid) grid.style.display = t.showHeroGrid ? '' : 'none';
  }, [t.showHeroGrid]);

  React.useEffect(() => {
    const card = document.querySelector('.map-card');
    if (card) card.style.display = t.showMapCard ? '' : 'none';
  }, [t.showMapCard]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Color" />
      <TweakColor label="Primary accent" value={t.accentColor}
                  onChange={(v) => setTweak('accentColor', v)} />
      <TweakColor label="Secondary accent" value={t.accent2Color}
                  onChange={(v) => setTweak('accent2Color', v)} />

      <TweakSection label="Photo" />
      <TweakRadio label="Frame style" value={t.photoStyle}
                  options={['offset', 'border', 'circle']}
                  onChange={(v) => setTweak('photoStyle', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Heading font" value={t.headingFont}
                   options={['Playfair Display', 'Lora', 'DM Serif Display', 'Cormorant Garamond']}
                   onChange={(v) => setTweak('headingFont', v)} />

      <TweakSection label="Layout" />
      <TweakToggle label="Hero grid bg" value={t.showHeroGrid}
                   onChange={(v) => setTweak('showHeroGrid', v)} />
      <TweakToggle label="Show map card" value={t.showMapCard}
                   onChange={(v) => setTweak('showMapCard', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
