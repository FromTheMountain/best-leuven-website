export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "liquid",
  };
}
