/* Adds width/height attributes (so pages don't jump while images load) and
   loading="lazy" / decoding="async" to <img> tags in the hand-written static
   pages. The first image on each page keeps eager loading since it is
   usually above the fold. Run with: npm run img:dimensions */

import { readFileSync, writeFileSync } from "node:fs";
import { imageSize } from "image-size";
import { globSync } from "node:fs";

const files = [
  ...globSync("portfolio/**/index.html"),
  "portfolio/index.html",
  "get-in-touch/index.html",
];

for (const file of new Set(files)) {
  let html = readFileSync(file, "utf8");
  let firstImage = true;
  let updated = 0;

  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    const srcMatch = tag.match(/src="(\/(?:images|audio)\/[^"]+)"/);
    if (!srcMatch) return tag;

    let out = tag;
    if (!/\bwidth=/.test(out)) {
      try {
        const dim = imageSize(readFileSync(srcMatch[1].slice(1)));
        if (dim.width && dim.height) {
          out = out.replace(
            /^<img\b/,
            `<img width="${dim.width}" height="${dim.height}"`
          );
        }
      } catch {
        /* unreadable or unsupported file: leave the tag alone */
      }
    }
    if (!/\bloading=/.test(out) && !firstImage) {
      out = out.replace(/^<img\b/, '<img loading="lazy"');
    }
    if (!/\bdecoding=/.test(out)) {
      out = out.replace(/^<img\b/, '<img decoding="async"');
    }
    if (out !== tag) updated++;
    firstImage = false;
    return out;
  });

  writeFileSync(file, html);
  console.log(`${file}: ${updated} images updated`);
}
