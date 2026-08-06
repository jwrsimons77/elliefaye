# Ellie Faye — site rebuild

A static rebuild of elliefaye.co.uk, hand-built from the live site's content and images,
for hosting on Netlify. Plain HTML/CSS/JS — no build step, no framework, no dependencies
to install. Just push and deploy.

## Deploying on Netlify

1. Push this folder to a GitHub/GitLab/Bitbucket repo (or drag-and-drop the folder into
   Netlify's "Deploys" tab for a one-off manual deploy).
2. In Netlify: **Add new site → Import an existing project**, connect the repo.
3. Build settings: leave the build command blank, publish directory = `.` (repo root).
   `netlify.toml` already sets this.
4. Deploy. Netlify Forms (used by the Get In Touch page) works automatically once the
   site is live on a Netlify domain — no extra setup needed.

## What's here

```
index.html                              Home
portfolio/index.html                    Portfolio grid
portfolio/<slug>/index.html             9 case studies
get-in-touch/index.html                 Contact form (Netlify Forms)
css/style.css                           All styling
js/main.js                              Mobile nav toggle + HLS video playback
assets/images/                          82 downloaded campaign/award images
assets/audio/                           3 radio ad mp3s (Changing Minds on HIV)
assets/video-posters/                   Poster frames for the 8 native video clips
```

## Known differences from the original — read before treating this as final

**Fonts.** The original uses Adobe Fonts ("Obviously Wide" for headings, "Aktiv Grotesk"
for body), licensed to the old Squarespace account and tied to that domain — they can't be
carried over as-is. This rebuild uses **Poppins** + **Inter** from Google Fonts as the
closest free equivalents. If you have your own Adobe Fonts subscription, you can swap the
`<link>` tags in every page's `<head>` for your own kit embed and add the new domain to the
kit's allowed domains in your Adobe Fonts account.

**Videos.** The 8 video clips (Sans Gender ×3, Little Songs for Little Leaks ×3, Flags of
Hope, Extra Bits) are still streamed live from Squarespace's video CDN via HLS
(`js/main.js` loads hls.js to play them in browsers other than Safari). This works today,
but it depends on your Squarespace account/media library staying alive — **if you cancel
Squarespace, these will break.** Before you cancel: go to each video block in the
Squarespace editor and download the original file (Video block → Settings → there's a
download/export option, or ask Squarespace support for a bulk export), then drop the files
into `assets/video/` and change each `<video data-hls-src="...">` to a plain
`<video src="/assets/video/yourfile.mp4">`.

One poster frame (Sans Gender's first clip) has a "REVIEW VERSION" watermark baked into
it — that's coming from Squarespace's own thumbnail endpoint, not something introduced
here. Re-export a clean poster from Squarespace's Video Studio if you want it gone.

**Missing poster files.** The 7 files in `assets/video-posters/` never made it into the
repo, so those `<video poster="...">` attributes currently 404. Nothing looks broken —
the players sit on the black `.video-block` background exactly as they would with no
poster at all — but if you want thumbnails before playback, re-export the frames from
Squarespace and drop them in at the filenames the HTML already expects:
`sans-gender-1/2/3.jpg`, `little-songs-1/2/3.jpg`, `flags-of-hope-1.jpg`.

**Audio.** The three "Changing Minds on HIV" radio ads were downloaded directly (permanent
non-expiring links) and are fully self-hosted in `assets/audio/` — no dependency on
Squarespace for these.

**Illustration/decoration.** The "Little Songs for Little Leaks" page had a lot of bespoke
illustrated Squarespace elements (pink drips, music notes, a radio graphic) that weren't
worth hand-recreating as static assets. The copy and images are faithful; the hand-drawn
decoration is simplified to plain typography.

**Content gaps.** Two pages needed the site's password to read
(`ellie-davidson-portfolio` login-gated content) — everything reachable from the public
nav (Home, Portfolio + its 9 case studies, Get In Touch) is rebuilt in full.

## Editing content

No CMS — edit the HTML files directly. Each page is self-contained; there's no templating,
so shared bits (header/nav/footer) are duplicated across every page. If you're comfortable
with a static site generator later (Eleventy, Astro, etc.) this structure ports over
easily, but for a "clone the site, upload manually" workflow, plain files are simplest.
