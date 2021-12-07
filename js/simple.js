// image shortcode

const Image   = require("@11ty/eleventy-img")

module.exports = function imageShortcode(src, alt, orig_text = "", orig_url = "", sizes = "100vw") {
    let options = {
      widths: [400, 600, null],
      formats: ['jpeg'],
    };
  
    // generate images, while this is async we don’t wait
    Image(src, options);
  
    let imageAttributes = {
      class: "tepiton",
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
    // get metadata even the images are not fully generated
    metadata = Image.statsSync(src, options);
    return Image.generateHTML(metadata, imageAttributes);
  }
  
