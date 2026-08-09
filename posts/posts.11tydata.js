/* Shared settings for everything in posts/. Each post picks its URL from
   its type: reviews publish under /book-reviews/, poems under /poems/. */
export default {
  layout: "layouts/post.njk",
  permalink: (data) =>
    `${data.type === "review" ? "/book-reviews/" : "/poems/"}${data.page.fileSlug}/`,
};
