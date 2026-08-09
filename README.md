# Blue Orangutan Tales / Ellie Faye

The public face of this site is now **Blue Orangutan Tales**, Ellie's book review and
poetry blog, named after the blue orangutan bookmark that lives in whatever she is
reading. Ellie's professional copywriting portfolio and the contact form still exist,
but they are private, hidden behind a password.

Plain HTML/CSS/JS, no build step, hosted on Netlify.

## Site structure

```
index.html                              Blog home (Blue Orangutan Tales)
book-reviews/index.html                 Book reviews landing page
poems/index.html                        Poems landing page
about/index.html                        About Ellie
post-template.html                      Copy this to publish a new review or poem
portfolio/home/index.html               Old portfolio homepage (password protected)
portfolio/index.html                    Portfolio grid (password protected)
portfolio/<slug>/index.html             9 case studies (password protected)
get-in-touch/index.html                 Contact form (password protected)
style.css                               All styling
js/main.js                              Nav toggle, contact form, video playback
js/gate.js                              Password gate for the private pages
images/blue-orangutan.svg               Blog mascot, also used as the favicon
robots.txt / sitemap.xml                SEO: only the public blog pages are indexed
```

## The password gate

The portfolio pages and Get In Touch are locked behind the password `EllieFaye`.

How it works: each private page carries a small script that hides the page and shows a
password screen. The visitor's entry is hashed with SHA-256 in the browser and compared
against a stored hash, so the password itself never appears in the source code. A correct
entry is remembered in the browser (localStorage), so each visitor only types it once.

To change the password: generate the new hash with
`printf 'NewPassword' | shasum -a 256` (Mac) or `printf 'NewPassword' | sha256sum`
(Linux), then replace the old hash everywhere it appears: once in `js/gate.js` and once
in the head script of every private page. Search the project for the old hash and
replace all matches.

Honest limitation: this is a privacy screen, not bank-grade security. The page content
is still in the HTML source for anyone determined enough to read it. It is the right
level of protection for keeping a portfolio out of casual view and out of search
engines (all private pages are marked noindex, blocked in robots.txt and served with a
noindex header from `netlify.toml`). If stronger protection is ever needed, Netlify's
built-in password protection (a paid feature) locks pages at the server.

## Publishing a new blog post

1. Copy `post-template.html` to `book-reviews/your-post-slug/index.html` or
   `poems/your-post-slug/index.html`.
2. Follow the TODO notes inside the file (title, description, date, body, and delete
   the temporary noindex line).
3. Add a card linking to the post on the matching landing page and, if you like, on the
   homepage under Latest tales.
4. Add the new URL to `sitemap.xml`.

House style: no em dashes anywhere on the site. Use commas, colons or full stops
instead.

## SEO notes

The blog is optimised around North West poetry and book reviewing: page titles and
descriptions mention North West poets, Manchester and book reviews, structured data
(JSON-LD) describes the site, the blog and Ellie as a person, and `sitemap.xml` lists
the public pages. The biggest SEO lever from here is simply publishing posts: each
review should name the book and author in its title, and each poem page gives search
engines another page of original writing to index. Instagram: the blog links throughout
to https://www.instagram.com/blueorangutantales/

## Deploying on Netlify

1. Push to the connected repo, Netlify deploys automatically. Build command blank,
   publish directory `.` (already set in `netlify.toml`).
2. Netlify Forms powers the Get In Touch page automatically once live on a Netlify
   domain.

## Known differences from the original portfolio site

**Fonts.** The original used Adobe Fonts (Obviously Wide and Aktiv Grotesk), licensed to
the old Squarespace account. This rebuild uses Poppins and Inter from Google Fonts as
the closest free equivalents.

**Videos.** The portfolio video clips still stream from Squarespace's video CDN. If the
Squarespace account is cancelled they will break. Download the originals from the
Squarespace editor first and swap the `data-hls-src` attributes for local files.

**Audio.** The three Changing Minds on HIV radio ads are self-hosted in `audio/`, with
no Squarespace dependency.
