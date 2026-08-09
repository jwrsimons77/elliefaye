/* Eleventy config for Blue Orangutan Tales.
   The public blog (home, book reviews, poems, about) is built from
   templates in this repo, with posts written as Markdown files in posts/.
   The password-protected portfolio and contact pages remain hand-written
   HTML and are copied through untouched. */

export default function (eleventyConfig) {
  // Static assets, copied straight into the built site
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("audio");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // The portfolio and contact pages are finished static HTML, not templates
  eleventyConfig.addPassthroughCopy("portfolio");
  eleventyConfig.addPassthroughCopy("get-in-touch");
  eleventyConfig.ignores.add("portfolio/**");
  eleventyConfig.ignores.add("get-in-touch/**");
  eleventyConfig.ignores.add("README.md");

  // Draft posts (draft: true in front matter) are skipped in production
  // builds. Run `ELEVENTY_DRAFTS=1 npx eleventy --serve` to preview them.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && !process.env.ELEVENTY_DRAFTS) {
      return false;
    }
  });

  // Posts live in posts/, split into two collections by their `type`
  eleventyConfig.addCollection("reviews", (api) =>
    api.getFilteredByGlob("posts/*.md").filter((p) => p.data.type === "review")
      .sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("poems", (api) =>
    api.getFilteredByGlob("posts/*.md").filter((p) => p.data.type === "poem")
      .sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("posts/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addFilter("isoDate", (date) =>
    new Date(date).toISOString().split("T")[0]
  );
  eleventyConfig.addFilter("rfc3339", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("absoluteUrl", (path, base) =>
    new URL(path, base).href
  );
  // ★★★★☆ from a numeric rating out of 5
  eleventyConfig.addFilter("starString", (rating) => {
    const full = Math.round(Number(rating) || 0);
    return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
