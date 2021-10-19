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
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, { widths: [400, 600, null],
                                      formats: ["jpg"],
                                      outputDir: "./dist/assets/img/",
                                      urlPath: "/assets/img/",
                                      filenameFormat: getFileName,
                                      title: slugify(alt, {lower: true, strict: true})
                                    })

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img class="tepiton" src="${lowsrc.url}" width="${highsrc.width}"
        height="${highsrc.height}" alt="${alt}" loading="lazy" decoding="async">
    </picture>`;
}

//  if the excerpt property is a function, it
//  runs that instead of the default excerpt
//  mechanism: https://github.com/jonschlinkert/gray-matter/blob/master/lib/excerpt.js
//
//  however, eleventy _still_ handles the excerpt
//  https://github.com/11ty/eleventy/blob/7b568830320efafee03613c886e38c52da6b414d/src/TemplateContent.js#L106
//
//  so the important thing to avoid eleventy's processing
//  is to make sure that file.excerpt is not truthy
//  (eleventy removes the excerpt marker)
//  on the positive it means that we can use the
//  excerpt_alias mechanisms

function examine(file, options) {
  const excerptLength = 256

  const sep =   file.data.excerpt_separator
             || options.excerpt_separator

  if (sep == null && (options.excerpt === false || options.excerpt == null)) {
    return file
  }

  const delimiter = typeof options.excerpt === 'string'
                  ? options.excerpt
                  : sep

  file.excerpt = file.content.substring(0, excerptLength)

  if (file.excerpt.length == excerptLength)
    file.excerpt += '...'

  let first = file.content.indexOf(delimiter)
  let last  = file.content.lastIndexOf(delimiter)

        //  no excerpt marker
  if (first == -1 && last == -1)
    return file



  if (first == last) {
    file.excerpt = file.content.substring(0, last).trim()
  } else {
    first += delimiter.length
    file.excerpt = file.content.substring(first, last).trim()
  }

  let re = new RegExp(delimiter, 'g')
  file.content = file.content.replace(re, '')

  console.log('** first:', first)
  console.log('** last:', last)
  console.log('** file:', file)
  console.log('** options', options)


  return file
}


module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets")
  eleventyConfig.addFilter("pdump", require("./js/pdump.js"))
  eleventyConfig.setFrontMatterParsingOptions({
      excerpt:  examine,
      excerpt_separator: "<!-- excerpt -->",
      excerpt_alias: "excerpt"
  })


  // The ever-popular markdown filter.
  eleventyConfig.addFilter("markdown", (content) => md.renderInline(content))
  eleventyConfig.addFilter("markdown2", (content) => md.render(content))

  eleventyConfig.addFilter("debugger", (...args) => {
    console.log('>>>>')
    console.log(...args)
    console.log('<<<<')
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
