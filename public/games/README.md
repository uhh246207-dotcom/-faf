# Game brand images

Drop your game artwork in this folder, then enable the matching brand by
editing `components/brand-logos/index.tsx` — uncomment the `image:` line
inside each game's brand entry.

## Expected filenames

| Game               | Recommended file              | Brand key      |
| ------------------ | ----------------------------- | -------------- |
| Roblox             | `roblox.png`                  | `roblox`       |
| Liên Quân          | `lienquan.png`                | `lienquan`     |
| Free Fire          | `freefire.png`                | `freefire`     |
| Play Together      | `playtogether.png`            | `playtogether` |
| League of Legends  | `lol.png`                     | `lol`          |
| FIFA               | `fifa.png`                    | `fifa`         |
| Genshin Impact     | `genshin.png`                 | `genshin`      |
| Valorant           | `valorant.png`                | `valorant`     |

Any image format Next.js supports works (`.png`, `.jpg`, `.webp`, `.avif`).
JPG/WebP is recommended for photographic key art; PNG for transparent logos.

## Recommended specs

- **Aspect ratio:** roughly square or 16:10 — they are rendered with
  `object-cover` inside a 16:10 / 16:12 frame.
- **Resolution:** at least **1024×640** for crisp results on retina displays.
- **File size:** keep each under ~250 KB if possible (Next/Image will
  re-compress at runtime, but smaller sources start faster).

## Enabling an image

Once a file is in place, open
`components/brand-logos/index.tsx` and uncomment the matching line:

```ts
roblox: {
  name: 'Roblox',
  from: '#FF4D4D',
  to: '#FF7A00',
  glyph: RobloxGlyph,
  image: '/games/roblox.png', // <-- uncomment this
},
```

The image will then automatically appear in:
- the **homepage showcase banner**,
- the **sidebar brand badge**,
- every **product card** in the store,
- the **product detail page** hero.

If `image` is not set (or you delete the file), the gradient + glyph
fallback is rendered instead — nothing breaks.
