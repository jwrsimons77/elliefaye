# Blue Orangutan Tales / Ellie Faye

The public face of this site is **Blue Orangutan Tales**, Ellie's book review and
poetry blog, named after the blue orangutan bookmark that lives in whatever she is
reading. Ellie's professional copywriting portfolio and the contact form still exist,
but they are private, behind a password checked on the server.

Built with [Eleventy](https://www.11ty.dev/), hosted on Netlify. Blog posts are plain
Markdown files; the listings, home page, sitemap and RSS feed all build themselves.

## Publishing a new blog post

1. In `posts/`, copy `sample-book-review.md` (for a review) or `sample-poem.md`
   (for a poem) and rename it. The filename becomes the web address:
   `the-heart-principle.md` publishes at `/book-reviews/the-heart-principle/`.
2. Fill in the details at the top of the file and write the post below them.
   The instructions are inside each sample file.
3. Delete the `draft: true` line, commit and push (or edit the file directly on
   github.com and press "Commit changes"). Netlify rebuilds the site automatically.

That is the whole job: the review appears on the home page and its listing page, in
`sitemap.xml` and in the RSS feed, with star-rating structured data for Google, all
without touching another file.

To preview drafts locally: `ELEVENTY_DRAFTS=1 npm run serve`.

House style: no em dashes anywhere on the site. Use commas, colons or full stops
instead.

## Site structure

```
index.njk                               Blog home
book-reviews.njk / poems.njk            Listing pages (loop over posts/)
about.njk                               About Ellie
404.njk                                 Themed "page not found"
posts/*.md                              Blog posts (Markdown + front matter)
posts/posts.11tydata.js                 Shared post settings (layout, URLs)
_includes/layouts/base.njk              Shared head, header, footer, SEO tags
_includes/layouts/post.njk              Post page + Review/BlogPosting JSON-LD
_includes/post-card.njk                 Post card used on listings and home
_data/site.json                         Site name, URL, description, socials
feed.njk / sitemap.njk                  Generate /feed.xml and /sitemap.xml
eleventy.config.js                      Build config
portfolio/**/index.html                 Portfolio case studies (static, private)
get-in-touch/index.html                 Contact form (static, private)
netlify/edge-functions/portfolio-gate.js  Server-side password gate
style.css                               All styling
fonts/                                  Self-hosted Caveat, Lora and Inter
js/main.js                              Nav toggle, contact form, video playback
images/og-card.png                      Social sharing card (1200x630)
tools/add-image-dimensions.mjs          One-off: width/height + lazy loading
```

## Local development

```
npm install
npm run serve        # http://localhost:8080
npm run build        # writes the site to _site/
```

## The password gate

The portfolio pages and Get In Touch are protected by a Netlify Edge Function
(`netlify/edge-functions/portfolio-gate.js`). Unlike the old client-side gate, the
protected pages are never sent to the browser until the correct password is entered,
and the password lives in one place.

**Setup (one time):** in the Netlify dashboard go to Site configuration, then
Environment variables, and add a variable named `PORTFOLIO_PASSWORD` with the chosen
password, then redeploy. Until that variable exists the gate stays open, so set it
soon after merging.

**To change the password:** change the variable in the dashboard and redeploy.
Everyone's saved logins are invalidated automatically.

The private pages are also kept out of search results three ways: `robots.txt`,
a `noindex` header in `netlify.toml`, and the gate itself.

## SEO

- Every page has a canonical URL, meta description, Open Graph and Twitter tags, and
  a proper PNG sharing card (`images/og-card.png`), so links look right when shared.
- Structured data (JSON-LD): the site, blog and Ellie as Person on every page;
  BlogPosting, breadcrumbs and a Review with Book and star rating on each book
  review, which makes reviews eligible for star rich results in Google.
- `sitemap.xml` and the Atom feed at `/feed.xml` regenerate on every build.
- Fonts are self-hosted (latin subsets of Caveat, Lora, Inter) so no third-party
  requests slow down the first paint.
- The biggest SEO lever from here is publishing: each review should name the book
  and author in its title and opening paragraph.
- Reminder: canonical URLs point at https://elliefaye.co.uk, so connect that domain
  in Netlify (Domain management) for search engines to index the site properly.

## Deploying on Netlify

Push to the connected repo and Netlify builds and deploys automatically
(`npm run build`, publish directory `_site`, already set in `netlify.toml`).
Netlify Forms powers the Get In Touch page once live on a Netlify domain.

## Known differences from the original portfolio site

**Fonts.** The original used Adobe Fonts (Obviously Wide and Aktiv Grotesk), licensed
to the old Squarespace account. The site now uses self-hosted Google fonts: Caveat,
Lora and Inter.

**Videos.** The portfolio video clips still stream from Squarespace's video CDN. If
the Squarespace account is cancelled they will break. Download the originals from the
Squarespace editor first and swap the `data-hls-src` attributes for local files.

**Audio.** The three Changing Minds on HIV radio ads are self-hosted in `audio/`,
with no Squarespace dependency.
