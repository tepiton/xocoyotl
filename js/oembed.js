const { extract }    = require('oembed-parser')
const imageShortcode = require('./image.js')

module.exports = async function oembed(url, params) {
  let oembed_data = await extract(url, params)

  if (params?.native)
    return oembed_data.html

  switch ( oembed_data.provider_name ) {
        case 'The New York Times':
            return nytHandler(oembed_data)
            break

        case 'Twitter':
            return twitterHandler(oembed_data)
            break

        case 'Flickr':
            return flickrHandler(oembed_data)
            break

        default:
            return defaultHandler(oembed_data)
            break
      }

  nytHandler: function nytHandler (oembed_data) {
      let ret = `
      <blockquote>
        <h3>${oembed_data.title}</h3>
        <p>${oembed_data.summary}</p>
        <cite>
          <a href="${oembed_data.url}">
            ${oembed_data.provider_name}
          </a>
          <br>${oembed_data.publication_date}</cite>
        </blockquote>`
      return ret
  }

  twitterHandler: function twitterHandler (oembed_data) {
      return oembed_data.html
  }

  flickrHandler: function flickrHandler (oembed_data) {
    let txt = oembed_data.author_name

    let ret = imageShortcode(oembed_data.url, oembed_data.title, oembed_data.web_page, oembed_data.author_name,  sizes = "100vw")
    if (params?.native)
        ret = oembed_data.html
    return ret
  }

  defaultHandler: function defaultHandler (oembed_data) {
      let embed_html = oembed_data.html
      console.log('\n')
      console.log(url, params)
      console.log(JSON.stringify(oembed_data, null, 2))
      return embed_html
  }
}

