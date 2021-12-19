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
    // summary = this.renderTemplate(summary.toString(), "njk")
    summary = this.markdown2(summary)     // wraps in <p>

    if (post.data.newlines) {
      summary = summary.trim().replace(/\n/g, '<br>\n')
    }

    let noTitle = false
    let header  = post.data.title && `<header><a href="${post.url}">${this.markdown(post.data.title)}</a></header>`
    let section = `<section>${summary}</section>`
    let footer  = `<footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>`

      //  http://svgicons.sparkk.fr/

    if (post.data.title === stars) {
      header = `<a href="${post.url}"><div class="ex"></div></a>`
      footer = ``
      noTitle = true
    }

    let body =
    `     <article ${noTitle ? 'class="noTitle"' : ''}>
            ${header}
            ${section}
        </article>`

    return body
  }

  async render(data) {
        //  array.reverse() is destructive
        //  array.slice() is a javascript idiom
        //                     to copy an array

    let head = `<h1 class="logo">${ data.config.siteName }</h1>`

    let body =
    ` <h3>whisper</h3>
    `
    let embed = `{% oembed "https://twitter.com/MadMenQts/status/1464094834898132993?s=20" %}`
    // embed = "* one\n* two\n* _three_"

    body +=  await this.renderTemplate(embed, "njk")

    return head + body
  }
}

