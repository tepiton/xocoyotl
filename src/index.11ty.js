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
      footer = ``
      header = ``
      noTitle = true
    }

    let body =
    `     <article ${noTitle ? 'class="noTitle"' : ''}>
            ${header}
            ${section}
            <div class="ex">
            </div>
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

