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

  const sep = file.data.excerpt_separator
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

  return file
}

//
//      .eleventy.js really starts here
//

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

  let x = require('./js/image-sync.js')

  eleventyConfig.addNunjucksAsyncShortcode("image", require('./js/image.js'));
  // eleventyConfig.addNunjucksAsyncShortcode("image", require('./js/image-sync.js'));
  // eleventyConfig.addNunjucksShortcode("image", require('./js/simple.js'));

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
