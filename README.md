# cody-joseph

One page, two people. Cody edits `cody.html`, Joseph edits `joseph.html` — that's it, that's the whole workflow. `index.html` fetches both fragments and drops them side by side, sharing one stylesheet so neither side can clash with the other no matter what goes in them.

**Live:** https://cody-joseph.github.io/cody-joseph/

## Files

| File | Who touches it | What it is |
|---|---|---|
| `index.html` | rarely | the shell — masthead, the seam/VS mark, fetch logic |
| `style.css` | rarely | shared design tokens (colors, fonts, layout) both sides inherit |
| `script.js` | rarely | fetches `cody.html` / `joseph.html` and injects them |
| `cody.html` | Cody | just Cody's content — a plain HTML fragment, no `<html>`/`<head>` |
| `joseph.html` | Joseph | just Joseph's content — same deal |

You basically never need to open `index.html`, `style.css`, or `script.js` unless you're changing the shared layout. Day to day, you're only editing your own fragment.

## Editing your side

Copy the structure already in your file. The classes below are what plug into the shared styling — use them and you'll automatically get your side's accent color (green for Cody, blue for Joseph) with zero CSS of your own:

```html
<p class="eyebrow">Player 1</p>

<div class="fighter-header">
  <div class="portrait">C</div>
  <div>
    <h2 class="fighter-name">Your Name</h2>
    <p class="fighter-tag">Your class / role</p>
  </div>
</div>

<p class="bio">A couple sentences about you.</p>

<div class="stat-bars">
  <div class="stat-bar">
    <div class="stat-bar-label"><span>Power</span><b>92</b></div>
    <div class="stat-bar-track"><div class="stat-bar-fill" style="width:92%"></div></div>
  </div>
  <!-- repeat for as many stats as you want -->
</div>

<div class="links">
  <a class="primary" href="https://example.com" target="_blank" rel="noopener">Main link</a>
  <a href="https://example.com" target="_blank" rel="noopener">Another link</a>
</div>

<p class="section-label">Special moves</p>
<ul class="move-list">
  <li><span class="name">Move name</span><span class="tag">description</span></li>
</ul>
```

### Profile image (optional)

By default `.portrait` just shows the first letter of your name:

```html
<div class="portrait">C</div>
```

To use a photo instead, drop an `<img>` in there and delete the letter:

```html
<div class="portrait"><img src="cody-photo.jpg" alt="Cody"></div>
```

It'll get cropped to fill the badge (`object-fit: cover`), so a roughly square image looks best. No image → you get the letter. Never both at once — pick one.

### Background image (optional)

Each half can have its own full-bleed background photo behind everything (it gets automatically dimmed with a dark gradient so text stays readable, and your side's accent glow still washes over it). To turn it on, add this anywhere in your fragment:

```html
<img class="bg-photo" src="cody-bg.jpg" alt="">
```

`script.js` picks this up on load, applies it as your half's background, and removes the tag itself — it won't show up as an inline image in your content. Leave it out and your side just keeps the plain dark background with the color glow, like now.

## Previewing locally

This uses `fetch()` to load the fragments, which most browsers block for files opened directly from disk (`file://`). Serve the folder instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Once it's pushed to GitHub Pages, this isn't an issue — everything's served over `https://` and `fetch()` works fine.

## Deploying

Push to `main`, enable GitHub Pages on the repo (Settings → Pages → Deploy from branch → `main` / root). No build step, no dependencies to install.
