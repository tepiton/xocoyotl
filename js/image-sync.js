// image shortcode

const Image   = require("@11ty/eleventy-img")
const slugify = require("slugify")
const path    = require("path")

function getFileName(id, src, width, format, options) {
  let extension = path.extname(src)
  let name = options.title
  return `${name}-${width}w.${format}`;
}


async function imageShortcode(src, alt, orig_text = "", orig_url = "", sizes = "100vw") {
  const options = { widths: [400, 600, null],
    formats: ["jpg"],
    outputDir: "./dist/assets/img/",
    urlPath: "/assets/img/",
    filenameFormat: getFileName,
    title: slugify(alt, {lower: true, strict: true})
  }

  let metadata = await Image(src, options)
  let lowsrc   = metadata.jpeg[0];
  let highsrc  = metadata.jpeg[metadata.jpeg.length - 1];
  let xmetadata = Image.statsByDimensionsSync(src, 600, 600, options)

  return `<figure><picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img class="tepiton" src="${lowsrc.url}" width="${highsrc.width}"
        height="${highsrc.height}" alt="${alt}" loading="lazy" decoding="async">
    </picture>
    <figcaption><a href="${orig_url}">${orig_text}</a></figcaption>
    </figure>
    `;
}

module.exports = imageShortcode