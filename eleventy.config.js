import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";

// Renders every photo in a folder as a carousel slide. The full-size originals
// are resized at build time, so they are never copied to the output.
async function carousel(dir, altPrefix) {
  const files = fs
    .readdirSync(path.join("src", dir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  const slides = await Promise.all(
    files.map(async (file, i) => {
      const metadata = await Image(path.join("src", dir, file), {
        widths: [800, 1600],
        formats: ["webp", "jpeg"],
        outputDir: path.join("docs", dir),
        urlPath: `/${dir}/`,
      });
      const html = Image.generateHTML(metadata, {
        alt: `${altPrefix} ${i + 1}`,
        sizes: "(min-width: 56rem) 56rem, 100vw",
        loading: i === 0 ? "eager" : "lazy",
        decoding: "async",
      });
      return `<div class="carousel-slide">${html}</div>`;
    })
  );

  return `<div class="carousel" role="region" aria-roledescription="carousel" aria-label="${altPrefix}">
<div class="carousel-track">${slides.join("")}</div>
</div>`;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  // Top-level images only: photo folders (e.g. img/CC25) go through the carousel shortcode
  eleventyConfig.addPassthroughCopy({ "src/img/*.*": "img" });
  eleventyConfig.addPassthroughCopy("src/js");
  // Keep the custom domain across rebuilds
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  // Stop GitHub Pages from running Jekyll on the output
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

  eleventyConfig.addAsyncShortcode("carousel", carousel);

  return {
    dir: { input: "src", output: "docs" },
    htmlTemplateEngine: "liquid",
  };
}
