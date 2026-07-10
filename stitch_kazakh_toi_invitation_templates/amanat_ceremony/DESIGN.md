---
name: Amanat Ceremony
colors:
  surface: '#fbfbe2'
  surface-dim: '#dbdcc3'
  surface-bright: '#fbfbe2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f5dc'
  surface-container: '#efefd7'
  surface-container-high: '#eaead1'
  surface-container-highest: '#e4e4cc'
  on-surface: '#1b1d0e'
  on-surface-variant: '#404944'
  inverse-surface: '#303221'
  inverse-on-surface: '#f2f2d9'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#a53936'
  on-secondary: '#ffffff'
  secondary-container: '#fe7c74'
  on-secondary-container: '#721315'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#852221'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbfbe2'
  on-background: '#1b1d0e'
  surface-variant: '#e4e4cc'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  button:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  section-gap-lg: 80px
  section-gap-sm: 48px
---

## Brand & Style

The design system is rooted in the concept of "Amanat"—a sacred trust or legacy. It balances the profound weight of Kazakh heritage with the effortless grace of a premium modern digital experience. The brand personality is ceremonial, respectful, and deeply hospitable (*Qonaqjaylylyq*).

The aesthetic direction is **Refined Neo-Traditionalism**. It avoids the clutter of souvenir-style ethnic patterns in favor of architectural minimalism and high-end editorial layouts. We utilize "Digital Silk" textures, expansive whitespace (Ivory), and deliberate, meaningful placement of traditional motifs to evoke a sense of occasion. The UI should feel like a hand-delivered, high-grammage paper invitation transitioned perfectly into a mobile-first digital environment.

## Colors

The palette is inspired by the textures of a luxury gala and the natural landscape of the Steppe. 

- **Emerald Green (#064E3B):** Represents life and growth; used for primary actions and key ceremonial headers.
- **Deep Burgundy (#7F1D1D):** Evokes the richness of traditional textiles and royalty; used for secondary accents and "Save the Date" highlights.
- **Soft Gold (#D4AF37):** Used sparingly for borders, ornaments, and high-level emphases. It should never be used for body text to ensure legibility.
- **Warm Sand (#F5F5DC) & Pearl White (#FCFAFA):** These form the canvas, providing a warm, inviting alternative to "digital white" that feels more like premium stationery.

## Typography

This design system employs a sophisticated contrast between **EB Garamond** and **Hanken Grotesk**.

- **EB Garamond** is the voice of tradition. It is reserved for names of the hosts/honorees, invitation titles, and poetic quotes. It should be typeset with generous leading to let the letterforms breathe.
- **Hanken Grotesk** serves the functional needs. Its clean, geometric lines ensure that event details (date, time, location) and RSVP forms are perfectly legible on mobile devices.
- **Scale:** Use `display-lg` for the primary name of the celebration (e.g., *Toi*, *Uzatuy*). Use `label-md` for structural markers like "Where" and "When".

## Layout & Spacing

The layout philosophy is **Vertical Storytelling**. Since this is a mobile-first platform, content is organized in a single-column flow with "vignette" sections that use high-quality photography as backdrops.

- **The Grid:** A 12-column grid on desktop, shifting to a robust 4-column grid on mobile with 24px side margins.
- **Rhythm:** Use large vertical gaps (`section-gap-lg`) between major content blocks (e.g., between the Hero and the Event Details) to create a sense of unfolding.
- **Safe Areas:** Ensure that decorative ornaments (koshkar muiz) never overlap with functional text; they should occupy the "white space" between sections.

## Elevation & Depth

To maintain a "paper" aesthetic, this design system avoids heavy shadows. Instead, it uses:

- **Tonal Layering:** Different shades of Sand and Pearl are stacked to create hierarchy. A card containing the RSVP form might be Pearl White against a Warm Sand background.
- **Ambient Depth:** When elevation is required (e.g., for a "Submit RSVP" button), use extremely soft, large-radius shadows (20px-40px blur) with very low opacity (5-10%) tinted with the Primary Emerald or Deep Burgundy color rather than pure black.
- **Inner Borders:** Use a 1px Soft Gold (#D4AF37) inset border on primary cards to simulate gold-leaf foiling found on physical invitations.

## Shapes

The shape language is **Soft and Architectural**. 

- Use **Soft (0.25rem)** corners for functional elements like input fields and buttons to maintain a professional, high-end look.
- **Ornamental Containers:** For image galleries or maps, use an "Arch" shape (rounded-top only) to mimic the structure of a yurt's entrance or classical architecture.
- **Iconography:** Icons should be thin-stroke (1.5pt) and geometric, avoiding overly rounded or bubbly styles.

## Components

### Buttons
Primary buttons use a solid Emerald Green background with white Hanken Grotesk text. Secondary buttons use a transparent background with a 1px Soft Gold border. Buttons are never fully pill-shaped; they maintain a slightly structured, rectangular form with soft corners.

### Ornaments (Koshkar Muiz)
Subtle Kazakh ornaments should be used as "Section Breakers." They should be rendered in a low-opacity Soft Gold or as a tonal watermark in the background. Do not over-use; one ornament per major section transition is sufficient.

### Input Fields
RSVP fields should be "Minimalist Stationery" style: a single bottom border (1px) in Warm Sand that turns Emerald Green on focus. Labels should be small and uppercase using `label-md`.

### Cards
Cards are used to group event details. They should have a Pearl White background, no visible border, and a subtle 1px Gold inset border. 

### Image Placeholders
Photography is central to the premium feel. Use high-quality, desaturated or warm-toned imagery. Apply a very slight "grain" overlay to photos to give them a tactile, film-like quality.