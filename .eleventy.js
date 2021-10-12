const Image = require("@11ty/eleventy-img");
const path = require("path")
const slugify = require("slugify")


function getFileName(id, src, width, format, options) {
      let extension = path.extname(src)
      let name = path.basename(src, extension)
      name = options.title
      return `${name}-${width}w.${format}`;
    }

async function imageShortcode(src, alt, sizes = "100vw") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, { widths: [400, 600, null],
                                      formats: ["jpg"],
                                      outputDir: "./dist/assets/img/",
                                      urlPath: "/assets/img/",
                                      filenameFormat: getFileName,
                                      title: slugify(alt, {lower: true, strict: true})
                                    })
      console.log(metadata)

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        class="tepiton"
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}




module.exports = function (eleventyConfig) {

  //  turns out YRGNI

  eleventyConfig.addPassthroughCopy("src/assets")

  eleventyConfig.addFilter("pdump", require("./js/pdump.js"))

  // The ever-popular markdown filter.
  eleventyConfig.addFilter("markdown", (content) => md.renderInline(content))
  eleventyConfig.addFilter("markdown2", (content) => md.render(content))

  eleventyConfig.addFilter("debugger", (...args) => {
    console.log('****')
    console.log(...args)
    console.log('----')

    debugger;
  })


  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);


  eleventyConfig.addCollection("byDraftDate", collectionAPI => {
    let list = collectionAPI.getFilteredByTag('tepiton')
                            .sort((a, b) => a.data.draftDate - b.data.draftDate)
    return list
  })

  //  Everyone wants to hook into the
  //  markdown processor

  const md =  require("markdown-it")({
                      html: true,
                      breaks: false,
                      linkify: true,
                      typographer: true
              })

  eleventyConfig.setLibrary("md", md)

  return {
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: [
      "md",
      "njk",
      "html",
      "11ty.js"
    ],

    passthroughFileCopy: true,

    dir: {
      output:   "dist",
      input:    "src",
      includes: "includes", //  These are inside the `input` directory
      data:     "data"
    }
  }
}
