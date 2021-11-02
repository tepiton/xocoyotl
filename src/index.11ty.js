const stars = "✼ ✼ ✼"

module.exports = class Home {

  data() {
    return {
      layout: "base.njk",
      home: true
    }
  }

  getSummary(post) {
    let retval = post.data.excerpt || 'oops'

    let re = /<img\s+class="tepiton"\s+src="([^"]+)"/
    let m = post.templateContent.match(re)

    if (m)
      retval = `<img src="${m[1]}">`

    return retval
  }

  renderPost(post) {
    let summary = this.getSummary(post)
    summary = this.markdown2(summary)     // wraps in <p>

    if (post.data.newlines) {
      summary = summary.trim().replace(/\n/g, '<br>\n')
    }

    let noTitle = false
    let header  = post.data.title && `<header><a href="${post.url}">${this.markdown(post.data.title)}</a></header>`
    let section = `<section><a href="${post.url}">${summary}</section></a>`
    let footer  = `<footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>`

      //  http://svgicons.sparkk.fr/

    if (post.data.title === stars) {
      header = `<span class="noTitle"><a href="${post.url}"><svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M16.469,8.924l-2.414,2.413c-0.156,0.156-0.408,0.156-0.564,0c-0.156-0.155-0.156-0.408,0-0.563l2.414-2.414c1.175-1.175,1.175-3.087,0-4.262c-0.57-0.569-1.326-0.883-2.132-0.883s-1.562,0.313-2.132,0.883L9.227,6.511c-1.175,1.175-1.175,3.087,0,4.263c0.288,0.288,0.624,0.511,0.997,0.662c0.204,0.083,0.303,0.315,0.22,0.52c-0.171,0.422-0.643,0.17-0.52,0.22c-0.473-0.191-0.898-0.474-1.262-0.838c-1.487-1.485-1.487-3.904,0-5.391l2.414-2.413c0.72-0.72,1.678-1.117,2.696-1.117s1.976,0.396,2.696,1.117C17.955,5.02,17.955,7.438,16.469,8.924 M10.076,7.825c-0.205-0.083-0.437,0.016-0.52,0.22c-0.083,0.205,0.016,0.437,0.22,0.52c0.374,0.151,0.709,0.374,0.997,0.662c1.176,1.176,1.176,3.088,0,4.263l-2.414,2.413c-0.569,0.569-1.326,0.883-2.131,0.883s-1.562-0.313-2.132-0.883c-1.175-1.175-1.175-3.087,0-4.262L6.51,9.227c0.156-0.155,0.156-0.408,0-0.564c-0.156-0.156-0.408-0.156-0.564,0l-2.414,2.414c-1.487,1.485-1.487,3.904,0,5.391c0.72,0.72,1.678,1.116,2.696,1.116s1.976-0.396,2.696-1.116l2.414-2.413c1.487-1.486,1.487-3.905,0-5.392C10.974,8.298,10.55,8.017,10.076,7.825"></path>
						</svg></a></span>`
      footer = ``
      header = ``
      noTitle = true
    }

    let body =
    `     <article ${noTitle ? 'class="noTitle"' : ''}>
            ${header}
            ${section}
        </article>`

    return body
  }

  render(data) {
        //  array.reverse() is destructive
        //  array.slice() is a javascript idiom
        //                     to copy an array
    let posts = data.collections.tepiton.slice()

    let head = `<h1 class="logo">${ data.config.siteName }</h1>`
    let body =
    `   <div class="tepiton">
          ${posts.reverse().map(post => this.renderPost(post)).join("\n")}
        </div>`

    return head + body
  }
}

