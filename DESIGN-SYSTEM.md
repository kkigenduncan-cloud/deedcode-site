# DeedCode Design System v5

One file controls the look: `theme.css`. It loads after each page's own CSS (`<link rel="stylesheet" href="theme.css?v=5">`), so change a token there and the whole site follows. After editing it, bump `?v=5` to `?v=6` so browsers refresh.

## Tokens
| Token | Value | Role |
|---|---|---|
| `--canvas` / `--ice` | #FFFFFF / #F8FAFC | Backgrounds (60%) |
| `--ink` / `--indigo` | #0F172A / #1E1B4B | Headings, dark sections, footer (30%) |
| `--txt` / `--muted` | #334155 / #475569 | Body and secondary text |
| `--accent-strong` | #047857 | Buttons, links, icons (10%) |
| `--accent-deep` | #065F46 | Button hover |
| `--accent` | #059669 | Brand emerald for decorative lines |
| `--accent-on-dark` | #34D399 | Accent text and ticks on indigo |
| `--line` / `--line-strong` | #E2E8F0 / #CBD5E1 | Borders and dividers |
| `--focus` | #4338CA | Keyboard focus ring (mint on dark sections) |

Fonts: headings are Plus Jakarta Sans (700/800), body and interface are Inter (400-700), loaded from one Google Fonts request with `display=swap`.

## Why emerald, and why #047857 on buttons
White text on #059669 is 3.77:1 and on #D97706 is 3.19:1, so neither reaches the WCAG AA 4.5:1 needed for button labels. Emerald fits M-Pesa and giving, so I kept it and deepened the button fill to #047857.

## Contrast results (WCAG AA = 4.5:1 text, 3:1 large text and UI)
| Pair | Ratio | Result |
|---|---|---|
| Body text #334155 on white | 10.35:1 | Pass AA |
| Body text on Ice White #F8FAFC | 9.90:1 | Pass AA |
| Muted text #475569 on white | 7.58:1 | Pass AA |
| Headings #0F172A on white | 17.85:1 | Pass AA |
| Button: white on #047857 | 5.48:1 | Pass AA |
| Button hover: white on #065F46 | 7.68:1 | Pass AA |
| Link #047857 on Ice White | 5.24:1 | Pass AA |
| Light text #CBD5E1 on #0F172A | 12.02:1 | Pass AA |
| White on indigo #1E1B4B | 15.99:1 | Pass AA |
| Mint #34D399 on #0F172A | 9.29:1 | Pass AA |
| Mint #34D399 on #1E1B4B | 8.32:1 | Pass AA |
| Ink on mint pill #34D399 | 9.29:1 | Pass AA |
| Focus ring #4338CA on white | 7.90:1 | Pass AA |
| Form border #64748B on white | 4.76:1 | Pass AA |
| REJECTED: white on #059669 | 3.77:1 | Large text/UI only |
| REJECTED: white on #D97706 | 3.19:1 | Large text/UI only |

## What changed in the HTML
- Every page: fonts link swapped, `theme.css` linked, legacy gold/blue/serif values remapped to the new palette, skip-to-content link and `id="main"` added.
- `index.html`: the globe animation colours now match the palette.
- `og-image.png`: share card redrawn in the new palette.
