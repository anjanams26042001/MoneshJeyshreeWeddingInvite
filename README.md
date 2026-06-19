# Wedding Invitation Project — Arjun & Meera

A luxury, single-page, cinematic South Indian wedding invitation website,
built to match the provided design mockup exactly.

## Structure
```
wedding-invitation-project/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js        # scroll reveals, countdown, carousels, photo loader
│   ├── js/petals.js      # floating jasmine petals (canvas)
│   └── images/           # drop your photos here (see below)
│       └── _DESIGN_REFERENCE.jpg   # the original mockup, for reference only
└── README.md
```

## View it
Double-click `index.html`, or run a local server:
```
cd wedding-invitation-project
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add your real photos
Every photo slot shows a **"Your Photo"** placeholder until you add the matching
file. Drop JPGs into `assets/images/` named **exactly** like this — they appear
automatically, no code changes needed:

| Section          | File names |
|------------------|-----------|
| Our Story        | `story-1.jpg` `story-2.jpg` `story-3.jpg` `story-4.jpg` |
| Glimpses of Us   | `g1.jpg` `g2.jpg` `g3.jpg` `g4.jpg` `g5.jpg` `g6.jpg` |
| Memory Lane      | `m1.jpg` `m2.jpg` `m3.jpg` `m4.jpg` `m5.jpg` |
| Closing portrait | `closing.jpg` |

(`g3.jpg` is the large centre frame in the gallery.)

## Easy text edits (all in `index.html`)
| What | Where |
|------|-------|
| Couple names | search `Arjun` / `Meera` |
| Date / day | hero `25th June 2025` · `Wednesday` |
| Venue | hero + venue section (`Sree Banyan Tree Convention`) |
| Events & timings | the `.event-row` cards |
| Blessings | the `.bless-note` blocks |
| Map link | venue `Show on Map` href |

## Change the countdown
`assets/js/main.js` →
```js
var target = new Date('2025-06-25T09:30:00+05:30').getTime();
```

## Colors
All theme colors are CSS variables at the top of `assets/css/style.css`
(`:root`) — ivory, cream, gold, maroon, green, rose.

## Sections (top → bottom)
Hero · Our Story · Wedding Celebrations · Sacred Muhurtham (live countdown)
· Glimpses of Us (carousel) · Venue · Blessings Wall · Memory Lane · Closing

Pure HTML/CSS/JS — no build step. Fully responsive. Respects `prefers-reduced-motion`.
